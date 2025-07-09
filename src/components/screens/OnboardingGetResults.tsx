import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../design-system/atoms/Icon';
import { ProgressRingStat } from '../design-system/molecules/ProgressRingStat';
import { PrimaryButton } from '../design-system/atoms/PrimaryButton';
import { colors, typography, spacing } from '../design-system/tokens';

interface OnboardingGetResultsProps {
  onContinue: () => void;
}

export const OnboardingGetResults: React.FC<OnboardingGetResultsProps> = ({
  onContinue
}) => {
  // Mock data for demonstration
  const mockStats = [
    { score: 85, title: 'Texture' },
    { score: 72, title: 'Brightness' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Clean analytics icon instead of ugly phone mockup */}
        <View style={styles.iconContainer}>
          <Icon 
            name="analytics-outline" 
            size={80} 
            color={colors.accentPalette[2]}
          />
        </View>
        
        {/* Simplified stats display */}
        <View style={styles.statsContainer}>
          {mockStats.map((stat, index) => (
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
        
        <Text style={styles.title}>
          Get detailed skin analysis results
        </Text>
        
        <Text style={styles.subtitle}>
          Discover insights about your skin health with AI-powered metrics and personalized recommendations.
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
  iconContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 50,
    padding: spacing.l,
    marginBottom: spacing.m,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: spacing.l,
    marginBottom: spacing.l,
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