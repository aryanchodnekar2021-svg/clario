'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, BarChart3, Navigation, Calendar, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/map', icon: Map, label: 'Map' },
  { href: '/forecast', icon: BarChart3, label: 'Forecast' },
  { href: '/exposure', icon: Activity, label: 'Exposure' },
  { href: '/route', icon: Navigation, label: 'Route' },
  { href: '/event', icon: Calendar, label: 'Event' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 glass-morphism border-t bg-black/40 pb-safe">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-300",
              pathname === item.href ? "text-white scale-110" : "text-muted-foreground hover:text-white/80"
            )}
          >
            <item.icon className={cn("w-6 h-6", pathname === item.href && "stroke-[2.5px] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]")} />
            <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
