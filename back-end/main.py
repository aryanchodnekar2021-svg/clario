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

@app.get("/tiles/{z}/{x}/{y}.png")
async def get_tile(z: int, x: int, y: int):
    """
    Step 7: Tile server endpoint.
    Checks cache first, then generates and caches new tile.
    """
    # 1. Check cache (Step 8)
    cached_tile = await generator.get_tile_from_cache(z, x, y)
    if cached_tile:
        return Response(content=cached_tile, media_type="image/png")
    
    # 2. Generate if missing (Step 6)
    try:
        image_data = generator.generate_tile(z, x, y)
        
        # 3. Cache it (Step 8) - Background task would be better in prod
        await generator.save_tile_to_cache(z, x, y, image_data)
        
        return Response(content=image_data, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
