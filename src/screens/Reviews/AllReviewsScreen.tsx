import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { useReviewsStore } from '../../stores/reviewsStore';
import { useSpotsStore } from '../../stores/spotsStore';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { RatingStars } from '../../components/RatingStars';
import { VibeTag } from '../../components/VibeTag';

type DetailRoute = RouteProp<RootStackParamList, 'AllReviews'>;

export function AllReviewsScreen() {
  const navigation = useNavigation();
  const route = useRoute<DetailRoute>();
  const { spotId } = route.params;

  const { loadReviews, getSpotReviews, markHelpful } = useReviewsStore();
  const spot = useSpotsStore(state => state.spots.find(s => s.id === spotId));
  const reviews = getSpotReviews(spotId);

  useEffect(() => {
    loadReviews(spotId);
  }, [spotId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Reviews</Text>
          <Text style={styles.headerSubtitle}>{spot?.name}</Text>
        </View>
        <View style={{ width: 22 }} />
      </View>

      {/* Rating Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryLeft}>
          <Text style={styles.bigRating}>{spot?.averageRating.toFixed(1)}</Text>
          <RatingStars rating={spot?.averageRating || 0} size={16} />
          <Text style={styles.totalReviews}>{spot?.totalReviews} reviews</Text>
        </View>
      </View>

      {/* Reviews List */}
      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewerInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.userName.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.reviewerName}>{item.userName}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
              <RatingStars rating={item.rating} size={14} />
            </View>

            {item.vibes.length > 0 && (
              <View style={styles.reviewVibes}>
                {item.vibes.map(vibe => (
                  <VibeTag key={vibe} vibe={vibe} size="sm" />
                ))}
              </View>
            )}

            <Text style={styles.reviewComment}>{item.comment}</Text>

            <TouchableOpacity
              style={styles.helpfulBtn}
              onPress={() => markHelpful(item.id, spotId)}
            >
              <Ionicons name="thumbs-up-outline" size={14} color={colors.textTertiary} />
              <Text style={styles.helpfulText}>
                Helpful{item.helpful > 0 ? ` (${item.helpful})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubble-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No reviews yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summary: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  summaryLeft: {
    alignItems: 'center',
    gap: 6,
  },
  bigRating: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  totalReviews: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  list: {
    padding: spacing.xl,
  },
  reviewCard: {
    paddingBottom: spacing.lg,
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.accent,
  },
  reviewerName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  reviewDate: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  reviewVibes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  reviewComment: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
    marginBottom: spacing.md,
  },
  helpfulBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpfulText: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
    gap: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.textTertiary,
  },
});
