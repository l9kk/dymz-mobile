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
    width: 164,
    height: 164,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: spacing.m,
    marginBottom: spacing.m,
    ...elevation.subtle,
  },
  selectedContainer: {
    backgroundColor: colors.ctaBackground,
    borderWidth: 2,
    borderColor: colors.ctaBackground,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  selectedIconContainer: {
    backgroundColor: colors.backgroundPrimary,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  selectedTitle: {
    color: colors.ctaText,
  },
  count: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectedCount: {
    color: colors.ctaText,
    opacity: 0.8,
  },
}); 