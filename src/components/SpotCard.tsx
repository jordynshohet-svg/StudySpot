import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudySpot } from '../types';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { RatingStars } from './RatingStars';
import { VibeTag } from './VibeTag';
import { useSavedStore } from '../stores/savedStore';

interface SpotCardProps {
  spot: StudySpot;
  onPress: () => void;
  variant?: 'horizontal' | 'vertical';
}

export function SpotCard({ spot, onPress, variant = 'vertical' }: SpotCardProps) {
  const { toggleSaved, isSaved } = useSavedStore();
  const saved = isSaved(spot.id);

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.7}>
        <Image source={{ uri: spot.imageUrl }} style={styles.horizontalImage} />
        <View style={styles.horizontalContent}>
          <Text style={styles.name} numberOfLines={1}>{spot.name}</Text>
          <Text style={styles.building} numberOfLines={1}>{spot.building}</Text>
          <View style={styles.ratingRow}>
            <RatingStars rating={spot.averageRating} size={12} />
            <Text style={styles.ratingText}>{spot.averageRating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({spot.totalReviews})</Text>
          </View>
          <View style={styles.vibesRow}>
            {spot.vibes.slice(0, 2).map(vibe => (
              <VibeTag key={vibe} vibe={vibe} size="sm" />
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={styles.bookmarkBtn}
          onPress={() => toggleSaved(spot.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={saved ? colors.accent : colors.textTertiary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: spot.imageUrl }} style={styles.image} />
        <TouchableOpacity
          style={styles.bookmarkOverlay}
          onPress={() => toggleSaved(spot.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={saved ? colors.accent : colors.textInverse}
          />
        </TouchableOpacity>
        {spot.isBusy && (
          <View style={styles.busyBadge}>
            <Text style={styles.busyText}>Busy</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{spot.name}</Text>
        <Text style={styles.building} numberOfLines={1}>{spot.building}</Text>
        <View style={styles.ratingRow}>
          <RatingStars rating={spot.averageRating} size={12} />
          <Text style={styles.ratingText}>{spot.averageRating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({spot.totalReviews})</Text>
        </View>
        <View style={styles.vibesRow}>
          {spot.vibes.slice(0, 3).map(vibe => (
            <VibeTag key={vibe} vibe={vibe} size="sm" />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
    marginBottom: spacing.base,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.surface,
  },
  bookmarkOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.full,
    padding: 6,
  },
  busyBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.warning,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  busyText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textInverse,
  },
  content: {
    padding: spacing.md,
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  building: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.sm,
  },
  ratingText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
  },
  vibesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  // Horizontal variant
  horizontalCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    ...shadows.sm,
    marginBottom: spacing.md,
  },
  horizontalImage: {
    width: 100,
    height: 100,
    backgroundColor: colors.surface,
  },
  horizontalContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  bookmarkBtn: {
    padding: spacing.md,
    justifyContent: 'center',
  },
});
