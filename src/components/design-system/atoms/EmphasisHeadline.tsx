import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '../tokens';

interface EmphasisHeadlineProps {
  parts: string[];
  accentIndices?: number[];
  style?: any;
  textAlign?: 'left' | 'center' | 'right';
}

export const EmphasisHeadline: React.FC<EmphasisHeadlineProps> = ({
  parts,
  accentIndices = [],
  style,
  textAlign = 'center',
}) => {
  return (
    <Text style={[styles.headline, { textAlign }, style]}>
      {parts.map((part, index) => {
        const isAccent = accentIndices.includes(index);
        return (
          <Text
            key={index}
            style={isAccent ? styles.accentText : styles.defaultText}
          >
            {part}
            {index < parts.length - 1 ? ' ' : ''}
          </Text>
        );
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  headline: {
    ...typography.displayL,
    fontWeight: 'bold',
    lineHeight: 42,
  },
  defaultText: {
    color: colors.textPrimary,
  },
  accentText: {
    color: colors.accentPalette[0], // First accent color as specified
  },
}); 