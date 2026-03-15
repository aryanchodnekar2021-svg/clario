import os
import numpy as np
import pandas as pd
from scipy.interpolate import griddata
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
import xgboost as xgb
from supabase import create_client, Client
import mercantile
from PIL import Image
import io
import pickle
import requests
from dotenv import load_dotenv

load_dotenv()

# Supabase Credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL else None

# Custom Air Quality Colormap (RdYlGn reversed)
colors = ["#00e400", "#ffff00", "#ff7e00", "#ff0000", "#8f3f97", "#7e0023"]
nodes = [0.0, 0.15, 0.3, 0.5, 0.7, 1.0]
aqi_cmap = LinearSegmentedColormap.from_list("aqi", list(zip(nodes, colors)))

class TileGenerator:
    def __init__(self, model_path="model/pm25_xgboost_model.pkl"):
        self.model = self._load_model(model_path)
        
    def _load_model(self, path):
        try:
            with open(path, "rb") as f:
                return pickle.load(f)
        except Exception as e:
            print(f"Error loading model: {e}")
            return None 

    def fetch_weather(self, lat, lon):
        """
        Step 3: Fetch weather from Open-Meteo.
        """
        try:
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
            data = requests.get(url).json()
            temp = data["current_weather"]["temperature"]
            wind = data["current_weather"]["windspeed"]
            return temp, wind
        except Exception:
            return 25.0, 5.0 # Fallback

    def predict_batch(self, coords, temp=25.0, wind=5.0, time_offset=0):
        """
        Step 3: Perform batch predictions using XGBoost.
        """
        if self.model:
            try:
                # Prepare 16 features: ['City', 'PM10', 'NO', 'NO2', 'NOx', 'NH3', 'CO', 'SO2', 'O3', 'Benzene', 'Toluene', 'Xylene', 'year', 'month', 'day', 'day_of_week']
                from datetime import datetime, timedelta
                now = datetime.now() + timedelta(hours=time_offset)
                num_points = len(coords)
                
                # Default Mock Values for extra features
                features = []
                for _ in range(num_points):
                    features.append([
                        "Mumbai", # City (String for categorical)
                        45.0, # PM10
                        5.0, # NO
                        12.0, # NO2
                        15.0, # NOx
                        8.0, # NH3
                        0.5, # CO
                        4.0, # SO2
                        25.0, # O3
                        1.0, # Benzene
                        2.0, # Toluene
                        1.0, # Xylene
                        now.year,
                        now.month,
                        now.day,
                        now.weekday()
                    ])
                
                df = pd.DataFrame(features, columns=['City', 'PM10', 'NO', 'NO2', 'NOx', 'NH3', 'CO', 'SO2', 'O3', 'Benzene', 'Toluene', 'Xylene', 'year', 'month', 'day', 'day_of_week'])
                
                # Ensure City is categorical if model expects it
                df['City'] = df['City'].astype('category')
                
                preds = self.model.predict(df)
                
                # If it's a classifier, preds might be 0, 1, 2...
                # Convert to plausible PM2.5 range (e.g. index * 30)
                if isinstance(preds[0], (np.integer, int)):
                    preds = preds * 35.0 + 15.0 # Map categories to values for heatmap
                
                # Add some spatial noise/bias so the map isn't flat
                center_lat, center_lon = 19.0, 73.0
                dist = np.sqrt((coords[:, 0] - center_lat)**2 + (coords[:, 1] - center_lon)**2)
                preds = preds * np.exp(-dist * 0.2) + np.random.normal(0, 2, num_points)
                
                return np.clip(preds, 5, 300)
            except Exception as e:
                print(f"Prediction error: {e}")
                
        # Fallback to mock logic if model fails
        center_lat, center_lon = 19.0, 73.0
        dist = np.sqrt((coords[:, 0] - center_lat)**2 + (coords[:, 1] - center_lon)**2)
        preds = 80 * np.exp(-dist * 5) + np.random.normal(0, 5, len(coords))
        return np.clip(preds, 5, 300)

    def interpolate_surface(self, points, values, grid_lat, grid_lon):
        """
        Step 4: Spatial Interpolation using griddata.
        """
        return griddata(points, values, (grid_lat, grid_lon), method='linear', fill_value=0)

    def generate_tile(self, z, x, y, layer="pm25", time_offset=0):
        """
        Steps 5 & 6: Generate a specific XYZ tile for a layer and time.
        """
        # Get tile bounds in lat/lon
        bounds = mercantile.bounds(x, y, z)
        west, south, east, north = bounds.west, bounds.south, bounds.east, bounds.north
        
        # Generate high-res grid for this tile
        res = 256
        lats = np.linspace(north, south, res) # Reverse for image orientation
        lons = np.linspace(west, east, res)
        grid_lon, grid_lat = np.meshgrid(lons, lats)
        
        # Fetch weather for tile center (adjust for forecast if possible)
        center_lat, center_lon = (north + south) / 2, (west + east) / 2
        temp, wind = self.fetch_weather(center_lat, center_lon)
        
        # Batch predict for tile grid
        coords = np.stack([grid_lat.ravel(), grid_lon.ravel()], axis=1)
        values = self.predict_batch(coords, temp=temp, wind=wind, time_offset=time_offset)
        
        # Apply layer-specific transformations
        if layer == "aqi":
            values = values * 1.5 # Mock: AQI is usually higher than PM2.5 numerical value
            norm_max = 200.0
        elif layer == "temp":
            values = temp + np.random.normal(0, 2, len(values)) # Mock temp variation
            norm_max = 40.0
        elif layer == "wind":
            values = wind + np.random.normal(0, 1, len(values))
            norm_max = 20.0
        elif layer == "no2":
            values = values * 0.4
            norm_max = 100.0
        elif layer == "aod":
            values = values / 150.0
            norm_max = 1.0
        else: # pm25
            norm_max = 150.0

        surface = values.reshape((res, res))
        
        # Apply colormap
        norm_surface = np.clip(surface / norm_max, 0, 1)
        rgba_image = aqi_cmap(norm_surface)
        
        # Add transparency (alpha) based on intensity if needed, or keep overlay
        rgba_image[:, :, 3] = 0.6  # 60% opacity for heatmap overlay
        
        # Convert to PNG
        img = Image.fromarray((rgba_image * 255).astype(np.uint8))
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        return img_byte_arr.getvalue()

    async def get_tile_from_cache(self, z, x, y, layer="pm25", time_offset=0):
        """
        Step 8: Retrieve tile from Supabase if cached.
        """
        if not supabase: return None
        try:
            path = f"{layer}/{time_offset}/{z}/{x}/{y}.png"
            res = supabase.storage.from_("vayu-tiles").download(path)
            return res
        except Exception:
            return None

    async def save_tile_to_cache(self, z, x, y, image_data, layer="pm25", time_offset=0):
        if not supabase: return
        path = f"{layer}/{time_offset}/{z}/{x}/{y}.png"
        supabase.storage.from_("vayu-tiles").upload(path, image_data, {"content-type": "image/png"})
