import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ProgressRingStat } from './ProgressRingStat';
import { colors, spacing } from '../tokens';

interface MetricData {
  score: number;
  title: string;
  isLocked?: boolean;
}

interface MetricsCarouselProps {
  metrics: MetricData[];
  ringSize?: number;
}

export const MetricsCarousel: React.FC<MetricsCarouselProps> = ({
  metrics,
  ringSize = 96
}) => {
  const renderMetric = (metric: MetricData, index: number) => {
    if (metric.isLocked) {
      return (
        <View key={index} style={styles.metricContainer}>
          <View style={[styles.lockedRing, { width: ringSize, height: ringSize }]}>
            <View style={styles.lockIcon}>
              <View style={styles.lockSymbol} />
            </View>
          </View>
          <View style={styles.titleContainer}>
            <View style={styles.titleText} />
          </View>
        </View>
      );
    }

    return (
      <View key={index} style={styles.metricContainer}>
        <ProgressRingStat
          score={metric.score}
          title={metric.title}
          size={ringSize}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ringSize + spacing.l * 2} // Ring size + margins
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {metrics.map(renderMetric)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
  },
  metricContainer: {
    marginHorizontal: spacing.l,
    alignItems: 'center',
  },
  lockedRing: {
    backgroundColor: 'rgba(92,82,67,0.12)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lockIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockSymbol: {
    width: 12,
    height: 12,
    backgroundColor: '#FFCCCB',
    borderRadius: 2,
  },
  titleContainer: {
    marginTop: spacing.s,
    alignItems: 'center',
  },
  titleText: {
    width: 60,
    height: 12,
    backgroundColor: 'rgba(92,82,67,0.2)',
    borderRadius: 6,
  },
}); 