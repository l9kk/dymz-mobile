import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, elevation } from '../tokens';
import { Icon, IconNames } from '../atoms';
import { ImageUrls } from '../../../utils/imageUrls';

interface ExampleImageGridProps {
  type: 'good' | 'bad';
  images?: string[]; // URLs or placeholders
  style?: any;
}

export const ExampleImageGrid: React.FC<ExampleImageGridProps> = ({
  type,
  images,
  style
}) => {
  const isGood = type === 'good';
  const label = isGood ? 'Good Examples' : 'Bad Examples';
  const defaultImages = isGood ? ImageUrls.goodSelfies : ImageUrls.badSelfies;
  const imagesToShow = images || defaultImages;
  const iconName = isGood ? IconNames.check : IconNames.close;
  const accentColor = isGood ? colors.successBackground : colors.errorBackground;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={[styles.labelIcon, { backgroundColor: accentColor }]}>
          <Icon
            name={iconName}
            size={16}
            color={colors.backgroundPrimary}
          />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      
      <View style={styles.grid}>
        {imagesToShow.slice(0, 3).map((image, index) => (
          <View key={index} style={styles.imageItem}>
            <Image 
              source={{ uri: image }}
              style={styles.exampleImage}
              resizeMode="cover"
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.m,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  labelIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
    ...elevation.subtle,
  },
  label: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilies.body,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.s,
  },
  imageItem: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.s,
    flex: 1,
    overflow: 'hidden',
    ...elevation.subtle,
  },
  exampleImage: {
    width: '100%',
    height: '100%',
  },
});