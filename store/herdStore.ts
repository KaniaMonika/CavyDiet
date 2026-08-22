import { create } from 'zustand';

interface HerdState {
  currentHerdId: number | null;
  currentHerdNumber: number | null;

  herdSize: number;
  createdPiggiesCount: number;

  setHerd: (
    herdId: number,
    herdSize: number,
    herdNumber?: number
  ) => void;

  incrementCreatedPiggiesCount: () => void;
  resetHerd: () => void;
}

export const useHerdStore = create<HerdState>((set) => ({
  currentHerdId: null,
  currentHerdNumber: null,
  herdSize: 0,
  createdPiggiesCount: 0,

  setHerd: (herdId, herdSize, herdNumber = 1) =>
    set({
      currentHerdId: herdId,
      currentHerdNumber: herdNumber,
      herdSize,
      createdPiggiesCount: 0,
    }),

  incrementCreatedPiggiesCount: () =>
    set((state) => ({
      createdPiggiesCount: state.createdPiggiesCount + 1,
    })),

  resetHerd: () =>
    set({
      currentHerdId: null,
      currentHerdNumber: null,
      herdSize: 0,
      createdPiggiesCount: 0,
    }),
}));