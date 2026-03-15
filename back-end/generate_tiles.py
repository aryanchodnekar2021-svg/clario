import asyncio
import mercantile
from tile_generator import TileGenerator
import time

async def generate_all_tiles(lat_min=18.5, lat_max=19.5, lon_min=72.5, lon_max=73.5, zoom_range=range(6, 13)):
    """
    Step 9: Cron job logic to pre-generate and cache tiles every 30 mins.
    """
    generator = TileGenerator()
    print(f"Starting scheduled tile generation for zoom levels {list(zoom_range)}...")
    
    start_time = time.time()
    count = 0
    
    for z in zoom_range:
        # Get tiles covering the region
        tiles = mercantile.tiles(lon_min, lat_min, lon_max, lat_max, z)
        for t in tiles:
            print(f"Generating tile {z}/{t.x}/{t.y}...")
            image_data = generator.generate_tile(z, t.x, t.y)
            await generator.save_tile_to_cache(z, t.x, t.y, image_data)
            count += 1
            
    end_time = time.time()
    print(f"Finished. Generated {count} tiles in {end_time - start_time:.2f} seconds.")

if __name__ == "__main__":
    while True:
        print("Generating pollution tiles...")
        asyncio.run(generate_all_tiles())
        print("Sleeping 30 minutes...")
        time.sleep(1800)
