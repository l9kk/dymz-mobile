import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography, spacing } from '../tokens';

interface LegendItem {
  ringColor: string;
  scoreSample: number;
  title: string;
  subtitle: string;
}

interface RingScoreLegendProps {
  ringSize?: number;
}

const legendItems: LegendItem[] = [
  {
    ringColor: '#6AC47E',
    scoreSample: 90,
    title: 'Great',
    subtitle: 'Keep it up'
  },
  {
    ringColor: '#F5CA31',
    scoreSample: 50,
    title: 'Getting there',
    subtitle: 'Room for improvement'
  },
  {
    ringColor: '#E56F6F',
    scoreSample: 6,
    title: 'Concern',
    subtitle: 'Need attention'
  }
];

export const RingScoreLegend: React.FC<RingScoreLegendProps> = ({
  ringSize = 84
}) => {
  const radius = (ringSize - 8) / 2; // 8px thickness
  const circumference = 2 * Math.PI * radius;

  const renderLegendItem = (item: LegendItem, index: number) => {
    const progress = item.scoreSample / 100;
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <View key={index} style={styles.legendItem}>
        <View style={[styles.ringContainer, { width: ringSize, height: ringSize }]}>
          <Svg width={ringSize} height={ringSize}>
            {/* Background circle */}
            <Circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth={8}
              fill="transparent"
            />
            {/* Progress circle */}
            <Circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke={item.ringColor}
              strokeWidth={8}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
            />
          </Svg>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{item.scoreSample}</Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.subtitleText}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {legendItems.map(renderLegendItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s,
  },
  legendItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.s,
  },
  ringContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: typography.fontSizes.displayL,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilies.display,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: spacing.s,
  },
  titleText: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilies.body,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilies.body,
    textAlign: 'center',
    marginTop: 2,
  },
}); 