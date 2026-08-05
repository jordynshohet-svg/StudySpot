/**
 * StudySpot Design System
 * Beli-inspired minimal aesthetic — clean typography, generous whitespace,
 * muted earth tones, and purposeful use of accent color.
 */

export const colors = {
  // Primary palette
  primary: '#1A1A2E',        // Deep navy — headers, key actions
  accent: '#E94560',         // Warm coral — CTAs, ratings, highlights
  accentLight: '#FFF0F3',    // Soft blush — accent backgrounds
  
  // Neutrals
  background: '#FFFFFF',
  surface: '#F8F9FA',        // Card backgrounds, sections
  surfaceElevated: '#FFFFFF',
  border: '#EAEAEA',
  borderLight: '#F2F2F2',
  
  // Text hierarchy
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Spot vibes (tags)
  vibeQuiet: '#E0F2FE',
  vibeCollaborative: '#FEF3C7',
  vibeCaffeinated: '#FDE8E8',
  vibeOutdoor: '#D1FAE5',
  vibeCozy: '#F3E8FF',
} as const;

export const typography = {
  // Font families (system fonts for now, can swap to custom)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  // Type scale
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
  },
  
  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  // Font weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;
