import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../tokens';

interface BulletItem {
  emoji: string;
  text: string;
}

interface EmojiBulletListProps {
  items: BulletItem[];
  style?: any;
}

export const EmojiBulletList: React.FC<EmojiBulletListProps> = ({
  items,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => (
        <View key={index} style={styles.bulletItem}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    padding: spacing.m,
    borderRadius: radii.card,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.s,
  },
  emoji: {
    fontSize: 18,
    marginRight: spacing.s,
    marginTop: 2, // Slight vertical adjustment to align with text
  },
  text: {
    flex: 1,
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textPrimary,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
  },
}); 