import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { colors } from '../tokens';

interface IllustrationProps {
  width?: number;
  height?: number;
  style?: any;
  backgroundColor?: string;
  imageUrl?: string;
}

export const Illustration: React.FC<IllustrationProps> = ({
  width = 280,
  height = 280,
  style,
  backgroundColor = colors.accentPalette[1],
  imageUrl = 'https://images.unsplash.com/photo-1556228579-0d61a9d4ceea?w=400&h=400&fit=crop&crop=face'
}) => {
  return (
    <View 
      style={[
        styles.container, 
        { 
          width, 
          height, 
          backgroundColor 
        }, 
        style
      ]} 
    >
      <Image 
        source={{ uri: imageUrl }}
        style={styles.illustrationImage}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 140, // Circular shape for organic cloud-shaped backdrop
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
    overflow: 'hidden',
  },
  illustrationImage: {
    width: '80%',
    height: '80%',
    borderRadius: 100,
  },
}); 