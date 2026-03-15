import numpy as np

def generate_spatial_grid(lat_min=18.5, lat_max=19.5, lon_min=72.5, lon_max=73.5, resolution=0.01):
    """
    Step 2: Generate a grid of coordinates covering the target region.
    """
    lats = np.arange(lat_min, lat_max, resolution)
    lons = np.arange(lon_min, lon_max, resolution)
    lon_grid, lat_grid = np.meshgrid(lons, lats)
    
    # Flatten for batch prediction
    coords = np.stack([lat_grid.ravel(), lon_grid.ravel()], axis=1)
    
    return lat_grid, lon_grid, coords

if __name__ == "__main__":
    lat_grid, lon_grid, coords = generate_spatial_grid()
    print(f"Generated grid with {coords.shape[0]} points.")
    print(f"Lat bounds: {lat_grid.min()} to {lat_grid.max()}")
    print(f"Lon bounds: {lon_grid.min()} to {lon_grid.max()}")
