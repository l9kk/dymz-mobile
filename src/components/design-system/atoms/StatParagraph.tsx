import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '../tokens';

interface StatParagraphProps {
  children: string;
  style?: any;
  textAlign?: 'left' | 'center' | 'right';
}

export const StatParagraph: React.FC<StatParagraphProps> = ({ 
  children, 
  style,
  textAlign = 'left'
}) => {
  return (
    <Text style={[
      styles.text,
      { textAlign },
      style
    ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.regular,
    color: colors.textSecondary,
    maxWidth: 320,
    lineHeight: typography.lineHeights.relaxed,
  },
}); 