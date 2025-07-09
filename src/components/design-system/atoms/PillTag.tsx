import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../tokens';

interface PillTagProps {
  title: string;
  isSelected?: boolean;
  onPress?: () => void;
}

export const PillTag: React.FC<PillTagProps> = ({
  title,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, isSelected && styles.textSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 44,
    paddingHorizontal: spacing.m,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 22, // pill shape
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
    marginBottom: spacing.s,
  },
  containerSelected: {
    backgroundColor: 'rgba(92,82,67,0.12)',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  textSelected: {
    color: colors.textPrimary,
  },
}); 