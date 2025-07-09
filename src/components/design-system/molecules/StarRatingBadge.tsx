import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../tokens';

interface StarRatingBadgeProps {
  rating?: number;
  maxRating?: number;
  style?: any;
}

export const StarRatingBadge: React.FC<StarRatingBadgeProps> = ({
  rating = 5,
  maxRating = 5,
  style
}) => {
  const stars = Array.from({ length: maxRating }, (_, index) => (
    <Text key={index} style={styles.star}>
      ★
    </Text>
  ));

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.laurel}>🌿</Text>
      <View style={styles.starsContainer}>
        {stars}
      </View>
      <Text style={styles.laurel}>🌿</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.s,
  },
  star: {
    fontSize: 16,
    color: '#F8DB87',
    marginHorizontal: 1,
  },
  laurel: {
    fontSize: 16,
    opacity: 0.6,
  },
}); 