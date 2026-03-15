import requests
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import polyline
from geopy.distance import geodesic

class VayuRoutingEngine:
    def __init__(self, tile_generator):
        self.generator = tile_generator
        self.osrm_base_url = "http://router.project-osrm.org/route/v1/driving"

    def get_osrm_routes(self, start_lat, start_lon, end_lat, end_lon):
        """
        Step 1: Fetch candidate routes from OSRM.
        """
        url = f"{self.osrm_base_url}/{start_lon},{start_lat};{end_lon},{end_lat}?alternatives=true&geometries=polyline&overview=full"
        response = requests.get(url)
        if response.status_code != 200:
            return []
        
        data = response.json()
        return data.get("routes", [])

    def sample_route_pollution(self, route_polyline, time_offset=0):
        """
        Step 2: Sample points every 200m and predict PM2.5.
        """
        coords = polyline.decode(route_polyline)
        if not coords:
            return [], 0

        # Sample every 200m
        sampled_points = [coords[0]]
        total_dist = 0
        last_point = coords[0]
        
        for i in range(1, len(coords)):
            d = geodesic(last_point, coords[i]).meters
            total_dist += d
            if d >= 200:
                sampled_points.append(coords[i])
                last_point = coords[i]
        
        if sampled_points[-1] != coords[-1]:
            sampled_points.append(coords[-1])

        # Predict PM2.5 for sampled points
        # Get weather for the center of the route (simplified)
        center_lat = (sampled_points[0][0] + sampled_points[-1][0]) / 2
        center_lon = (sampled_points[0][1] + sampled_points[-1][1]) / 2
        temp, wind = self.generator.fetch_weather(center_lat, center_lon)

        point_array = np.array(sampled_points)
        pm25_values = self.generator.predict_batch(point_array, temp=temp, wind=wind, time_offset=time_offset)
        
        return list(zip(sampled_points, pm25_values)), total_dist

    def calculate_exposure(self, sampled_pollution, total_duration_sec):
        """
        Step 3: Compute pollution exposure (Σ PM2.5 × time_spent).
        Exposure in µg·min/m³.
        """
        if not sampled_pollution:
            return 0
        
        avg_pm25 = np.mean([p[1] for p in sampled_pollution])
        duration_min = total_duration_sec / 60
        exposure = avg_pm25 * duration_min
        return round(exposure, 2)

    def route_to_geojson(self, route, category, exposure):
        """
        Step 6: Segment route and color based on AQI.
        """
        coords = polyline.decode(route["geometry"])
        # In a real implementation, we'd map each coordinate to its predicted AQI
        # For this task, we'll assign segments simplified AQI properties
        
        geojson = {
            "type": "Feature",
            "properties": {
                "category": category,
                "exposure": exposure,
                "duration": route["duration"],
                "distance": route["distance"],
                "color": self.get_category_color(category)
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [[c[1], c[0]] for c in coords] # GeoJSON is [lon, lat]
            }
        }
        return geojson

    def get_category_color(self, category):
        if category == "cleanest": return "#10b981" # Green
        if category == "balanced": return "#3b82f6" # Blue
        return "#64748b" # Gray (Fastest)

    def get_clean_route(self, start_lat, start_lon, end_lat, end_lon, time_offset=0):
        routes = self.get_osrm_routes(start_lat, start_lon, end_lat, end_lon)
        if not routes:
            return None

        scored_routes = []
        for i, route in enumerate(routes):
            sampled_pollution, total_dist = self.sample_route_pollution(route["geometry"], time_offset)
            exposure = self.calculate_exposure(sampled_pollution, route["duration"])
            
            # Step 4: Scoring
            fastest_score = route["duration"]
            cleanest_score = exposure
            balanced_score = 0.6 * exposure + 0.4 * (route["duration"] / 60) # Normalize duration to min

            scored_routes.append({
                "route": route,
                "exposure": exposure,
                "fastest_score": fastest_score,
                "cleanest_score": cleanest_score,
                "balanced_score": balanced_score
            })

        # Selection
        cleanest = min(scored_routes, key=lambda x: x["cleanest_score"])
        balanced = min(scored_routes, key=lambda x: x["balanced_score"])
        fastest = min(scored_routes, key=lambda x: x["fastest_score"])

        return {
            "cleanest_route": self.route_to_geojson(cleanest["route"], "cleanest", cleanest["exposure"]),
            "balanced_route": self.route_to_geojson(balanced["route"], "balanced", balanced["exposure"]),
            "fastest_route": self.route_to_geojson(fastest["route"], "fastest", fastest["exposure"]),
            "exposure_values": {
                "cleanest": cleanest["exposure"],
                "balanced": balanced["exposure"],
                "fastest": fastest["exposure"]
            },
            "hotspots": self.find_hotspots(scored_routes[0]["route"]["geometry"], time_offset)
        }

    def find_hotspots(self, route_polyline, time_offset):
        """
        Step 9: Identify points where PM2.5 > 100.
        """
        sampled_pollution, _ = self.sample_route_pollution(route_polyline, time_offset)
        hotspots = []
        for (lat, lon), pm25 in sampled_pollution:
            if pm25 > 100:
                hotspots.append({"lat": lat, "lon": lon, "pm25": round(pm25, 1)})
        return hotspots
