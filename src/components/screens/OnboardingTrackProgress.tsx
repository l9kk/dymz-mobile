import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../design-system/atoms/Icon';
import { ProgressRingStat } from '../design-system/molecules/ProgressRingStat';
import { PrimaryButton } from '../design-system/atoms/PrimaryButton';
import { colors, typography, spacing } from '../design-system/tokens';

interface OnboardingTrackProgressProps {
  onContinue: () => void;
}

export const OnboardingTrackProgress: React.FC<OnboardingTrackProgressProps> = ({
  onContinue
}) => {
  // Sample progress data to show the concept
  const ringStats = [
    { score: 85, title: 'Hydration' },
    { score: 72, title: 'Texture' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Main analytics icon */}
        <View style={styles.mainIconContainer}>
          <Icon 
            name="trending-up" 
            size={80} 
            color={colors.accentPalette[2]}
          />
        </View>
        
        {/* Progress indicators grid */}
        <View style={styles.progressGrid}>
          <View style={styles.progressRow}>
            {ringStats.map((stat, index) => (
              <ProgressRingStat
                key={stat.title}
                score={stat.score}
                title={stat.title}
                size={80}
                fillColor={colors.accentPalette[index % colors.accentPalette.length]}
                animationDelay={index * 200 + 500}
                animationDuration={800}
              />
            ))}
          </View>
        </View>
        
        {/* Analytics feature icons */}
        <View style={styles.featuresGrid}>
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <Icon name="analytics-outline" size={24} color={colors.accentPalette[0]} />
              <Text style={styles.featureLabel}>Charts</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="bar-chart-outline" size={24} color={colors.accentPalette[1]} />
              <Text style={styles.featureLabel}>Metrics</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="trophy-outline" size={24} color={colors.accentPalette[2]} />
              <Text style={styles.featureLabel}>Goals</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.title}>
          Track your skin improvements
        </Text>
        
        <Text style={styles.subtitle}>
          Visualize your progress with detailed charts, metrics, and weekly comparisons to see real results.
        </Text>
        
        <PrimaryButton 
          title="Continue" 
          onPress={onContinue}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
    gap: spacing.l,
  },
  mainIconContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 50,
    padding: spacing.l,
    marginBottom: spacing.m,
  },
  progressGrid: {
    marginBottom: spacing.l,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.xl,
  },
  featuresGrid: {
    marginBottom: spacing.l,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.l,
  },
  featureItem: {
    alignItems: 'center',
    gap: spacing.s,
    minWidth: 60,
  },
  featureLabel: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilies.body,
    textAlign: 'center',
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
    marginTop: spacing.m,
  },
  subtitle: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
    marginHorizontal: spacing.m,
  },
  button: {
    marginTop: spacing.l,
    width: '100%',
  },
});