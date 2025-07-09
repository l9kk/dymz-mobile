import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../tokens';
import { ImageUrls } from '../../../utils/imageUrls';

interface Avatar {
  id: string;
  backgroundColor: string;
  imageUrl: string;
}

interface CircleAvatarClusterProps {
  caption?: string;
  style?: any;
}

export const CircleAvatarCluster: React.FC<CircleAvatarClusterProps> = ({
  caption,
  style
}) => {
  // Diverse real user avatars from Unsplash
  const avatars: Avatar[] = ImageUrls.avatars.map((imageUrl, index) => ({
    id: `${index + 1}`,
    backgroundColor: colors.accentPalette[index % colors.accentPalette.length],
    imageUrl,
  }));

  return (
    <View style={[styles.container, style]}>
      <View style={styles.cluster}>
        {/* Background avatars */}
        <View style={[styles.avatar, styles.avatarBackground]}>
          <Image source={{ uri: avatars[0].imageUrl }} style={styles.avatarImage} />
        </View>
        <View style={[styles.avatar, styles.avatarLeft]}>
          <Image source={{ uri: avatars[1].imageUrl }} style={styles.avatarImage} />
        </View>
        <View style={[styles.avatar, styles.avatarRight]}>
          <Image source={{ uri: avatars[2].imageUrl }} style={styles.avatarImage} />
        </View>
        
        {/* Central focused avatar (slightly larger) */}
        <View style={[styles.avatar, styles.avatarCenter]}>
          <Image source={{ uri: avatars[3].imageUrl }} style={styles.avatarImageLarge} />
        </View>
        
        {/* Front avatar */}
        <View style={[styles.avatar, styles.avatarFront]}>
          <Image source={{ uri: avatars[4].imageUrl }} style={styles.avatarImage} />
        </View>
      </View>
      
      {caption && (
        <Text style={styles.caption}>{caption}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.l,
  },
  cluster: {
    width: 200,
    height: 120,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 44,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surfaceNeutral,
    overflow: 'hidden',
  },
  avatarCenter: {
    width: 100, // Slightly larger central avatar
    height: 100,
    borderRadius: 50,
    zIndex: 5,
  },
  avatarBackground: {
    width: 88,
    height: 88,
    top: 10,
    left: 20,
    zIndex: 1,
    opacity: 0.7,
  },
  avatarLeft: {
    width: 88,
    height: 88,
    top: 30,
    left: -10,
    zIndex: 2,
  },
  avatarRight: {
    width: 88,
    height: 88,
    top: 30,
    right: -10,
    zIndex: 2,
  },
  avatarFront: {
    width: 88,
    height: 88,
    bottom: 0,
    right: 30,
    zIndex: 4,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarImageLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  caption: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.m,
  },
}); 