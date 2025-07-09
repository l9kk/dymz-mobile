import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../tokens';

interface SectionHeadingProps {
  children: React.ReactNode;
  style?: any;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ children, style }) => {
  return (
    <Text style={[styles.heading, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 38,
    textAlign: 'center',
  },
}); 