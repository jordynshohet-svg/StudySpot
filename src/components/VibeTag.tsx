import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SpotVibe } from '../types';
import { colors, typography, spacing, borderRadius } from '../theme';

interface VibeTagProps {
  vibe: SpotVibe;
  selected?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md';
}

const VIBE_CONFIG: Record<SpotVibe, { label: string; emoji: string; bgColor: string }> = {
  quiet: { label: 'Quiet', emoji: '🤫', bgColor: colors.vibeQuiet },
  collaborative: { label: 'Collaborative', emoji: '👥', bgColor: colors.vibeCollaborative },
  caffeinated: { label: 'Caffeinated', emoji: '☕', bgColor: colors.vibeCaffeinated },
  outdoor: { label: 'Outdoor', emoji: '🌿', bgColor: colors.vibeOutdoor },
  cozy: { label: 'Cozy', emoji: '🧸', bgColor: colors.vibeCozy },
  lively: { label: 'Lively', emoji: '⚡', bgColor: colors.vibeCollaborative },
  aesthetic: { label: 'Aesthetic', emoji: '✨', bgColor: colors.vibeCozy },
};

export function VibeTag({ vibe, selected, onPress, size = 'md' }: VibeTagProps) {
  const config = VIBE_CONFIG[vibe];
  const isSmall = size === 'sm';
  
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: selected ? colors.primary : config.bgColor },
        isSmall && styles.containerSmall,
      ]}
    >
      <Text style={[styles.emoji, isSmall && styles.emojiSmall]}>{config.emoji}</Text>
      <Text
        style={[
          styles.label,
          { color: selected ? colors.textInverse : colors.textPrimary },
          isSmall && styles.labelSmall,
        ]}
      >
        {config.label}
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  containerSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  emoji: {
    fontSize: 14,
  },
  emojiSmall: {
    fontSize: 11,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  labelSmall: {
    fontSize: typography.sizes.xs,
  },
});
