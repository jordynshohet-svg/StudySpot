import { create } from 'zustand';

interface SavedState {
  // State
  savedSpotIds: string[];
  
  // Actions
  toggleSaved: (spotId: string) => void;
  isSaved: (spotId: string) => boolean;
  clearAll: () => void;
}

export const useSavedStore = create<SavedState>((set, get) => ({
  savedSpotIds: [],

  toggleSaved: (spotId: string) => {
    const { savedSpotIds } = get();
    if (savedSpotIds.includes(spotId)) {
      set({ savedSpotIds: savedSpotIds.filter(id => id !== spotId) });
    } else {
      set({ savedSpotIds: [...savedSpotIds, spotId] });
    }
  },

  isSaved: (spotId: string) => {
    return get().savedSpotIds.includes(spotId);
  },

  clearAll: () => set({ savedSpotIds: [] }),
}));
