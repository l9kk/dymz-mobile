import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, spacing } from '../tokens';

interface AvatarGroupCountProps {
  avatarUris: string[];
  userCount: string;
  maxAvatars?: number;
}

export const AvatarGroupCount: React.FC<AvatarGroupCountProps> = ({
  avatarUris,
  userCount,
  maxAvatars = 5,
}) => {
  const displayAvatars = avatarUris.slice(0, maxAvatars);

  return (
    <View style={styles.container}>
      <View style={styles.avatarsContainer}>
        {displayAvatars.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={[
              styles.avatar,
              { 
                zIndex: displayAvatars.length - index,
                marginLeft: index > 0 ? -12 : 0, // 12px overlap offset
              }
            ]}
            resizeMode="cover"
          />
        ))}
      </View>
      <Text style={styles.countText}>{userCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.surfaceNeutral, // White border for separation
  },
  countText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.s,
  },
}); 