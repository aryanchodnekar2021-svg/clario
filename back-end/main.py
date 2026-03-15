from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from pydantic import BaseModel
from typing import List, Optional
from tile_generator import TileGenerator

app = FastAPI(title="Vayu AI Backend")
generator = TileGenerator()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/tiles/{layer}/{z}/{x}/{y}.png")
async def get_layered_tile(layer: str, z: int, x: int, y: int):
    """
    Tile server endpoint for specific layers.
    """
    cached_tile = await generator.get_tile_from_cache(z, x, y, layer=layer)
    if cached_tile:
        return Response(content=cached_tile, media_type="image/png")
    
    try:
        image_data = generator.generate_tile(z, x, y, layer=layer)
        await generator.save_tile_to_cache(z, x, y, image_data, layer=layer)
        return Response(content=image_data, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/forecast_tiles/{time_offset}/{z}/{x}/{y}.png")
async def get_forecast_tile(time_offset: int, z: int, x: int, y: int, layer: str = "pm25"):
    """
    Tile server endpoint for future predictions.
    """
    cached_tile = await generator.get_tile_from_cache(z, x, y, layer=layer, time_offset=time_offset)
    if cached_tile:
        return Response(content=cached_tile, media_type="image/png")
    
    try:
        image_data = generator.generate_tile(z, x, y, layer=layer, time_offset=time_offset)
        await generator.save_tile_to_cache(z, x, y, image_data, layer=layer, time_offset=time_offset)
        return Response(content=image_data, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tiles/{z}/{x}/{y}.png")
async def get_tile(z: int, x: int, y: int):
    # Legacy support
    return await get_layered_tile("pm25", z, x, y)

class RoutePoint(BaseModel):
    lat: float
    lng: float

class RouteRequest(BaseModel):
    origin: RoutePoint
    destination: RoutePoint

from routing_engine import VayuRoutingEngine
import json
import redis

# Initialize routing engine
routing_engine = VayuRoutingEngine(generator)

# Optional Redis Config
try:
    r = redis.Redis(host='localhost', port=6379, db=0)
except:
    r = None

class CleanRouteRequest(BaseModel):
    start_lat: float
    start_lon: float
    end_lat: float
    end_lon: float
    forecast_hours: Optional[int] = 0

@app.get("/")
async def root():
    return {"message": "Vayu Environmental Intelligence API Nominal"}

@app.post("/clean-route")
async def get_clean_route(request: CleanRouteRequest):
    """
    Step 5: FastAPI endpoint to return cleaned routes and exposure scores.
    """
    # Step 10: Redis Caching
    cache_key = f"route:{request.start_lat}:{request.start_lon}:{request.end_lat}:{request.end_lon}:{request.forecast_hours}"
    if r:
        cached = r.get(cache_key)
        if cached:
            return json.loads(cached)

    try:
        result = routing_engine.get_clean_route(
            request.start_lat, request.start_lon, 
            request.end_lat, request.end_lon, 
            time_offset=request.forecast_hours
        )
        
        if not result:
            raise HTTPException(status_code=404, detail="No routes found")

        # Cache for 30 mins
        if r:
            r.setex(cache_key, 1800, json.dumps(result))
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/route-clean-air")
async def route_clean_air_legacy(request: RouteRequest):
    # Backward compatibility
    return await get_clean_route(CleanRouteRequest(
        start_lat=request.origin.lat,
        start_lon=request.origin.lng,
        end_lat=request.destination.lat,
        end_lon=request.destination.lng
    ))

@app.get("/exposure")
async def get_exposure(user_id: str):
    # Logic to fetch user exposure analytics from Supabase
    return {
        "weekly_score": 82,
        "status": "Good",
        "trend": "decreasing"
    }

@app.post("/event-prediction")
async def event_prediction(lat: float, lng: float, timestamp: int):
    # AI Prediction for future date
    return {
        "predicted_pm25": 45.2,
        "confidence": 0.92,
        "safety_status": "GO"
    }

@app.post("/sensor-reading")
async def post_sensor(sensor_id: str, pm25: float):
    # Ingest IoT sensor data
    return {"status": "success"}

@app.post("/push-alert-check")
async def push_alert_check(user_id: str):
    # Check if notification should be sent via Firebase
    return {"triggered": False}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
