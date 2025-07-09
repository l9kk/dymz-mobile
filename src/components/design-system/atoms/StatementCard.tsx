import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { colors, spacing, typography, elevation } from '../tokens';

interface StatementCardProps {
  imageSource?: ImageSourcePropType;
  imageUris?: string[]; // For collage layout - 6 images
  quote: string;
  aspectRatio?: number;
  layout?: 'single' | 'collage';
}

export const StatementCard: React.FC<StatementCardProps> = ({
  imageSource,
  imageUris,
  quote,
  aspectRatio = 4 / 5,
  layout = 'single'
}) => {
  const renderCollageBackground = () => {
    if (!imageUris || imageUris.length < 6) {
      console.warn('StatementCard collage layout requires 6 images');
      // Return fallback background if images are missing
      return <View style={styles.fallbackBackground} />;
    }

    return (
      <View style={styles.collageContainer}>
        {imageUris.slice(0, 6).map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.collageImage}
            resizeMode="cover"
            onError={(error) => {
              if (__DEV__) {
                console.log('StatementCard collage image failed to load', { index, uri, error: error.nativeEvent });
              }
            }}
          />
        ))}
      </View>
    );
  };

  const renderSingleBackground = () => {
    if (!imageSource) {
      // Fallback to working image if no image source
      return (
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=375&fit=crop' }}
          style={styles.backgroundImage}
        />
      );
    }
    return (
      <Image 
        source={imageSource} 
        style={styles.backgroundImage}
        onError={(error) => {
          if (__DEV__) {
            console.log('StatementCard: Image failed to load', { imageSource, error: error.nativeEvent });
          }
        }}
        onLoad={() => {
          if (__DEV__) {
            console.log('StatementCard: Image loaded successfully', { imageSource });
          }
        }}
      />
    );
  };

  return (
    <View style={[styles.container, { aspectRatio }]}>
      {layout === 'collage' ? renderCollageBackground() : renderSingleBackground()}
      <View style={styles.overlay} />
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteGlyph}>"</Text>
        <Text style={styles.quoteText}>{quote}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20, // card radius token
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  fallbackBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: colors.backgroundTertiary,
  },
  collageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  collageImage: {
    width: '50%', // 2 columns
    height: '33.333%', // 3 rows
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  quoteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
    position: 'relative',
  },
  quoteGlyph: {
    fontSize: 112,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: typography.fontFamilies.primary,
    position: 'absolute',
    bottom: spacing.m,
    left: spacing.m,
    lineHeight: 112,
  },
  quoteText: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.textOnDark,
    textAlign: 'center',
    maxWidth: '100%',
    paddingHorizontal: spacing.s, // 8px inner padding to avoid touching edges
  },
}); 