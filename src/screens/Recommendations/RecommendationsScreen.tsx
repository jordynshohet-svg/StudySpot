import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useRecommendationsStore } from '../../stores/recommendationsStore';
import { useSavedStore } from '../../stores/savedStore';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { RatingStars } from '../../components/RatingStars';
import { VibeTag } from '../../components/VibeTag';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function RecommendationsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { recommendations, preferences, isLoading, loadRecommendations } = useRecommendationsStore();
  const { toggleSaved, isSaved } = useSavedStore();

  useEffect(() => {
    loadRecommendations();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>For You</Text>
          <Text style={styles.subtitle}>Personalized study spot picks</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadRecommendations}>
          <Ionicons name="refresh-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Preferences Summary */}
      <View style={styles.prefsContainer}>
        <Text style={styles.prefsLabel}>Based on your preferences:</Text>
        <View style={styles.prefsRow}>
          {preferences.preferredVibes.map(vibe => (
            <VibeTag key={vibe} vibe={vibe} size="sm" />
          ))}
        </View>
      </View>

      {/* Recommendations */}
      <FlatList
        data={recommendations}
        keyExtractor={item => item.spot.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const saved = isSaved(item.spot.id);
          return (
            <TouchableOpacity
              style={styles.recCard}
              onPress={() => navigation.navigate('SpotDetail', { spotId: item.spot.id })}
              activeOpacity={0.7}
            >
              <View style={styles.recRank}>
                <Text style={styles.rankNumber}>#{index + 1}</Text>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>{item.matchScore}% match</Text>
                </View>
              </View>
              
              <Image source={{ uri: item.spot.imageUrl }} style={styles.recImage} />
              
              <View style={styles.recContent}>
                <View style={styles.recTop}>
                  <View style={styles.recInfo}>
                    <Text style={styles.recName} numberOfLines={1}>{item.spot.name}</Text>
                    <Text style={styles.recBuilding}>{item.spot.building}</Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleSaved(item.spot.id)}>
                    <Ionicons
                      name={saved ? 'bookmark' : 'bookmark-outline'}
                      size={20}
                      color={saved ? colors.accent : colors.textTertiary}
                    />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.recMeta}>
                  <RatingStars rating={item.spot.averageRating} size={12} />
                  <Text style={styles.recRating}>{item.spot.averageRating.toFixed(1)}</Text>
                </View>
                
                <View style={styles.recReason}>
                  <Ionicons name="sparkles" size={12} color={colors.accent} />
                  <Text style={styles.reasonText}>{item.reason}</Text>
                </View>
                
                <View style={styles.recVibes}>
                  {item.spot.vibes.slice(0, 3).map(vibe => (
                    <VibeTag key={vibe} vibe={vibe} size="sm" />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Ionicons name="sparkles-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyTitle}>No recommendations yet</Text>
              <Text style={styles.emptyText}>
                Rate some spots and we'll personalize your feed
              </Text>
            </View>
          ) : null
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefsContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  prefsLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  prefsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  list: {
    padding: spacing.xl,
  },
  recCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  recRank: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  rankNumber: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textTertiary,
  },
  matchBadge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  matchText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.accent,
  },
  recImage: {
    width: '100%',
    height: 140,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
  },
  recContent: {
    padding: spacing.base,
  },
  recTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  recInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  recName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  recBuilding: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  recMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  recRating: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  recReason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  reasonText: {
    fontSize: typography.sizes.sm,
    color: colors.accent,
    fontWeight: typography.weights.medium,
  },
  recVibes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
