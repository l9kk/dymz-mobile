import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../tokens';

interface ProgressBarMetricProps {
  value: number;
  maxValue?: number;
  label: string;
  change?: number; // positive or negative change
  style?: any;
}

export const ProgressBarMetric: React.FC<ProgressBarMetricProps> = ({
  value,
  maxValue = 100,
  label,
  change,
  style
}) => {
  const progress = Math.min(Math.max(value / maxValue, 0), 1);
  const isPositiveChange = change && change > 0;
  const isNegativeChange = change && change < 0;
  
  const gradientColors: [string, string] = [colors.accentPalette[4], colors.accentPalette[2]]; // green to salmon

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {change !== undefined && (
          <Text style={[
            styles.changeText,
            isPositiveChange ? styles.positiveChange : null,
            isNegativeChange ? styles.negativeChange : null
          ]}>
            {change > 0 ? '+' : ''}{change}%
          </Text>
        )}
      </View>
      
      <View style={styles.barContainer}>
        <View style={styles.track} />
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${progress * 100}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.s,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilies.body,
  },
  changeText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.fontWeights.semibold,
    fontFamily: typography.fontFamilies.body,
  },
  positiveChange: {
    color: colors.accentPalette[4], // green
  },
  negativeChange: {
    color: colors.accentPalette[2], // salmon
  },
  barContainer: {
    position: 'relative',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  track: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 6,
  },
}); 