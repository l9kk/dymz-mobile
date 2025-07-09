import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { spacing, radii } from '../tokens';

interface SquareImageGridProps {
  imageUris: string[];
}

export const SquareImageGrid: React.FC<SquareImageGridProps> = ({
  imageUris,
}) => {
  // Ensure we have exactly 4 images for 2x2 grid
  const images = imageUris.slice(0, 4);
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {images.slice(0, 2).map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={[styles.image, index === 1 && styles.lastImageInRow]}
            resizeMode="cover"
          />
        ))}
      </View>
      <View style={styles.row}>
        {images.slice(2, 4).map((uri, index) => (
          <Image
            key={index + 2}
            source={{ uri }}
            style={[styles.image, index === 1 && styles.lastImageInRow]}
            resizeMode="cover"
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12, // Internal gutter
  },
  image: {
    width: 156,
    height: 156,
    borderRadius: radii.card,
    marginRight: 12, // Internal gutter
    borderWidth: 4,
    borderColor: '#FFFFFF', // White border as per guidelines
  },
  lastImageInRow: {
    marginRight: 0,
  },
}); 