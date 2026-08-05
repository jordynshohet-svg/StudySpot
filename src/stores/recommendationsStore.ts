import { create } from 'zustand';
import { Recommendation, StudyPreferences, SpotVibe, NoiseLevel } from '../types';
import { MOCK_SPOTS } from '../data/mockSpots';

interface RecommendationsState {
  // State
  recommendations: Recommendation[];
  preferences: StudyPreferences;
  isLoading: boolean;
  
  // Actions
  loadRecommendations: () => Promise<void>;
  updatePreferences: (prefs: Partial<StudyPreferences>) => void;
  refreshRecommendations: () => Promise<void>;
}

function computeMatchScore(spot: typeof MOCK_SPOTS[0], prefs: StudyPreferences): number {
  let score = 50; // Base score
  
  // Vibe matching
  const vibeMatches = spot.vibes.filter(v => prefs.preferredVibes.includes(v)).length;
  score += vibeMatches * 15;
  
  // Noise level matching
  if (spot.noiseLevel === prefs.preferredNoiseLevel) {
    score += 20;
  }
  
  // Amenity matching
  if (prefs.needsOutlets && spot.hasOutlets) score += 10;
  if (prefs.needsWifi && spot.hasWifi) score += 10;
  
  // Capacity matching
  if (prefs.preferredCapacity === 'solo' && spot.seatingCapacity <= 4) score += 10;
  if (prefs.preferredCapacity === 'small_group' && spot.seatingCapacity >= 4 && spot.seatingCapacity <= 10) score += 10;
  if (prefs.preferredCapacity === 'large_group' && spot.seatingCapacity > 10) score += 10;
  
  return Math.min(score, 100);
}

export const useRecommendationsStore = create<RecommendationsState>((set, get) => ({
  recommendations: [],
  preferences: {
    preferredVibes: ['quiet', 'cozy'],
    preferredNoiseLevel: 'quiet',
    needsOutlets: true,
    needsWifi: true,
    preferredCapacity: 'solo',
  },
  isLoading: false,

  loadRecommendations: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const { preferences } = get();
    const recs: Recommendation[] = MOCK_SPOTS
      .map(spot => ({
        spot,
        matchScore: computeMatchScore(spot, preferences),
        reason: generateReason(spot, preferences),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8);
    
    set({ recommendations: recs, isLoading: false });
  },

  updatePreferences: (prefs: Partial<StudyPreferences>) => {
    set(state => ({
      preferences: { ...state.preferences, ...prefs },
    }));
  },

  refreshRecommendations: async () => {
    await get().loadRecommendations();
  },
}));

function generateReason(spot: typeof MOCK_SPOTS[0], prefs: StudyPreferences): string {
  const reasons: string[] = [];
  
  const vibeMatches = spot.vibes.filter(v => prefs.preferredVibes.includes(v));
  if (vibeMatches.length > 0) {
    reasons.push(`Matches your ${vibeMatches[0]} vibe`);
  }
  
  if (spot.noiseLevel === prefs.preferredNoiseLevel) {
    reasons.push(`${spot.noiseLevel} noise level you prefer`);
  }
  
  if (prefs.needsOutlets && spot.hasOutlets) {
    reasons.push('Has outlets available');
  }
  
  if (spot.averageRating >= 4.5) {
    reasons.push('Highly rated by students');
  }
  
  return reasons.length > 0 ? reasons[0] : 'Popular with students like you';
}
