import { create } from "zustand";

export const useMarkers = create((set) => ({
  locations: [],
  addLocation: (data) =>
    set((state) => ({ locations: [...state.locations, data] })),
  resetLocation: () => set({ locations: [] }),
  setLocation: (data) => set({ locations: data }),
}));
