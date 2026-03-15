'use client';

import { useStore } from '@/store/useStore';
import { formatAqi } from '@/lib/utils';
import { Wind } from 'lucide-react';

export default function Banner() {
  const { userLocation } = useStore();
  // In a real app, this would be fetched via React Query
  const aqiValue = 42; 
  const { label, color } = formatAqi(aqiValue);

  return (
    <div className="sticky top-0 z-50 w-full h-12 glass-morphism border-b flex items-center justify-between px-6 bg-black/40">
      <div className="flex items-center gap-2">
        <Wind className="w-5 h-5 text-blue-400" />
        <span className="font-bold tracking-tight text-white">Clario</span>
      </div>
      <div className="flex items-center gap-4 text-sm font-medium">
        <span className="text-muted-foreground">{userLocation?.city || 'Detecting Location...'}</span>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
          <span className="text-white">AQI {aqiValue}</span>
          <span className="text-[10px] opacity-60 uppercase hidden sm:inline">{label}</span>
        </div>
      </div>
    </div>
  );
}
