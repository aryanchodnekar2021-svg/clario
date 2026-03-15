'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Map, Source, Layer, NavigationControl, GeolocateControl, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '@/store/useStore';
import { formatAqi } from '@/lib/utils';
import { Wind, Droplets, Info, X, Zap, Map as MapIcon, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapFilterPanel from './MapFilterPanel';
import RoutePlanner from './RoutePlanner';

const CARTO_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const SATELLITE_STYLE = {
  version: 8,
  sources: {
    'satellite': {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
    }
  },
  layers: [
    {
      id: 'satellite',
      type: 'raster',
      source: 'satellite',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

export default function PollutionMap() {
  const [viewState, setViewState] = useState({
    longitude: 72.8777,
    latitude: 19.0760,
    zoom: 10
  });
  const [showAqiCard, setShowAqiCard] = useState(true);
  const [mapStyle, setMapStyle] = useState('light');
  
  // Filter States
  const [activeLayer, setActiveLayer] = useState('pm25');
  const [opacity, setOpacity] = useState(0.7);
  const [timeOffset, setTimeOffset] = useState(0);
  const [range, setRange] = useState([0, 300]);
  const [selectedCategories, setSelectedCategories] = useState(['good', 'moderate', 'sensitive', 'unhealthy', 'very_unhealthy', 'hazardous']);

  // Routing State
  const [routeData, setRouteData] = useState(null);
  const [selectedRouteType, setSelectedRouteType] = useState(null);

  const { userLocation, setUserLocation } = useStore();
  const [userPos, setUserPos] = useState(null);

  // Mock AQI data for the floating card
  const aqiData = {
    pm25: activeLayer === 'pm25' ? 18.2 : 45.1,
    aqi: activeLayer === 'pm25' ? 64 : 110,
    lastUpdate: '6:30 PM',
    healthMsg: activeLayer === 'pm25' 
        ? 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern.'
        : 'Predictive modeling suggests increasing pollution levels in the next 24 hours.'
  };

  const { label, color, bg } = formatAqi(aqiData.aqi);

  // Derive Tile URL
  const getTileUrl = () => {
    const baseUrl = 'http://localhost:8000';
    if (timeOffset > 0) {
      return `${baseUrl}/forecast_tiles/${timeOffset}/{z}/{x}/{y}.png?layer=${activeLayer}`;
    }
    return `${baseUrl}/tiles/${activeLayer}/{z}/{x}/{y}.png`;
  };

  const handleRouteSelected = (data, type) => {
    setRouteData(data);
    setSelectedRouteType(type);
    
    // Auto-focus on route if available
    if (data && data[`${type}_route`]?.geometry?.coordinates?.length > 0) {
        const coords = data[`${type}_route`].geometry.coordinates;
        setViewState(prev => ({
            ...prev,
            longitude: coords[0][0],
            latitude: coords[0][1],
            zoom: 12,
            transitionDuration: 1000
        }));
    }
  };

  // Step 5: Update user location every 10 seconds

  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setUserPos(newPos);
            setUserLocation?.(newPos);
          },
          (err) => console.error('Geolocation error:', err),
          { enableHighAccuracy: true }
        );
      }
    };

    updateLocation();
    const interval = setInterval(updateLocation, 10000);
    return () => clearInterval(interval);
  }, [setUserLocation]);

  const onMove = useCallback((evt) => {
    setViewState(evt.viewState);
  }, []);

  const toggleStyle = () => {
    setMapStyle(prev => prev === 'light' ? 'satellite' : 'light');
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      <Map
        {...viewState}
        onMove={onMove}
        mapStyle={mapStyle === 'light' ? CARTO_STYLE : SATELLITE_STYLE}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl 
          position="top-right" 
          trackUserLocation 
          positionOptions={{ enableHighAccuracy: true }}
        />

        {/* User Location Marker */}
        {userPos && (
          <Marker longitude={userPos.lng} latitude={userPos.lat} anchor="bottom">
            <div className="relative">
              <div className="absolute -inset-2 bg-blue-500 rounded-full blur opacity-40 animate-pulse" />
              <div className="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg" />
            </div>
          </Marker>
        )}

        {/* Route Visualization */}
        {routeData && selectedRouteType && (
            <Source id="vayu-route" type="geojson" data={routeData[`${selectedRouteType}_route`]}>
                <Layer
                    id="route-glow"
                    type="line"
                    paint={{
                        'line-color': routeData[`${selectedRouteType}_route`]?.properties?.color || '#3b82f6',
                        'line-width': 12,
                        'line-opacity': 0.2,
                        'line-blur': 8
                    }}
                />
                <Layer
                    id="route-line"
                    type="line"
                    layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                    paint={{
                        'line-color': routeData[`${selectedRouteType}_route`]?.properties?.color || '#3b82f6',
                        'line-width': 6
                    }}
                />
            </Source>
        )}

        {/* Hotspot Markers */}
        {routeData?.hotspots?.map((h, i) => (
            <Marker key={i} longitude={h.lon} latitude={h.lat}>
                <div className="group relative cursor-help">
                    <div className="absolute -inset-4 bg-red-600 rounded-full blur-[10px] opacity-40 animate-pulse" />
                    <AlertTriangle className="relative w-5 h-5 text-red-500 fill-red-500/10 stroke-[3px]" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 rounded-lg text-[8px] font-black text-white border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {h.pm25} µg/m³
                    </div>
                </div>
            </Marker>
        ))}

        {/* Dynamic Air Quality Raster Heatmap Layer */}
        <Source
          key={`${activeLayer}-${timeOffset}`} // Force source refresh on layer/time change
          id="air-source"
          type="raster"
          tiles={[getTileUrl()]}
          tileSize={256}
          scheme="xyz"
        >
          <Layer
            id="air-layer"
            type="raster"
            paint={{
              'raster-opacity': opacity,
              'raster-fade-duration': 500
            }}
          />
        </Source>

        {/* Satellite View Switcher (Top Right) */}
        <div className="absolute top-4 right-16 z-10">
            <button 
                onClick={toggleStyle}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg"
            >
                <MapIcon className="w-3 h-3 text-blue-400" />
                {mapStyle === 'light' ? 'Satellite' : 'Map'}
            </button>
        </div>
      </Map>

      {/* Advanced Filter Panel (Left Side) */}
      <MapFilterPanel
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        opacity={opacity}
        setOpacity={setOpacity}
        timeOffset={timeOffset}
        setTimeOffset={setTimeOffset}
        range={range}
        setRange={setRange}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />

      {/* Navigation Planner (Top Right) */}
      <RoutePlanner onRouteSelected={handleRouteSelected} forecastHours={timeOffset} />

      {/* Floating AQI Card */}
      <AnimatePresence>
        {showAqiCard && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute bottom-8 left-8 z-20 w-80"
          >
            <div className="glass-morphism rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className={`absolute -top-12 -right-12 w-32 h-32 blur-[40px] opacity-20 ${bg}`} />
                
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white leading-none">
                            {aqiData.aqi}
                            <span className="text-[10px] ml-1 text-muted-foreground uppercase tracking-widest font-black">AQI</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Zap className="w-3 h-3" style={{ color }} />
                            <span className="text-xs font-bold uppercase tracking-tighter" style={{ color }}>
                                {label}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowAqiCard(false)}
                        className="p-1.5 rounded-full hover:bg-white/5 text-muted-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-[11px] text-white/70 leading-relaxed font-medium mb-4 p-3 bg-white/5 rounded-xl border border-white/5">
                    {aqiData.healthMsg}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">PM2.5</p>
                        <p className="text-base font-bold text-white">{aqiData.pm25} <span className="text-[9px] font-normal opacity-50">µg/m³</span></p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Wind</p>
                        <div className="flex items-center gap-1.5">
                            <Wind className="w-3 h-3 text-blue-400" />
                            <p className="text-sm font-bold text-white">8.2 km/h</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                    <span>Mumbai Central</span>
                    <span>Updated {aqiData.lastUpdate}</span>
                </div>
            </div>
          </motion.div>
        )}

        {!showAqiCard && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowAqiCard(true)}
            className="absolute bottom-8 left-8 w-12 h-12 glass-morphism rounded-2xl flex items-center justify-center border border-white/10 shadow-xl z-20"
          >
            <Info className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
