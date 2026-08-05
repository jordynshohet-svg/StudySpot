import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useSpotsStore } from '../../stores/spotsStore';
import { useReviewsStore } from '../../stores/reviewsStore';
import { useSavedStore } from '../../stores/savedStore';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { RatingStars } from '../../components/RatingStars';
import { VibeTag } from '../../components/VibeTag';
import { BusyIndicator } from '../../components/BusyIndicator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetailRoute = RouteProp<RootStackParamList, 'SpotDetail'>;

const { width } = Dimensions.get('window');

const AMENITY_ICONS: Record<string, { icon: string; label: string }> = {
  wifi: { icon: 'wifi', label: 'WiFi' },
  outlets: { icon: 'flash', label: 'Outlets' },
  food: { icon: 'restaurant', label: 'Food' },
  coffee: { icon: 'cafe', label: 'Coffee' },
  printing: { icon: 'print', label: 'Printing' },
  whiteboards: { icon: 'easel', label: 'Whiteboards' },
  natural_light: { icon: 'sunny', label: 'Natural Light' },
  ac: { icon: 'snow', label: 'A/C' },
  restrooms: { icon: 'water', label: 'Restrooms' },
  reservable: { icon: 'calendar', label: 'Reservable' },
};

export function SpotDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRoute>();
  const { spotId } = route.params;

  const { spots, selectSpot, selectedSpot } = useSpotsStore();
  const { loadReviews, getSpotReviews } = useReviewsStore();
  const { toggleSaved, isSaved } = useSavedStore();
  const saved = isSaved(spotId);

  useEffect(() => {
    selectSpot(spotId);
    loadReviews(spotId);
  }, [spotId]);

  const reviews = getSpotReviews(spotId);
  const spot = selectedSpot;

  if (!spot) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: spot.imageUrl }} style={styles.heroImage} />
          <SafeAreaView style={styles.heroOverlay} edges={['top']}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => toggleSaved(spotId)}>
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={saved ? colors.accent : colors.textPrimary}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.spotName}>{spot.name}</Text>
            <Text style={styles.building}>
              {spot.building}{spot.floor ? ` · ${spot.floor}` : ''}
            </Text>
            
            <View style={styles.ratingRow}>
              <RatingStars rating={spot.averageRating} size={16} />
              <Text style={styles.ratingValue}>{spot.averageRating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({spot.totalReviews} reviews)</Text>
            </View>
          </View>

          {/* Vibes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vibes</Text>
            <View style={styles.vibesContainer}>
              {spot.vibes.map(vibe => (
                <VibeTag key={vibe} vibe={vibe} />
              ))}
            </View>
          </View>

          {/* Busy Level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Capacity</Text>
            <BusyIndicator level={spot.busyLevel} />
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{spot.description}</Text>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {spot.amenities.map(amenity => {
                const config = AMENITY_ICONS[amenity];
                if (!config) return null;
                return (
                  <View key={amenity} style={styles.amenityItem}>
                    <View style={styles.amenityIcon}>
                      <Ionicons name={config.icon as any} size={18} color={colors.primary} />
                    </View>
                    <Text style={styles.amenityLabel}>{config.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Reviews Preview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllReviews', { spotId })}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            
            {reviews.length > 0 ? (
              reviews.slice(0, 2).map(review => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.userName}</Text>
                    <RatingStars rating={review.rating} size={12} />
                  </View>
                  <Text style={styles.reviewComment} numberOfLines={3}>
                    {review.comment}
                  </Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => navigation.navigate('WriteReview', { spotId })}
        >
          <Ionicons name="create-outline" size={20} color={colors.textInverse} />
          <Text style={styles.reviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: width,
    height: 280,
    backgroundColor: colors.surface,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  saveBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  spotName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  building: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  reviewCount: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: typography.sizes.sm,
    color: colors.accent,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.md,
  },
  vibesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  amenityItem: {
    alignItems: 'center',
    width: 72,
    gap: 6,
  },
  amenityIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewerName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  reviewComment: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
    marginBottom: spacing.sm,
  },
  reviewDate: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
  },
  noReviews: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.base,
    gap: spacing.sm,
  },
  reviewButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textInverse,
  },
});
