import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../tokens';

interface InfoNoteProps {
  text: string;
  style?: any;
}

export const InfoNote: React.FC<InfoNoteProps> = ({
  text,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>ℹ️</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.s,
  },
  icon: {
    fontSize: 18,
    marginRight: spacing.s,
    marginTop: 1, // Slight alignment adjustment
  },
  text: {
    flex: 1,
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.caption,
  },
}); 