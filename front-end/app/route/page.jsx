'use client';

import { useState } from 'react';
import { MapPin, Navigation, ArrowRight, Zap, ShieldCheck, Clock, Info, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const routes = [
  { id: 'cleanest', label: 'Cleanest', time: '18 min', pm25: 12, color: 'emerald', icon: ShieldCheck, description: 'Prioritizes Parks & Low-Traffic' },
  { id: 'balanced', label: 'Balanced', time: '14 min', pm25: 28, color: 'blue', icon: Clock, description: 'Efficient & Safe Air quality' },
  { id: 'fastest', label: 'Fastest', time: '11 min', pm25: 64, color: 'red', icon: Zap, description: 'Direct Main Roads' },
];

export default function RoutePage() {
  const [selected, setSelected] = useState('cleanest');

  return (
    <div className="flex flex-col h-full bg-black">
       {/* Map View Context */}
       <div className="flex-1 relative bg-slate-900 overflow-hidden">
          {/* Static Map Mock */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620864223963-89bd21d60768?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30 Mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
          
          {/* Map UI Elements */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {/* Simple Route SVG Mock */}
             <svg width="80%" height="80%" viewBox="0 0 400 600" className="opacity-60 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <path d="M100,500 C150,400 300,450 350,200" stroke="#10b981" strokeWidth="8" fill="none" strokeLinecap="round" />
                <path d="M100,500 L120,300 L350,200" stroke="#3b82f6" strokeWidth="4" fill="none" strokeDasharray="10,10" />
                <circle cx="100" cy="500" r="10" fill="#3b82f6" />
                <circle cx="350" cy="200" r="10" fill="#ef4444" />
             </svg>
          </div>

          <div className="absolute top-6 left-4 right-4 z-10 space-y-3">
             <motion.div 
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="glass-morphism rounded-3xl p-5 border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
             >
                <div className="space-y-4">
                   <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                         <MapPin className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Starting Point</p>
                         <input 
                           defaultValue="Central Park South" 
                           className="bg-transparent border-none outline-none w-full text-base font-bold text-white placeholder:text-muted-foreground/40"
                         />
                      </div>
                   </div>
                   
                   <div className="ml-5 h-8 w-px bg-gradient-to-b from-blue-500/40 to-red-500/40" />
                   
                   <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 transition-all">
                         <Navigation className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Destination</p>
                         <input 
                           placeholder="Enter final stop..." 
                           defaultValue="Borough Hall, Brooklyn"
                           className="bg-transparent border-none outline-none w-full text-base font-bold text-white placeholder:text-muted-foreground/40"
                         />
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
       </div>

       {/* Control Panel */}
       <motion.div 
         initial={{ y: 100 }}
         animate={{ y: 0 }}
         className="glass-morphism border-t border-white/10 rounded-t-[3.5rem] px-8 pt-10 pb-36 space-y-8 bg-black/60 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.4)]"
       >
          <div className="grid grid-cols-3 gap-3">
             {routes.map((route) => {
                const isActive = selected === route.id;
                const colors = {
                   emerald: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10',
                   blue: 'text-blue-400 border-blue-500/50 bg-blue-500/10',
                   red: 'text-red-400 border-red-500/50 bg-red-500/10',
                };
                return (
                  <button
                    key={route.id}
                    onClick={() => setSelected(route.id)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all duration-500 ${isActive ? colors[route.color] : 'border-white/5 bg-white/5 text-muted-foreground'}`}
                  >
                     <route.icon className={`w-6 h-6 ${isActive ? '' : 'opacity-40'}`} />
                     <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-wider">{route.label}</p>
                        <p className="text-[10px] font-bold opacity-60 italic">{route.time}</p>
                     </div>
                  </button>
                )
             })}
          </div>

          <AnimatePresence mode="wait">
             <motion.div 
               key={selected}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.03] border border-white/5"
             >
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Environmental Impact</p>
                   <h4 className="text-lg font-bold text-white">{routes.find(r => r.id === selected)?.description}</h4>
                </div>
                <div className="text-right">
                   <div className="flex items-baseline justify-end gap-1">
                      <span className={`text-4xl font-black ${selected === 'cleanest' ? 'text-emerald-400' : selected === 'fastest' ? 'text-red-400' : 'text-blue-400'}`}>
                        {routes.find(r => r.id === selected)?.pm25}
                      </span>
                      <span className="text-[10px] font-black text-muted-foreground uppercase italic px-1">µg</span>
                   </div>
                   <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Est. Exposure</p>
                </div>
             </motion.div>
          </AnimatePresence>

          <button className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_-5px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3">
             Start Live Navigation
             <ArrowRight className="w-5 h-5" />
          </button>
       </motion.div>
    </div>
  );
}
