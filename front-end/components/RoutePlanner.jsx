'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Wind, Clock, ShieldCheck, AlertTriangle, Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function RoutePlanner({ onRouteSelected, forecastHours = 0 }) {
  const [start, setStart] = useState('Mumbai Central');
  const [destination, setDestination] = useState('Powai Lake');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('cleanest');

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // Mock coordinates for demonstration based on the strings
      // In a real app, these would come from a geocoding API
      const body = {
        start_lat: 18.9696,
        start_lon: 72.8193,
        end_lat: 19.1290,
        end_lon: 72.9030,
        forecast_hours: forecastHours
      };

      const res = await fetch('http://localhost:8000/clean-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setResults(data);
      onRouteSelected(data, 'cleanest');
    } catch (err) {
      console.error('Route calculation failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectRoute = (type) => {
    setActiveTab(type);
    onRouteSelected(results, type);
  };

  return (
    <div className="absolute top-4 right-4 z-40 w-96 flex flex-col gap-4">
      {/* Search Input Box */}
      <div className="glass-morphism rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-blue-400" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">Clean Air Navigator</h3>
        </div>

        <div className="space-y-3">
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                <input 
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-10 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                    placeholder="Enter starting point..."
                />
            </div>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border border-red-400 rounded-sm" />
                <input 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-10 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 transition-all font-medium"
                    placeholder="Where to?"
                />
            </div>
        </div>

        <button 
            onClick={handleSearch}
            disabled={isSearching}
            className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
                isSearching ? 'bg-white/10 text-white/30' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-[0.98]'
            }`}
        >
            {isSearching ? 'Calculating Pathways...' : (
                <>
                    <Search className="w-3.5 h-3.5" />
                    Compute Optimal Routes
                </>
            )}
        </button>
      </div>

      {/* Results Box */}
      <AnimatePresence>
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-1 flex gap-1 bg-white/5 border-b border-white/5">
                {['cleanest', 'balanced', 'fastest'].map((type) => (
                    <button
                        key={type}
                        onClick={() => selectRoute(type)}
                        className={`flex-1 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            activeTab === type ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Exposure Score</p>
                        <div className="flex items-end gap-1.5">
                            <span className="text-3xl font-bold text-white leading-none">
                                {results.exposure_values[activeTab]}
                            </span>
                            <span className="text-[8px] text-muted-foreground uppercase font-black mb-1">µg·min/m³</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Travel Time</p>
                        <div className="flex items-center justify-end gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-lg font-bold text-white">
                                {Math.round(results[`${activeTab}_route`].properties.duration / 60)}m
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-white mb-1">Health Optimization</p>
                        <p className="text-[10px] text-white/50 leading-relaxed">
                            This route reduces PM2.5 inhalation by {Math.round((1 - results.exposure_values[activeTab] / results.exposure_values.fastest) * 100)}% compared to the fastest transit.
                        </p>
                    </div>
                </div>

                {/* Hotspot Warnings */}
                {results.hotspots?.length > 0 && (
                    <div className="space-y-2">
                         <div className="flex items-center gap-1.5 mb-2">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-amber-400/70">Pollution Hotspots Detected</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {results.hotspots.slice(0, 3).map((h, i) => (
                                <div key={i} className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[9px] font-bold text-red-400">
                                    {h.pm25} µg/m³
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .glass-morphism {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
        }
      `}</style>
    </div>
  );
}
