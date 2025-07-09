import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { spacing } from '../tokens';

interface MotivationImageGridProps {
  images: ImageSourcePropType[];
  itemSize?: number;
  columnCount?: number;
  gap?: number;
  cornerRadius?: number;
}

export const MotivationImageGrid: React.FC<MotivationImageGridProps> = ({
  images,
  itemSize = 148,
  columnCount = 2,
  gap = spacing.s,
  cornerRadius = 16,
}) => {
  const renderImage = (imageSource: ImageSourcePropType, index: number) => {
    const isLastInRow = (index % columnCount) === (columnCount - 1);
    const isLastRow = index >= images.length - columnCount;
    
    return (
      <View
        key={index}
        style={[
          styles.imageContainer,
          {
            width: itemSize,
            height: itemSize,
            borderRadius: cornerRadius,
            marginRight: isLastInRow ? 0 : gap,
            marginBottom: isLastRow ? 0 : gap,
          },
        ]}
      >
      <Image
        source={imageSource}
        style={[styles.image, { borderRadius: cornerRadius }]}
        resizeMode="cover"
        onError={(error) => {
          console.log('MotivationImageGrid: Image failed to load', { index, imageSource, error: error.nativeEvent });
        }}
        onLoad={() => {
          if (__DEV__) {
            console.log('MotivationImageGrid: Image loaded successfully', { index, imageSource });
          }
        }}
      />
    </View>
  );
};

  return (
    <View style={styles.container}>
      {images.slice(0, 4).map(renderImage)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
}); 