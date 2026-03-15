'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '@/store/useStore';
import { LocateFixed, Layers, Search, Wind, Droplets, Info, X, User } from 'lucide-react';
import { formatAqi } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function MapPage() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { userLocation, layer, setLayer } = useStore();
  const [showAqiCard, setShowAqiCard] = useState(true);

  // Mock AQI data for the map card
  const aqiData = {
    pm25: 18.2,
    aqi: 64,
    lastUpdate: '10:30 AM',
    healthMsg: 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern.'
  };

  const { label, color, bg } = formatAqi(aqiData.aqi);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Standard Stadia Alidade Smooth Dark style
    // Using a public key or generic tile server for demonstration
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: [
              'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; Stadia Maps &copy; OpenStreetMap'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
          }
        ]
      },
      center: [userLocation?.lng || -74.006, userLocation?.lat || 40.7128],
      zoom: 12,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');

    const interval = setInterval(() => {
      // Logic to refresh heatmap layer if it were implemented
    }, 30 * 60 * 1000);

    return () => {
      clearInterval(interval);
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Global Gradient Overlays for Map */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Search Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 max-w-lg mx-auto">
        <div className="glass-morphism rounded-2xl px-4 py-3 flex items-center gap-3 border-white/10 shadow-2xl">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input 
            placeholder="Search for a city or area..." 
            className="bg-transparent border-none outline-none flex-1 text-sm text-white placeholder:text-muted-foreground/60"
          />
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 text-blue-400">
              <LocateFixed className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="absolute top-24 right-4 z-10 flex flex-col gap-3">
        <button 
          onClick={() => setLayer(layer === 'pm25' ? 'aod' : 'pm25')}
          className="w-12 h-12 glass-morphism rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 active:scale-95 group relative"
        >
          <Layers className="w-6 h-6 text-white" />
          <div className="absolute right-full mr-3 px-2 py-1 glass-morphism rounded text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {layer === 'pm25' ? 'Switch to AOD' : 'Switch to PM2.5'}
          </div>
        </button>

        <button 
          onClick={() => window.location.href = '/profile'}
          className="w-12 h-12 glass-morphism rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 active:scale-95 group relative"
        >
          <User className="w-6 h-6 text-white" />
          <div className="absolute right-full mr-3 px-2 py-1 glass-morphism rounded text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Health Profile
          </div>
        </button>
      </div>

      {/* Floating AQI Card */}
      <AnimatePresence>
        {showAqiCard && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="absolute bottom-8 left-4 right-4 md:left-auto md:right-4 z-10 md:w-96"
          >
            <div className="glass-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden ring-1 ring-white/10">
               {/* Health Level Glow */}
               <div className={`absolute -top-12 -right-12 w-48 h-48 blur-[80px] opacity-30 transition-all duration-700 ${bg}`} />
               
               <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-4xl font-extrabold tracking-tighter text-white flex items-baseline gap-2">
                       {aqiData.aqi}
                       <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">AQI</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                       <span className="text-sm font-bold uppercase tracking-tight" style={{ color: color }}>
                          {label}
                       </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAqiCard(false)} 
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
               </div>

               <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-white/80 leading-relaxed font-medium">
                    {aqiData.healthMsg}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">PM2.5</p>
                      <p className="text-lg font-bold text-white">{aqiData.pm25} <span className="text-[10px] font-normal text-muted-foreground">µg/m³</span></p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Status</p>
                      <p className="text-sm font-bold text-white">Live Data</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 opacity-70">
                           <Wind className="w-3.5 h-3.5 text-blue-400" />
                           <span className="text-[10px] font-bold text-white uppercase">8.2 km/h</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-70">
                           <Droplets className="w-3.5 h-3.5 text-blue-400" />
                           <span className="text-[10px] font-bold text-white uppercase">64%</span>
                        </div>
                     </div>
                     <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Refreshed {aqiData.lastUpdate}</span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {!showAqiCard && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-8 right-8 w-14 h-14 glass-morphism rounded-full flex items-center justify-center border border-white/10 shadow-2xl z-10"
            onClick={() => setShowAqiCard(true)}
          >
            <Info className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
