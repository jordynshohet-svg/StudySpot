import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useSpotsStore } from '../../stores/spotsStore';
import { useAuthStore } from '../../stores/authStore';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { BusyIndicator } from '../../components/BusyIndicator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

export function MapScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { spots, loadSpots } = useSpotsStore();
  const university = useAuthStore(state => state.university);

  useEffect(() => {
    loadSpots();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Study Spots</Text>
          <Text style={styles.campus}>
            {university?.name || 'Your Campus'}
          </Text>
        </View>
        <TouchableOpacity style={styles.locationBtn}>
          <Ionicons name="navigate" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={64} color={colors.textTertiary} />
          <Text style={styles.mapText}>Interactive Campus Map</Text>
          <Text style={styles.mapSubtext}>
            Map will display when running on a device with react-native-maps
          </Text>
        </View>

        {/* Floating spot indicators */}
        <View style={styles.spotsOverlay}>
          {spots.slice(0, 5).map((spot, index) => (
            <TouchableOpacity
              key={spot.id}
              style={[
                styles.spotPin,
                { top: 40 + index * 50, left: 30 + (index % 3) * 100 },
              ]}
              onPress={() => navigation.navigate('SpotDetail', { spotId: spot.id })}
            >
              <View style={styles.pinContainer}>
                <Text style={styles.pinRating}>{spot.averageRating.toFixed(1)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Quick Access */}
      <View style={styles.bottomSheet}>
        <View style={styles.handle} />
        <Text style={styles.nearbyTitle}>Nearby Spots</Text>
        {spots.slice(0, 3).map(spot => (
          <TouchableOpacity
            key={spot.id}
            style={styles.nearbyItem}
            onPress={() => navigation.navigate('SpotDetail', { spotId: spot.id })}
          >
            <View style={styles.nearbyInfo}>
              <Text style={styles.nearbyName} numberOfLines={1}>{spot.name}</Text>
              <Text style={styles.nearbyBuilding}>{spot.building}</Text>
            </View>
            <View style={styles.nearbyMeta}>
              <BusyIndicator level={spot.busyLevel} compact />
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>
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
    paddingVertical: spacing.base,
  },
  greeting: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  campus: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    margin: spacing.base,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  mapText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  mapSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  spotsOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  spotPin: {
    position: 'absolute',
  },
  pinContainer: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  pinRating: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textInverse,
  },
  bottomSheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.base,
    ...shadows.lg,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.base,
  },
  nearbyTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  nearbyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  nearbyBuilding: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  nearbyMeta: {
    marginRight: spacing.sm,
  },
});
