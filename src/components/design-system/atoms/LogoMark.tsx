import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../tokens';

interface LogoMarkProps {
  size?: 'splash' | 'default';
  style?: any;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ 
  size = 'default',
  style 
}) => {
  const logoHeight = size === 'splash' ? 96 : 48;
  
  return (
    <View style={[styles.container, { height: logoHeight }, style]}>
      <Text style={[styles.logoText, { fontSize: logoHeight * 0.4 }]}>
        dymz
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
}); 