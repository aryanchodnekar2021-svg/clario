import { create } from 'zustand';

export const useStore = create((set) => ({
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
