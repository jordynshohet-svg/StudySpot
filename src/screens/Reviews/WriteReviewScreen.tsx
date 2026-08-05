import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, SpotVibe, NoiseLevel } from '../../types';
import { useReviewsStore } from '../../stores/reviewsStore';
import { useAuthStore } from '../../stores/authStore';
import { useSpotsStore } from '../../stores/spotsStore';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { VibeTag } from '../../components/VibeTag';

type DetailRoute = RouteProp<RootStackParamList, 'WriteReview'>;

const ALL_VIBES: SpotVibe[] = ['quiet', 'collaborative', 'caffeinated', 'outdoor', 'cozy', 'lively', 'aesthetic'];
const NOISE_LEVELS: { value: NoiseLevel; label: string; icon: string }[] = [
  { value: 'silent', label: 'Silent', icon: '🤫' },
  { value: 'quiet', label: 'Quiet', icon: '🔈' },
  { value: 'moderate', label: 'Moderate', icon: '🔉' },
  { value: 'lively', label: 'Lively', icon: '🔊' },
];

export function WriteReviewScreen() {
  const navigation = useNavigation();
  const route = useRoute<DetailRoute>();
  const { spotId } = route.params;
  const { submitReview, isSubmitting } = useReviewsStore();
  const user = useAuthStore(state => state.user);
  const spot = useSpotsStore(state => state.spots.find(s => s.id === spotId));

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<SpotVibe[]>([]);
  const [noiseLevel, setNoiseLevel] = useState<NoiseLevel | null>(null);

  const toggleVibe = (vibe: SpotVibe) => {
    setSelectedVibes(prev =>
      prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]
    );
  };

  const handleSubmit = async () => {
    if (!user || rating === 0) return;

    await submitReview({
      spotId,
      userId: user.id,
      userName: user.displayName,
      rating,
      vibes: selectedVibes,
      noiseLevel: noiseLevel || 'moderate',
      comment,
      images: [],
      visitedAt: new Date().toISOString(),
    });

    navigation.goBack();
  };

  const isValid = rating > 0 && comment.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write Review</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Spot name */}
        <Text style={styles.spotName}>{spot?.name || 'Study Spot'}</Text>

        {/* Rating */}
        <View style={styles.section}>
          <Text style={styles.label}>Your Rating</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={36}
                  color={star <= rating ? colors.accent : colors.border}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Vibes */}
        <View style={styles.section}>
          <Text style={styles.label}>What vibes did you get?</Text>
          <View style={styles.vibesContainer}>
            {ALL_VIBES.map(vibe => (
              <VibeTag
                key={vibe}
                vibe={vibe}
                selected={selectedVibes.includes(vibe)}
                onPress={() => toggleVibe(vibe)}
              />
            ))}
          </View>
        </View>

        {/* Noise Level */}
        <View style={styles.section}>
          <Text style={styles.label}>Noise level</Text>
          <View style={styles.noiseLevels}>
            {NOISE_LEVELS.map(level => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.noiseOption,
                  noiseLevel === level.value && styles.noiseOptionActive,
                ]}
                onPress={() => setNoiseLevel(level.value)}
              >
                <Text style={styles.noiseEmoji}>{level.icon}</Text>
                <Text
                  style={[
                    styles.noiseLabel,
                    noiseLevel === level.value && styles.noiseLabelActive,
                  ]}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comment */}
        <View style={styles.section}>
          <Text style={styles.label}>Your review</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share your experience — what made this spot great or not so great?"
            placeholderTextColor={colors.textTertiary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Submit */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={styles.submitText}>Post Review</Text>
          )}
        </TouchableOpacity>
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  form: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  spotName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  vibesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  noiseLevels: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  noiseOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  noiseOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  noiseEmoji: {
    fontSize: 18,
  },
  noiseLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  noiseLabelActive: {
    color: colors.textInverse,
  },
  textArea: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    fontSize: typography.sizes.base,
    color: colors.textPrimary,
    minHeight: 120,
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textInverse,
  },
});
