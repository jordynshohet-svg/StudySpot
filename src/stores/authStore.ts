import { create } from 'zustand';
import { User, University } from '../types';

interface AuthState {
  // State
  user: User | null;
  university: University | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth flow state
  pendingEmail: string | null;
  verificationSent: boolean;
  
  // Actions
  sendVerification: (email: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  completeProfile: (data: Partial<User>) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

// Mock university data
const UNIVERSITIES: Record<string, University> = {
  'stanford.edu': {
    id: 'stanford',
    name: 'Stanford University',
    shortName: 'Stanford',
    domain: 'stanford.edu',
    location: { latitude: 37.4275, longitude: -122.1697 },
    campusBounds: {
      northeast: { latitude: 37.4400, longitude: -122.1500 },
      southwest: { latitude: 37.4150, longitude: -122.1900 },
    },
  },
  'berkeley.edu': {
    id: 'berkeley',
    name: 'UC Berkeley',
    shortName: 'Berkeley',
    domain: 'berkeley.edu',
    location: { latitude: 37.8719, longitude: -122.2585 },
    campusBounds: {
      northeast: { latitude: 37.8800, longitude: -122.2450 },
      southwest: { latitude: 37.8650, longitude: -122.2700 },
    },
  },
  'ucla.edu': {
    id: 'ucla',
    name: 'UCLA',
    shortName: 'UCLA',
    domain: 'ucla.edu',
    location: { latitude: 34.0689, longitude: -118.4452 },
    campusBounds: {
      northeast: { latitude: 34.0750, longitude: -118.4350 },
      southwest: { latitude: 34.0620, longitude: -118.4550 },
    },
  },
};

function getUniversityFromEmail(email: string): University | null {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain?.endsWith('.edu')) return null;
  return UNIVERSITIES[domain] || {
    id: domain.replace('.edu', ''),
    name: domain.replace('.edu', '').charAt(0).toUpperCase() + domain.replace('.edu', '').slice(1) + ' University',
    shortName: domain.replace('.edu', '').toUpperCase(),
    domain,
    location: { latitude: 37.7749, longitude: -122.4194 },
    campusBounds: {
      northeast: { latitude: 37.7850, longitude: -122.4050 },
      southwest: { latitude: 37.7650, longitude: -122.4350 },
    },
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  university: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  pendingEmail: null,
  verificationSent: false,

  sendVerification: async (email: string) => {
    set({ isLoading: true, error: null });
    
    // Validate .edu email
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain?.endsWith('.edu')) {
      set({ isLoading: false, error: 'Please use a valid .edu email address' });
      return;
    }
    
    // Simulate sending verification code
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const university = getUniversityFromEmail(email);
    set({
      isLoading: false,
      pendingEmail: email,
      verificationSent: true,
      university,
    });
  },

  verifyCode: async (code: string) => {
    set({ isLoading: true, error: null });
    
    // Simulate verification (accept any 6-digit code for demo)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (code.length !== 6) {
      set({ isLoading: false, error: 'Please enter a valid 6-digit code' });
      return;
    }
    
    const { pendingEmail, university } = get();
    
    const user: User = {
      id: `user_${Date.now()}`,
      email: pendingEmail!,
      displayName: pendingEmail!.split('@')[0],
      university: university?.name || 'Unknown University',
      universityId: university?.id || 'unknown',
      joinedAt: new Date().toISOString(),
      reviewCount: 0,
      spotsAdded: 0,
    };
    
    set({
      isLoading: false,
      user,
      isAuthenticated: true,
    });
  },

  completeProfile: async (data: Partial<User>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { user } = get();
    if (user) {
      set({
        isLoading: false,
        user: { ...user, ...data },
      });
    }
  },

  signOut: () => {
    set({
      user: null,
      university: null,
      isAuthenticated: false,
      pendingEmail: null,
      verificationSent: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
