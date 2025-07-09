import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../tokens';

interface SecondaryTextLinkProps {
  title: string;
  onPress?: () => void;
}

export const SecondaryTextLink: React.FC<SecondaryTextLinkProps> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 44, // Touch target
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
}); 