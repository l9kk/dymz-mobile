import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MetricsCarousel } from '../molecules';
import { colors, spacing } from '../tokens';

interface MetricItem {
  title: string;
  score: number; // 0-100
  isLocked?: boolean;
}

interface LatestResultsCardProps {
  imageUrl: string;
  metrics: MetricItem[];
  onPress?: () => void;
}

export const LatestResultsCard: React.FC<LatestResultsCardProps> = ({ imageUrl, metrics, onPress }) => {
  return (
    <View style={styles.container}>
      {/* Hero image */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Metrics */}
      {metrics.length > 0 && (
        <View style={styles.metricsContainer}>
          <MetricsCarousel metrics={metrics} ringSize={80} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceNeutral,
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4, // 4:5 ratio (0.75)
  },
  metricsContainer: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
  },
}); 