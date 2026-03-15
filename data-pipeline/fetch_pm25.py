import httpx
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

async def fetch_openaq_data(cities: List[str] = ["Mumbai", "Kalyan"]) -> List[Dict]:
    """
    Fetch PM2.5 measurements from OpenAQ for specified cities.
    """
    url = "https://api.openaq.org/v2/latest"
    params = {
        "city": cities,
        "parameter": "pm25",
        "limit": 100,
        "sort": "desc"
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            observations = []
            for result in data.get("results", []):
                location = result.get("location")
                coords = result.get("coordinates")
                
                # Find PM2.5 in measurements
                pm25_val = None
                for m in result.get("measurements", []):
                    if m.get("parameter") == "pm25":
                        pm25_val = m.get("value")
                        last_updated = m.get("lastUpdated")
                        break
                
                if coords and pm25_val is not None:
                    observations.append({
                        "location_name": location,
                        "lat": coords.get("latitude"),
                        "lon": coords.get("longitude"),
                        "pm25": pm25_val,
                        "timestamp": last_updated
                    })
            
            logger.info(f"Fetched {len(observations)} PM2.5 observations from OpenAQ")
            return observations
            
    except Exception as e:
        logger.error(f"Failed to fetch OpenAQ data: {e}")
        return []

if __name__ == "__main__":
    import asyncio
    logging.basicConfig(level=logging.INFO)
    res = asyncio.run(fetch_openaq_data())
    print(res)
