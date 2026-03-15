import httpx
import logging
from typing import Dict, Optional

logger = logging.getLogger(__name__)

async def fetch_weather_data(lat: float, lon: float) -> Optional[Dict]:
    """
    Fetch current weather and atmospheric features from Open-Meteo.
    """
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "wind_direction_10m"],
        "hourly": "boundary_layer_height",
        "forecast_days": 1
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            current = data.get("current", {})
            hourly = data.get("hourly", {})
            
            # Use first hourly value for boundary_layer_height as a proxy for current
            blh = hourly.get("boundary_layer_height", [None])[0]
            
            return {
                "temperature": current.get("temperature_2m"),
                "humidity": current.get("relative_humidity_2m"),
                "wind_speed": current.get("wind_speed_10m"),
                "wind_direction": current.get("wind_direction_10m"),
                "boundary_layer_height": blh
            }
            
    except Exception as e:
        logger.error(f"Failed to fetch weather for {lat}, {lon}: {e}")
        return None

if __name__ == "__main__":
    import asyncio
    logging.basicConfig(level=logging.INFO)
    res = asyncio.run(fetch_weather_data(19.076, 72.877))
    print(res)
