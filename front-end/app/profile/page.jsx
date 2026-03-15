'use client';

import { useStore } from '@/store/useStore';
import { Bell, Activity, User, Heart, AlertCircle, Save, ShieldPlus, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { healthProfile, setHealthProfile, alertThreshold, setAlertThreshold } = useStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8 max-w-2xl mx-auto pb-40"
    >
       <header>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">Health Intelligence</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1">Calibrate AI models to your personal biology</p>
       </header>

       <div className="space-y-6">
          {/* Health Profile Card */}
          <section className="glass-card p-8 space-y-8 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-red-500/10">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
                   </div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Biological Profile</h3>
                </div>
                <BrainCircuit className="w-5 h-5 text-muted-foreground opacity-20" />
             </div>
             
             <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                   <div className="space-y-0.5">
                      <p className="text-sm font-bold text-white">Respiratory Sensitivity</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.1em]">ASTHMA / COPD / CHRONIC SINUS</p>
                   </div>
                   <button 
                     onClick={() => setHealthProfile({ ...healthProfile, asthma: !healthProfile.asthma })}
                     className={`w-14 h-8 rounded-full transition-all duration-500 relative ring-1 ring-white/10 ${healthProfile.asthma ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-white/5'}`}
                   >
                      <div className={`absolute top-1.5 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-500 ease-in-out ${healthProfile.asthma ? 'left-7.5' : 'left-1.5'}`} />
                   </button>
                </div>
                
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Weekly Outdoor Intensity</p>
                   <div className="grid grid-cols-3 gap-3">
                      {['low', 'moderate', 'high'].map((level) => (
                         <button
                           key={level}
                           onClick={() => setHealthProfile({ ...healthProfile, outdoorActivity: level })}
                           className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${healthProfile.outdoorActivity === level ? 'bg-white text-black border-white shadow-xl scale-105' : 'border-white/5 text-muted-foreground bg-white/[0.01] hover:bg-white/[0.05]'}`}
                         >
                            {level}
                         </button>
                      ))}
                   </div>
                </div>
             </div>
          </section>

          {/* Alerts Card */}
          <section className="glass-card p-8 space-y-8 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-yellow-400/10">
                      <Bell className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                   </div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Alert Mechanisms</h3>
                </div>
             </div>
             
             <div className="space-y-8">
                <div>
                   <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-bold text-white">PM2.5 Exposure Limit</p>
                      <div className="flex items-baseline gap-1">
                         <span className="text-3xl font-black text-white italic tracking-tighter">{alertThreshold}</span>
                         <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">µg/m³</span>
                      </div>
                   </div>
                   <input 
                     type="range" 
                     min="5" 
                     max="100" 
                     step="5"
                     value={alertThreshold}
                     onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                     className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-white ring-1 ring-white/10"
                   />
                   <div className="flex justify-between mt-2 px-1">
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Minimal</span>
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Hazardous</span>
                   </div>
                </div>
                
                <div className="p-5 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex gap-5 items-start">
                   <ShieldPlus className="w-6 h-6 text-indigo-400 mt-0.5 shrink-0" />
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-white">Proactive Health Shield</p>
                      <p className="text-[11px] leading-relaxed text-indigo-400/70 font-medium">
                        Our AI monitors real-time sensor stations within 2km of your live location. Notifications trigger only if thresholds are maintained for 10+ minutes.
                      </p>
                   </div>
                </div>
             </div>
          </section>

          <button className="w-full py-6 bg-white text-black rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-2xl">
             <Save className="w-5 h-5" />
             Synchronize Bio-Data
          </button>
       </div>
    </motion.div>
  );
}
