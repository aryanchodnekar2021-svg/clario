import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatAqi(value) {
  if (value <= 50) return { label: 'Good', color: 'var(--aqi-good)', bg: 'bg-[#00e400]' };
  if (value <= 100) return { label: 'Moderate', color: 'var(--aqi-moderate)', bg: 'bg-[#ffff00]' };
  if (value <= 150) return { label: 'Unhealthy for Sensitive', color: 'var(--aqi-sensitive)', bg: 'bg-[#ff7e00]' };
  if (value <= 200) return { label: 'Unhealthy', color: 'var(--aqi-unhealthy)', bg: 'bg-[#ff0000]' };
  if (value <= 300) return { label: 'Very Unhealthy', color: 'var(--aqi-very-unhealthy)', bg: 'bg-[#8f3f97]' };
  return { label: 'Hazardous', color: 'var(--aqi-hazardous)', bg: 'bg-[#7e0023]' };
}
