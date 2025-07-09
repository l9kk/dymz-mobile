import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../tokens';

interface BackButtonProps {
  onPress?: () => void;
  style?: any;
  accessibilityLabel?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  style,
  accessibilityLabel = "Go back"
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.icon}>←</Text>
      <Text style={styles.label}>Back</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: 20,
    color: colors.textPrimary,
    marginRight: spacing.xs,
  },
  label: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.medium,
  },
}); 