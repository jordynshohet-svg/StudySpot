import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SpotVibe, NoiseLevel } from '../../types';
import { useSpotsStore } from '../../stores/spotsStore';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { SpotCard } from '../../components/SpotCard';
import { VibeTag } from '../../components/VibeTag';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ALL_VIBES: SpotVibe[] = ['quiet', 'collaborative', 'caffeinated', 'outdoor', 'cozy', 'lively', 'aesthetic'];

export function ExploreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    filteredSpots,
    searchQuery,
    activeVibes,
    needsOutlets,
    needsWifi,
    loadSpots,
    setSearchQuery,
    toggleVibe,
    toggleOutlets,
    toggleWifi,
    clearFilters,
  } = useSpotsStore();

  useEffect(() => {
    loadSpots();
  }, []);

  const hasActiveFilters = activeVibes.length > 0 || needsOutlets || needsWifi || searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search spots, buildings..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {ALL_VIBES.map(vibe => (
            <VibeTag
              key={vibe}
              vibe={vibe}
              selected={activeVibes.includes(vibe)}
              onPress={() => toggleVibe(vibe)}
            />
          ))}
        </ScrollView>
        
        {/* Quick filters */}
        <View style={styles.quickFilters}>
          <TouchableOpacity
            style={[styles.quickFilter, needsOutlets && styles.quickFilterActive]}
            onPress={toggleOutlets}
          >
            <Ionicons
              name="flash-outline"
              size={14}
              color={needsOutlets ? colors.textInverse : colors.textSecondary}
            />
            <Text style={[styles.quickFilterText, needsOutlets && styles.quickFilterTextActive]}>
              Outlets
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickFilter, needsWifi && styles.quickFilterActive]}
            onPress={toggleWifi}
          >
            <Ionicons
              name="wifi-outline"
              size={14}
              color={needsWifi ? colors.textInverse : colors.textSecondary}
            />
            <Text style={[styles.quickFilterText, needsWifi && styles.quickFilterTextActive]}>
              WiFi
            </Text>
          </TouchableOpacity>
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <FlatList
        data={filteredSpots}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SpotCard
            spot={item}
            onPress={() => navigation.navigate('SpotDetail', { spotId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No spots found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters</Text>
          </View>
        }
        ListHeaderComponent={
          <Text style={styles.resultsCount}>
            {filteredSpots.length} spot{filteredSpots.length !== 1 ? 's' : ''} found
          </Text>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.textPrimary,
  },
  filtersSection: {
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filtersScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  quickFilters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  quickFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickFilterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickFilterText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  quickFilterTextActive: {
    color: colors.textInverse,
  },
  clearBtn: {
    marginLeft: 'auto',
  },
  clearText: {
    fontSize: typography.sizes.sm,
    color: colors.accent,
    fontWeight: typography.weights.medium,
  },
  list: {
    padding: spacing.xl,
    paddingTop: spacing.md,
  },
  resultsCount: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
});
