import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, elevation, borderRadius } from '../tokens';
import { Icon, IconNames } from '../atoms';

interface SocialVideoTileProps {
  title: string;
  count: string;
  iconName?: string;
  iconType?: 'ionicons' | 'material' | 'material-community' | 'feather';
  selected?: boolean;
  onPress?: () => void;
}

export const SocialVideoTile: React.FC<SocialVideoTileProps> = ({
  title,
  count,
  iconName = IconNames.video,
  iconType = 'ionicons',
  selected = false,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, selected && styles.selectedIconContainer]}>
        <Icon
          name={iconName}
          type={iconType}
          size={32}
          color={selected ? colors.ctaText : colors.textSecondary}
        />
      </View>
      
      <Text style={[styles.title, selected && styles.selectedTitle]}>
        {title}
      </Text>
      
      <Text style={[styles.count, selected && styles.selectedCount]}>
        {count}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1, // Keep it square
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    justifyContent: 'space-between',
    alignItems: 'center',
    ...elevation.subtle,
    // Improved shadow for better visual hierarchy
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  selectedContainer: {
    backgroundColor: colors.ctaBackground,
    borderWidth: 2,
    borderColor: colors.ctaBackground,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  selectedIconContainer: {
    backgroundColor: colors.backgroundPrimary,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    flex: 1,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  selectedTitle: {
    color: colors.ctaText,
  },
  count: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedCount: {
    color: colors.ctaText,
    opacity: 0.8,
  },
}); 