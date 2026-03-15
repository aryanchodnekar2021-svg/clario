'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wind } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Artificial delay for splash feel
    const timer = setTimeout(() => {
      router.replace('/map');
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black space-y-6">
       <div className="relative">
          <Wind className="w-16 h-16 text-blue-400 animate-pulse" />
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
       </div>
       <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-black tracking-[0.4em] text-white uppercase italic">Clario</h1>
          <p className="text-[10px] font-black tracking-[0.5em] text-blue-400/60 uppercase">Environmental Intelligence</p>
       </div>
       <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-blue-500 rounded-full animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '40%' }} />
       </div>
       <style jsx>{`
         @keyframes progress {
           0% { left: -40%; }
           100% { left: 140%; }
         }
       `}</style>
    </div>
  );
}
