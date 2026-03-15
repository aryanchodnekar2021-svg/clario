'use client';

import dynamic from 'next/dynamic';

const PollutionMap = dynamic(() => import('@/components/PollutionMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center text-white/20 font-bold uppercase tracking-widest">Initializing Map Engine...</div>
});

export default function MapPage() {
  return (
    <div className="w-full h-full">
      <PollutionMap />
    </div>
  );
}
