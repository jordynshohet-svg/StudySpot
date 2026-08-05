import { create } from 'zustand';
import { Review, SpotVibe, NoiseLevel } from '../types';
import { MOCK_REVIEWS } from '../data/mockReviews';

interface ReviewsState {
  // State
  reviews: Record<string, Review[]>; // keyed by spotId
  isLoading: boolean;
  isSubmitting: boolean;
  
  // Actions
  loadReviews: (spotId: string) => Promise<void>;
  submitReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => Promise<void>;
  markHelpful: (reviewId: string, spotId: string) => void;
  getSpotReviews: (spotId: string) => Review[];
  getAverageRating: (spotId: string) => number;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: {},
  isLoading: false,
  isSubmitting: false,

  loadReviews: async (spotId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const spotReviews = MOCK_REVIEWS.filter(r => r.spotId === spotId);
    set(state => ({
      isLoading: false,
      reviews: { ...state.reviews, [spotId]: spotReviews },
    }));
  },

  submitReview: async (reviewData) => {
    set({ isSubmitting: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };
    
    set(state => ({
      isSubmitting: false,
      reviews: {
        ...state.reviews,
        [reviewData.spotId]: [newReview, ...(state.reviews[reviewData.spotId] || [])],
      },
    }));
  },

  markHelpful: (reviewId: string, spotId: string) => {
    set(state => ({
      reviews: {
        ...state.reviews,
        [spotId]: (state.reviews[spotId] || []).map(r =>
          r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
        ),
      },
    }));
  },

  getSpotReviews: (spotId: string) => {
    return get().reviews[spotId] || [];
  },

  getAverageRating: (spotId: string) => {
    const reviews = get().reviews[spotId] || [];
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  },
}));
