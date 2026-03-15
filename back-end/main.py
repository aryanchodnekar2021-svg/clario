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

@app.get("/")
async def root():
    return {"message": "Vayu Environmental Intelligence API Nominal"}

@app.post("/route-clean-air")
async def route_clean_air(request: RouteRequest):
    # Logic to calculate cleanest route using OSRM and PM2.5 predictions
    return {
        "route_id": "clean_123",
        "points": [
            [request.origin.lat, request.origin.lng],
            [request.destination.lat, request.destination.lng]
        ],
        "pm25_avg": 12.5,
        "savings": "24%"
    }

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
