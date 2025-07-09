import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '../tokens';

interface TagChipProps {
  label: string;
  style?: ViewStyle;
}

export const TagChip: React.FC<TagChipProps> = ({ label, style }) => {
  return (
    <View style={[styles.chip, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: 'rgba(92, 82, 67, 0.12)',
    borderRadius: 999, // pill shape
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilies.body,
  },
}); 