import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SocialVideoTile } from './SocialVideoTile';
import { spacing } from '../tokens';

interface VideoData {
  title: string;
  count: string;
  iconName?: string;
  selected?: boolean;
  onPress?: () => void;
}

interface ProductVideoGridProps {
  videos: VideoData[];
  maxWidth?: number;
  gap?: number;
}

export const ProductVideoGrid: React.FC<ProductVideoGridProps> = ({
  videos,
  maxWidth = 360,
  gap = spacing.m,
}) => {
  // Calculate tile size based on grid layout (2x2 with gap)
  const tileSize = (maxWidth - gap) / 2;

  return (
    <View style={[styles.container, { maxWidth }]}>
      {videos.slice(0, 4).map((video, index) => (
        <View 
          key={index}
          style={[
            styles.tileContainer,
            {
              marginRight: (index % 2 === 0) ? gap : 0,
              marginBottom: index < 2 ? gap : 0,
            }
          ]}
        >
          <SocialVideoTile
            title={video.title}
            count={video.count}
            iconName={video.iconName}
            selected={video.selected}
            onPress={video.onPress}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  tileContainer: {
    // Individual tile container for proper spacing
  },
}); 