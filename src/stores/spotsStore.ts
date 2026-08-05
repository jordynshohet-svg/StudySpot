import { create } from 'zustand';
import { StudySpot, SpotVibe, NoiseLevel } from '../types';
import { MOCK_SPOTS } from '../data/mockSpots';

interface SpotsState {
  // State
  spots: StudySpot[];
  filteredSpots: StudySpot[];
  selectedSpot: StudySpot | null;
  isLoading: boolean;
  
  // Filters
  searchQuery: string;
  activeVibes: SpotVibe[];
  noiseFilter: NoiseLevel | null;
  showOpenOnly: boolean;
  needsOutlets: boolean;
  needsWifi: boolean;
  
  // Actions
  loadSpots: () => Promise<void>;
  selectSpot: (spotId: string) => void;
  clearSelection: () => void;
  setSearchQuery: (query: string) => void;
  toggleVibe: (vibe: SpotVibe) => void;
  setNoiseFilter: (level: NoiseLevel | null) => void;
  toggleOpenOnly: () => void;
  toggleOutlets: () => void;
  toggleWifi: () => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export const useSpotsStore = create<SpotsState>((set, get) => ({
  spots: [],
  filteredSpots: [],
  selectedSpot: null,
  isLoading: false,
  searchQuery: '',
  activeVibes: [],
  noiseFilter: null,
  showOpenOnly: false,
  needsOutlets: false,
  needsWifi: false,

  loadSpots: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ spots: MOCK_SPOTS, filteredSpots: MOCK_SPOTS, isLoading: false });
  },

  selectSpot: (spotId: string) => {
    const spot = get().spots.find(s => s.id === spotId) || null;
    set({ selectedSpot: spot });
  },

  clearSelection: () => set({ selectedSpot: null }),

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  toggleVibe: (vibe: SpotVibe) => {
    const { activeVibes } = get();
    const updated = activeVibes.includes(vibe)
      ? activeVibes.filter(v => v !== vibe)
      : [...activeVibes, vibe];
    set({ activeVibes: updated });
    get().applyFilters();
  },

  setNoiseFilter: (level: NoiseLevel | null) => {
    set({ noiseFilter: level });
    get().applyFilters();
  },

  toggleOpenOnly: () => {
    set({ showOpenOnly: !get().showOpenOnly });
    get().applyFilters();
  },

  toggleOutlets: () => {
    set({ needsOutlets: !get().needsOutlets });
    get().applyFilters();
  },

  toggleWifi: () => {
    set({ needsWifi: !get().needsWifi });
    get().applyFilters();
  },

  clearFilters: () => {
    set({
      searchQuery: '',
      activeVibes: [],
      noiseFilter: null,
      showOpenOnly: false,
      needsOutlets: false,
      needsWifi: false,
    });
    set({ filteredSpots: get().spots });
  },

  applyFilters: () => {
    const { spots, searchQuery, activeVibes, noiseFilter, showOpenOnly, needsOutlets, needsWifi } = get();
    
    let filtered = [...spots];
    
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        s => s.name.toLowerCase().includes(q) ||
             s.building.toLowerCase().includes(q) ||
             s.description.toLowerCase().includes(q)
      );
    }
    
    // Vibes
    if (activeVibes.length > 0) {
      filtered = filtered.filter(s =>
        activeVibes.some(v => s.vibes.includes(v))
      );
    }
    
    // Noise level
    if (noiseFilter) {
      filtered = filtered.filter(s => s.noiseLevel === noiseFilter);
    }
    
    // Outlets
    if (needsOutlets) {
      filtered = filtered.filter(s => s.hasOutlets);
    }
    
    // WiFi
    if (needsWifi) {
      filtered = filtered.filter(s => s.hasWifi);
    }
    
    set({ filteredSpots: filtered });
  },
}));
