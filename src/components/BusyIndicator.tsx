import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

interface BusyIndicatorProps {
  level: number; // 0-100
  compact?: boolean;
}

export function BusyIndicator({ level, compact = false }: BusyIndicatorProps) {
  const getColor = () => {
    if (level < 30) return colors.success;
    if (level < 60) return colors.warning;
    return colors.error;
  };

  const getLabel = () => {
    if (level < 30) return 'Not busy';
    if (level < 60) return 'Moderate';
    return 'Very busy';
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.dot, { backgroundColor: getColor() }]} />
        <Text style={styles.compactLabel}>{getLabel()}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{getLabel()}</Text>
        <Text style={styles.percentage}>{level}%</Text>
      </View>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${level}%`, backgroundColor: getColor() },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  percentage: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
  },
  barBackground: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  compactLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
});
