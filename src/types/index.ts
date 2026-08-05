// ─── Core Domain Types ───────────────────────────────────────────────────────

export type SpotVibe = 
  | 'quiet'
  | 'collaborative'
  | 'caffeinated'
  | 'outdoor'
  | 'cozy'
  | 'lively'
  | 'aesthetic';

export type NoiseLevel = 'silent' | 'quiet' | 'moderate' | 'lively';

export type SpotAmenity =
  | 'wifi'
  | 'outlets'
  | 'food'
  | 'coffee'
  | 'printing'
  | 'whiteboards'
  | 'natural_light'
  | 'ac'
  | 'restrooms'
  | 'reservable';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface StudySpot {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  images: string[];
  location: Location;
  address: string;
  building: string;
  floor?: string;
  campus: string;
  universityId: string;
  
  // Attributes
  vibes: SpotVibe[];
  noiseLevel: NoiseLevel;
  amenities: SpotAmenity[];
  seatingCapacity: number;
  hasOutlets: boolean;
  hasWifi: boolean;
  
  // Availability
  hours: SpotHours;
  isBusy: boolean;
  busyLevel: number; // 0-100
  
  // Ratings
  averageRating: number;
  totalReviews: number;
  
  // Meta
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpotHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;  // HH:mm format
  close: string;
  isClosed: boolean;
}

export interface Review {
  id: string;
  spotId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;      // 1-5
  vibes: SpotVibe[];
  noiseLevel: NoiseLevel;
  comment: string;
  images: string[];
  visitedAt: string;
  createdAt: string;
  helpful: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  university: string;
  universityId: string;
  major?: string;
  year?: string;
  joinedAt: string;
  reviewCount: number;
  spotsAdded: number;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  domain: string;       // e.g., 'stanford.edu'
  location: Location;
  campusBounds: {
    northeast: Location;
    southwest: Location;
  };
}

// ─── Recommendation Types ────────────────────────────────────────────────────

export interface Recommendation {
  spot: StudySpot;
  reason: string;
  matchScore: number;   // 0-100
}

export interface StudyPreferences {
  preferredVibes: SpotVibe[];
  preferredNoiseLevel: NoiseLevel;
  needsOutlets: boolean;
  needsWifi: boolean;
  preferredCapacity: 'solo' | 'small_group' | 'large_group';
}

// ─── Navigation Types ────────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  SpotDetail: { spotId: string };
  WriteReview: { spotId: string };
  AllReviews: { spotId: string };
};

export type MainTabParamList = {
  Map: undefined;
  Explore: undefined;
  Recommendations: undefined;
  Saved: undefined;
  Profile: undefined;
};
