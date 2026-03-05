import { create } from "zustand";

export const useEstimateInfo = create((set) => ({
  estinateData: {},
  resetEstimateData: () => set({ estinateData: {} }),
  setEstimateData: (data) => set({ estinateData: data }),
}));
