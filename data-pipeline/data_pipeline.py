import os
import asyncio
import logging
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client
from fetch_pm25 import fetch_openaq_data
from fetch_weather import fetch_weather_data

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Missing Supabase configuration in .env")
    supabase: Client = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def calculate_aqi(pm25: float) -> int:
    """Simple internal AQI calculation for PM2.5 (US EPA scale proxy)"""
    if pm25 <= 12: return int((50/12) * pm25)
    if pm25 <= 35.4: return int(((100-51)/(35.4-12.1)) * (pm25-12.1) + 51)
    if pm25 <= 55.4: return int(((150-101)/(55.4-35.5)) * (pm25-35.5) + 101)
    if pm25 <= 150.4: return int(((200-151)/(150.4-55.5)) * (pm25-55.5) + 151)
    if pm25 <= 250.4: return int(((300-201)/(250.4-150.5)) * (pm25-150.5) + 201)
    return 301 # Hazardous+

async def run_pipeline():
    """
    Main pipeline to fetch, merge and store observations.
    """
    logger.info("Starting data ingestion pipeline...")
    
    # 1. Fetch PM2.5 Data
    pm_observations = await fetch_openaq_data()
    if not pm_observations:
        logger.warning("No PM2.5 data fetched. Aborting pipeline.")
        return

    records = []
    
    # 2. Fetch Weather for each location and Merge
    for obs in pm_observations:
        weather = await fetch_weather_data(obs["lat"], obs["lon"])
        if weather:
            record = {
                "lat": obs["lat"],
                "lon": obs["lon"],
                "timestamp": obs["timestamp"],
                "pm25": obs["pm25"],
                "aqi": calculate_aqi(obs["pm25"]),
                "temperature": weather["temperature"],
                "humidity": weather["humidity"],
                "wind_speed": weather["wind_speed"],
                "wind_direction": weather["wind_direction"]
            }
            records.append(record)
            logger.debug(f"Merged record for {obs.get('location_name')}")

    # 3. Store in Supabase
    if records and supabase:
        try:
            response = supabase.table("air_quality_observations").upsert(
                records, on_conflict="lat,lon,timestamp"
            ).execute()
            logger.info(f"Successfully inserted/updated {len(records)} records in Supabase")
        except Exception as e:
            logger.error(f"Failed to upsert records to Supabase: {e}")
    elif not supabase:
        logger.warning("Supabase client not initialized. Records not stored.")
        # print(records) # For local testing
    else:
        logger.info("No records to store.")

if __name__ == "__main__":
    asyncio.run(run_pipeline())
