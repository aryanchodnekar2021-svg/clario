import { create } from 'zustand';

interface HealthProfile {
  age: number;
  asthma: boolean;
  outdoorActivity: 'low' | 'moderate' | 'high';
}

interface UserLocation {
  lat: number;
  lng: number;
  city: string;
}

interface UserState {
  userLocation: UserLocation | null;
  savedPlaces: Array<{ lat: number; lng: number; name: string }>;
  healthProfile: HealthProfile;
  alertThreshold: number;
  layer: 'pm25' | 'aod';
  setUserLocation: (location: UserLocation | null) => void;
  setHealthProfile: (profile: HealthProfile) => void;
  setAlertThreshold: (threshold: number) => void;
  setLayer: (layer: 'pm25' | 'aod') => void;
  addSavedPlace: (place: { lat: number; lng: number; name: string }) => void;
}

export const useStore = create<UserState>((set) => ({
  userLocation: { lat: 40.7128, lng: -74.0060, city: 'New York' }, // Default for demo
  savedPlaces: [],
  healthProfile: { age: 30, asthma: false, outdoorActivity: 'moderate' },
  alertThreshold: 35,
  layer: 'pm25',
  setUserLocation: (userLocation) => set({ userLocation }),
  setHealthProfile: (healthProfile) => set({ healthProfile }),
  setAlertThreshold: (alertThreshold) => set({ alertThreshold }),
  setLayer: (layer) => set({ layer }),
  addSavedPlace: (place) => set((state) => ({ savedPlaces: [...state.savedPlaces, place] })),
}));
