'use client';

import { useState } from 'react';
import { Calendar, MapPin, Sparkles, CheckCircle2, AlertTriangle, XCircle, Info, ChevronRight, Wind, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventPage() {
  const [date, setDate] = useState('2026-03-22');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        pm25: '12 - 18',
        confidence: '88%',
        status: 'GO',
        reason: 'Prevailing wind patterns and low local emissions suggest optimal air quality for outdoor gatherings.',
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-8 max-w-5xl mx-auto pb-40"
    >
       <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-white">Event Intelligence</h1>
            <p className="text-muted-foreground font-medium text-sm mt-1">Predictive environmental risk modeling for future operations</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
             <Info className="w-4 h-4 text-blue-400" />
             <span className="text-[10px] font-black uppercase text-white tracking-widest">Model Alpha Pre-Beta</span>
          </div>
       </header>

       <div className="space-y-8">
          {/* Input Panel */}
          <div className="glass-card p-10 space-y-8 border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent relative overflow-hidden group">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] px-1">Planned Event Date</label>
                   <div className="relative group/input">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within/input:scale-110 transition-transform" />
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-3xl py-5 pl-14 pr-6 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all text-lg shadow-inner"
                      />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] px-1">Precise Location</label>
                   <div className="relative group/input">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400 group-focus-within/input:scale-110 transition-transform" />
                      <input 
                        placeholder="e.g. Prospect Park, Brooklyn"
                        className="w-full bg-black/40 border border-white/10 rounded-3xl py-5 pl-14 pr-6 text-white font-bold outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40 transition-all text-lg shadow-inner"
                      />
                   </div>
                </div>
             </div>

             <button 
               onClick={runAnalysis}
               disabled={analyzing}
               className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] text-sm hover:scale-[1.01] active:scale-95 transition-all shadow-[0_30px_60px_-15px_rgba(255,255,255,0.2)] disabled:opacity-50 flex items-center justify-center gap-4 group/btn"
             >
                {analyzing ? (
                   <div className="w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                   <>
                      <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                      Execute Multi-Model Prediction
                   </>
                )}
             </button>
          </div>

          {/* Results Panel */}
          <AnimatePresence mode="wait">
             {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                   <div className={`glass-card p-10 border-2 ${result.status === 'GO' ? 'border-emerald-500/30' : 'border-red-500/30'} bg-gradient-to-br from-white/[0.05] to-transparent shadow-2xl relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 p-10 opacity-5">
                         {result.status === 'GO' ? <CheckCircle2 className="w-48 h-48" /> : <AlertTriangle className="w-48 h-48" />}
                      </div>

                      <div className="flex flex-col lg:flex-row items-start justify-between gap-10 relative z-10">
                         <div className="space-y-6 flex-1">
                            <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full ${result.status === 'GO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} border shadow-xl`}>
                               {result.status === 'GO' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                               <span className="text-[10px] font-black uppercase tracking-[0.2em]">{result.status} RECOMMENDATION</span>
                            </div>
                            <div className="space-y-3">
                               <h2 className="text-5xl font-black text-white italic tracking-tighter leading-tight">Environmental conditions are <span className="text-emerald-400">OPTIMAL</span>.</h2>
                               <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                                  {result.reason}
                               </p>
                            </div>
                         </div>
                         <div className="lg:text-right flex lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 border-t lg:border-t-0 border-white/10 pt-8 lg:pt-0">
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">AI Confidence</p>
                                <p className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">{result.confidence}</p>
                             </div>
                             <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                             </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/5">
                         <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-colors cursor-help">
                            <div className="flex items-center gap-2 mb-3">
                               <BarChart className="w-3.5 h-3.5 text-blue-400" />
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">PM2.5 RANGE</p>
                            </div>
                            <p className="text-2xl font-black text-white tracking-tight">{result.pm25} <span className="text-xs text-muted-foreground uppercase">µg</span></p>
                         </div>
                         <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-colors cursor-help">
                            <div className="flex items-center gap-2 mb-3">
                               <Wind className="w-3.5 h-3.5 text-blue-400" />
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">WIND VECTOR</p>
                            </div>
                            <p className="text-2xl font-black text-white tracking-tight">NW <span className="text-xs text-muted-foreground uppercase">12km/h</span></p>
                         </div>
                         <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-colors cursor-help">
                            <div className="flex items-center gap-2 mb-3">
                               <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">ATMO STABILITY</p>
                            </div>
                            <p className="text-2xl font-black text-white tracking-tight italic">STABLE</p>
                         </div>
                         <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-colors cursor-help">
                            <div className="flex items-center gap-2 mb-3">
                               <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">NO2 INDEX</p>
                            </div>
                            <p className="text-2xl font-black text-white tracking-tight">0.12 <span className="text-xs text-muted-foreground uppercase">Low</span></p>
                         </div>
                      </div>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </motion.div>
  );
}

function ShieldCheck({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
