'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, ShieldCheck, AlertTriangle, TrendingDown, Info, Activity, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

const weeklyData = [
  { day: 'Mon', value: 12, label: 'Low' },
  { day: 'Tue', value: 25, label: 'Moderate' },
  { day: 'Wed', value: 45, label: 'Moderate' },
  { day: 'Thu', value: 18, label: 'Low' },
  { day: 'Fri', value: 65, label: 'High' },
  { day: 'Sat', value: 32, label: 'Moderate' },
  { day: 'Sun', value: 10, label: 'Low' },
];

export default function ExposurePage() {
  const averageExposure = 34; // µg/m³

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 space-y-8 max-w-5xl mx-auto pb-32"
    >
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">Exposure Dashboard</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1">Holistic health & pollution biometrics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-2xl glass-morphism border-white/10 hover:bg-white/10 transition-all text-white group shadow-xl">
          <Download className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">Global Report</span>
        </button>
      </header>

      {/* Main Score Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card relative overflow-hidden p-8 flex flex-col justify-center border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent">
           <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Optimized</span>
           </div>
           
           <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Cumulative Exposure Score</p>
              <div className="flex items-baseline gap-4">
                 <h2 className="text-8xl font-black text-white tracking-tighter drop-shadow-2xl">84</h2>
                 <div className="flex flex-col">
                    <span className="text-xl font-bold text-white/40 italic">HEALTHY</span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">SCALE 0-100</span>
                 </div>
              </div>
           </div>

           <div className="mt-8 flex flex-wrap gap-8 items-center border-t border-white/5 pt-8">
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total PM2.5 Inhaled</span>
                 <span className="text-xl font-black text-white tracking-tight">1,242 <span className="text-[10px] text-muted-foreground">µg</span></span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">World Avg Δ</span>
                 <span className="text-xl font-black text-emerald-400 tracking-tight">-14.2%</span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Days</span>
                 <span className="text-xl font-black text-white tracking-tight">6/7</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-8 flex flex-col justify-between border-white/5 relative group">
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Bio-Risk Profile</p>
                 <HeartPulse className="w-5 h-5 text-red-500/50 group-hover:text-red-500 transition-colors" />
              </div>
              <div>
                 <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">Moderate</h3>
                 <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                   Current inhalation rates are stable but slightly elevated due to local construction activity.
                 </p>
              </div>
           </div>
           
           <div className="space-y-4 pt-8">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                 <span className="text-muted-foreground">Threshold</span>
                 <span className="text-white">45%</span>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" 
                />
              </div>
           </div>
        </div>
      </div>

      {/* Bar Chart Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-blue-500 rounded-full" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Weekly Inhalation Trajectory</h3>
           </div>
           <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              <TrendingDown className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">-8.4% improvement</span>
           </div>
        </div>

        <div className="h-80 w-full glass-card p-8 overflow-hidden ring-1 ring-white/5 bg-black/40">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#444" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                   cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                   contentStyle={{ 
                     backgroundColor: 'rgba(0,0,0,0.9)', 
                     border: '1px solid rgba(255,255,255,0.1)', 
                     borderRadius: '16px',
                     padding: '12px'
                   }}
                />
                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={40}>
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value > 50 ? '#ff4b4b' : entry.value > 25 ? '#ffb300' : '#00e400'} 
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
           </ResponsiveContainer>
        </div>
      </section>

      {/* Activity Logs */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-2">Anomalous Activity Detection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="glass-card flex items-center gap-5 p-5 border-red-500/10 bg-red-500/[0.01] hover:bg-red-500/[0.03] transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/10 group-hover:scale-105 transition-transform">
                 <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                 <p className="text-sm font-bold text-white mb-0.5">High Exposure Event</p>
                 <p className="text-[10px] text-muted-foreground font-medium">Friday Aug 14 • Running near Industrial Zone</p>
              </div>
              <div className="text-right">
                 <p className="text-lg font-black text-red-400 leading-none">68</p>
                 <p className="text-[8px] font-black text-muted-foreground uppercase mt-1">PM2.5</p>
              </div>
           </div>
           
           <div className="glass-card flex items-center gap-5 p-5 border-emerald-500/10 bg-emerald-500/[0.01] hover:bg-emerald-500/[0.03] transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10 group-hover:scale-105 transition-transform">
                 <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex-1">
                 <p className="text-sm font-bold text-white mb-0.5">Cleans-Air Routing Bonus</p>
                 <p className="text-[10px] text-muted-foreground font-medium">Thursday Aug 13 • Commute to Finance District</p>
              </div>
              <div className="text-right">
                 <p className="text-lg font-black text-emerald-400 leading-none">-22%</p>
                 <p className="text-[8px] font-black text-muted-foreground uppercase mt-1">IMPACT</p>
              </div>
           </div>
        </div>
      </section>
    </motion.div>
  );
}
