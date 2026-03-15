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
    def __init__(self, model_path=None):
        self.model = self._load_model(model_path)
        
    def _load_model(self, path):
        # Placeholder for loading actual XGBoost model
        # return xgb.Booster().load_model(path)
        return None 

    def predict_batch(self, coords, weather_context=None):
        """
        Step 3: Perform batch predictions using XGBoost.
        """
        # Mock weather for grid
        temp = weather_context.get('temp', 28.0) if weather_context else 28.0
        hum = weather_context.get('humidity', 65.0) if weather_context else 65.0
        wind = weather_context.get('wind', 12.0) if weather_context else 12.0
        
        # In production, replace with real inference
        # input_data = pd.DataFrame(coords, columns=['lat', 'lon'])
        # input_data['temp'] = temp ...
        # return self.model.predict(xgb.DMatrix(input_data))
        
        # For demo: random prediction based on center concentration
        center_lat, center_lon = 19.0, 73.0
        dist = np.sqrt((coords[:, 0] - center_lat)**2 + (coords[:, 1] - center_lon)**2)
        preds = 80 * np.exp(-dist * 5) + np.random.normal(0, 5, len(coords))
        return np.clip(preds, 5, 300)

    def interpolate_surface(self, points, values, grid_lat, grid_lon):
        """
        Step 4: Spatial Interpolation using griddata.
        """
        return griddata(points, values, (grid_lat, grid_lon), method='linear', fill_value=0)

    def generate_tile(self, z, x, y):
        """
        Steps 5 & 6: Generate a specific XYZ tile.
        """
        # Get tile bounds in lat/lon
        bounds = mercantile.bounds(x, y, z)
        west, south, east, north = bounds.west, bounds.south, bounds.east, bounds.north
        
        # Generate high-res grid for this tile
        res = 256
        lats = np.linspace(north, south, res) # Reverse for image orientation
        lons = np.linspace(west, east, res)
        grid_lon, grid_lat = np.meshgrid(lons, lats)
        
        # Batch predict for tile grid
        coords = np.stack([grid_lat.ravel(), grid_lon.ravel()], axis=1)
        values = self.predict_batch(coords)
        surface = values.reshape((res, res))
        
        # Apply colormap
        norm_surface = np.clip(surface / 150.0, 0, 1) # Normalizing 0-150 range
        rgba_image = aqi_cmap(norm_surface)
        
        # Add transparency (alpha) based on intensity if needed, or keep overlay
        rgba_image[:, :, 3] = 0.6  # 60% opacity for heatmap overlay
        
        # Convert to PNG
        img = Image.fromarray((rgba_image * 255).astype(np.uint8))
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        return img_byte_arr.getvalue()

    async def get_tile_from_cache(self, z, x, y):
        """
        Step 8: Retrieve tile from Supabase if cached.
        """
        if not supabase: return None
        try:
            path = f"{z}/{x}/{y}.png"
            res = supabase.storage.from_("pm25-tiles").download(path)
            return res
        except Exception:
            return None

    async def save_tile_to_cache(self, z, x, y, image_data):
        if not supabase: return
        path = f"{z}/{x}/{y}.png"
        supabase.storage.from_("pm25-tiles").upload(path, image_data, {"content-type": "image/png"})
