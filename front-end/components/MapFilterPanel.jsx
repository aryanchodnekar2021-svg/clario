'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Sliders, Calendar, ChevronRight, ChevronLeft, Map as MapIcon, Wind, Thermometer, Droplets, Info } from 'lucide-react';

const LAYERS = [
  { id: 'pm25', label: 'PM2.5', icon: Wind },
  { id: 'aqi', label: 'AQI', icon: Info },
  { id: 'aod', label: 'AOD', icon: Droplets },
  { id: 'no2', label: 'NO2', icon: Thermometer },
  { id: 'wind', label: 'Wind', icon: Wind },
  { id: 'temp', label: 'Temperature', icon: Thermometer },
];

const CATEGORIES = [
  { id: 'good', label: 'Good', range: [0, 50], color: '#00e400' },
  { id: 'moderate', label: 'Moderate', range: [51, 100], color: '#ffff00' },
  { id: 'sensitive', label: 'Sensitive', range: [101, 150], color: '#ff7e00' },
  { id: 'unhealthy', label: 'Unhealthy', range: [151, 200], color: '#ff0000' },
  { id: 'very_unhealthy', label: 'Very Unhealthy', range: [201, 300], color: '#8f3f97' },
  { id: 'hazardous', label: 'Hazardous', range: [301, 500], color: '#7e0023' },
];

const TIME_STEPS = [
  { label: 'Now', offset: 0 },
  { label: '+6h', offset: 6 },
  { label: '+24h', offset: 24 },
  { label: '+48h', offset: 48 },
  { label: '+72h', offset: 72 },
];

export default function MapFilterPanel({ 
  activeLayer, 
  setActiveLayer, 
  opacity, 
  setOpacity, 
  timeOffset, 
  setTimeOffset,
  range,
  setRange,
  selectedCategories,
  setSelectedCategories
}) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(c => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-30 flex items-start gap-4">
      <motion.div
        initial={false}
        animate={{ width: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="glass-morphism rounded-2xl w-72 max-h-[calc(100vh-2rem)] overflow-y-auto border border-white/10 shadow-2xl p-6 space-y-8 no-scrollbar">
          {/* Section: Layer Switcher */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-blue-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">Active Layer</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LAYERS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLayer(l.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    activeLayer === l.id 
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                      : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <l.icon className="w-5 h-5 mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Opacity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">Opacity</h3>
              </div>
              <span className="text-[10px] font-bold text-white/90">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Section: Range Filter */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">AQI Range</h3>
              </div>
              <span className="text-[10px] font-bold text-white/90">{range[0]} - {range[1]}</span>
            </div>
            <div className="relative h-1.5 bg-white/10 rounded-lg group">
                <input
                    type="range"
                    min="0"
                    max="300"
                    value={range[0]}
                    onChange={(e) => setRange([Math.min(parseInt(e.target.value), range[1]), range[1]])}
                    className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none z-10 accent-blue-500"
                />
                <input
                    type="range"
                    min="0"
                    max="300"
                    value={range[1]}
                    onChange={(e) => setRange([range[0], Math.max(parseInt(e.target.value), range[0])])}
                    className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none z-20 accent-blue-500"
                />
            </div>
            <div className="flex justify-between mt-2 text-[8px] font-bold text-white/30 uppercase tracking-widest">
                <span>0</span>
                <span>300+</span>
            </div>
          </div>

          {/* Section: AQI Categories */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-blue-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">Categories</h3>
            </div>
            <div className="space-y-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleCategory(c.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
                    selectedCategories.includes(c.id)
                      ? 'bg-white/10 border-white/20'
                      : 'bg-transparent border-transparent opacity-40 hover:opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{c.label}</span>
                  </div>
                  <span className="text-[8px] font-bold text-white/30">{c.range[0]}-{c.range[1]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-blue-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">Forecast Timeline</h3>
            </div>
            <div className="flex items-center justify-between bg-white/5 p-1 rounded-xl border border-white/5">
              {TIME_STEPS.map((t) => (
                <button
                  key={t.offset}
                  onClick={() => setTimeOffset(t.offset)}
                  className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    timeOffset === t.offset
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center justify-center border border-white/10 text-white transition-all shadow-xl active:scale-95"
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      <style jsx>{`
        .glass-morphism {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        input[type='range']::-webkit-slider-thumb {
            pointer-events: auto;
        }
      `}</style>
    </div>
  );
}

const Zap = ({ className, style }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
        style={style}
    >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);
