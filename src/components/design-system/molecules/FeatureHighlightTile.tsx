import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii, elevation } from '../tokens';

interface FeatureHighlightTileProps {
  imageUrl: string;
  caption: string;
  colorIndex?: number; // Index in accentPalette
  style?: any;
}

export const FeatureHighlightTile: React.FC<FeatureHighlightTileProps> = ({
  imageUrl,
  caption,
  colorIndex = 0,
  style
}) => {
  // Use the most saturated colors from accentPalette (indices 2 and 4)
  const backgroundColors = [colors.accentPalette[2], colors.accentPalette[4]];
  const backgroundColor = backgroundColors[colorIndex % backgroundColors.length];

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={styles.content}>
        <Image 
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.caption}>
          {caption}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 148,
    height: 148,
    borderRadius: radii.card, // 20px as specified
    borderWidth: 2,
    borderColor: colors.surface, // White stroke
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.card, // Small drop shadow
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.s,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: spacing.xs,
  },
  caption: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.surface, // White text as specified
    textAlign: 'center',
    lineHeight: typography.lineHeights.tight,
  },
}); 