import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../tokens';
import { ProgressRingStat } from './ProgressRingStat';

interface MetricScore {
  score: number;
  title: string;
}

interface ImproveRingRowProps {
  improvementMetrics: MetricScore[];
  ringSize?: number;
  title?: string;
  caption?: string;
  style?: any;
}

export const ImproveRingRow: React.FC<ImproveRingRowProps> = ({
  improvementMetrics,
  ringSize = 108,
  title = "Let's improve these!",
  caption = "These are your lowest scores at the moment",
  style
}) => {
  // Take only the first 3 metrics for display
  const displayMetrics = improvementMetrics.slice(0, 3);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>{caption}</Text>
      
      <View style={styles.ringsContainer}>
        {displayMetrics.map((metric, index) => (
          <ProgressRingStat
            key={metric.title}
            score={metric.score}
            title={metric.title}
            size={ringSize}
            ringThickness={10}
            fillColor={colors.insightRingFill} // Orange for improvement context
            animationDelay={index * 200} // Staggered animation
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.l,
  },
  title: {
    fontSize: typography.fontSizes.bodyL,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  caption: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  ringsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.l,
    flexWrap: 'wrap',
  },
}); 