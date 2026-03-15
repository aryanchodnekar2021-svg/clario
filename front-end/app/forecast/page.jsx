'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { CloudRain, Sun, Wind, ChevronRight, Info, Zap } from 'lucide-react';
import { formatAqi } from '@/lib/utils';
import { motion } from 'framer-motion';

// Mock data generator for 72 hours
const generateForecast = () => {
  return Array.from({ length: 72 }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() + i);
    const pm25 = 15 + Math.sin(i / 8) * 12 + Math.random() * 4;
    return {
      time: date.toISOString(),
      label: format(date, 'HH:mm'),
      pm25: parseFloat(pm25.toFixed(1)),
      aqi: Math.round(pm25 * 3), 
      confidence_low: pm25 - (2 + i/30),
      confidence_high: pm25 + (2 + i/30),
    };
  });
};

export default function ForecastPage() {
  const { data: forecast = generateForecast() } = useQuery({
    queryKey: ['forecast'],
    queryFn: async () => {
      // Proxy call: const res = await axios.get('/api/forecast');
      return generateForecast();
    },
    staleTime: 60 * 60 * 1000,
  });

  const bestTimeToRun = forecast.slice(0, 24).reduce((prev, curr) => prev.pm25 < curr.pm25 ? prev : curr);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-8 max-w-4xl mx-auto pb-32"
    >
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">AI Forecast</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1">High-fidelity PM2.5 temporal predictions</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
           <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
           <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Model Alpha V2</span>
        </div>
      </header>

      {/* Insight Card */}
      <div className="glass-card flex flex-col md:flex-row items-center justify-between border-blue-500/20 bg-blue-500/5 ring-1 ring-blue-500/20 gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Sun className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-blue-400/80 mb-0.5">Optimal Outdoor Window</p>
            <p className="text-xl font-bold text-white uppercase tracking-tight">Today around {format(new Date(bestTimeToRun.time), 'hh:mm a')}</p>
          </div>
        </div>
        <div className="flex items-center gap-8 w-full md:w-auto justify-around md:justify-end border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
           <div className="text-center md:text-right">
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Min PM2.5</p>
              <p className="text-2xl font-black text-blue-400 font-mono">{bestTimeToRun.pm25}</p>
           </div>
           <div className="text-center md:text-right">
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">CONFIDENCE</p>
              <p className="text-2xl font-black text-white/50 font-mono">94%</p>
           </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">3-Day Pollution Trajectory</h3>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 rounded-full bg-blue-500/20" />
                <span className="text-[9px] font-black text-muted-foreground uppercase">Range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 rounded-full bg-blue-400" />
                <span className="text-[9px] font-black text-muted-foreground uppercase">Median</span>
              </div>
           </div>
        </div>

        <div className="h-72 w-full glass-card p-4 pt-8 overflow-hidden ring-1 ring-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast}>
              <defs>
                <linearGradient id="colorPm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#ffffff08" vertical={false} />
              <XAxis 
                dataKey="label" 
                stroke="#444" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
                interval={11}
                tickFormatter={(val, i) => i === 0 ? 'Now' : val}
              />
              <YAxis 
                stroke="#444" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                cursor={{ stroke: '#ffffff20', strokeWidth: 1 }}
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px', 
                  fontSize: '11px',
                  boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5)'
                }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                labelStyle={{ color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}
              />
              <Area 
                type="monotone" 
                dataKey="confidence_high" 
                stroke="transparent" 
                fill="#3b82f6" 
                fillOpacity={0.05} 
              />
              <Area 
                type="monotone" 
                dataKey="pm25" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorPm)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly List */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Hourly Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
           {forecast.slice(0, 10).map((item, idx) => {
             const { color, label: aqiLabel } = formatAqi(item.aqi);
             return (
               <motion.div 
                 key={idx}
                 whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                 className="glass-card flex items-center justify-between p-4 cursor-pointer group border-white/5"
               >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white/50 uppercase tracking-widest">{idx === 0 ? 'CURRENT' : item.label}</span>
                      <span className="text-[9px] font-bold text-muted-foreground">{format(new Date(item.time), 'MMM dd')}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                       {item.pm25 > 22 ? <CloudRain className="w-5 h-5 text-slate-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                     <div className="text-right">
                        <p className="text-sm font-black text-white">{item.pm25} <span className="text-[9px] text-muted-foreground uppercase">µg</span></p>
                        <p className="text-[10px] font-black uppercase tracking-tighter" style={{ color: color }}>{aqiLabel}</p>
                     </div>
                     <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors" />
                  </div>
               </motion.div>
             )
           })}
        </div>
        
        <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-white transition-colors border border-dashed border-white/10 rounded-2xl">
          Load Full 72-Hour Predictions
        </button>
      </section>
    </motion.div>
  );
}
