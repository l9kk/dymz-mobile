import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, elevation } from '../tokens';

interface PhoneMockupProps {
  children?: React.ReactNode;
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  width = 200,
  height = 360,
  style
}) => {
  const aspectRatio = height / width;
  const phoneStyle = [
    styles.phone,
    {
      width,
      height,
      aspectRatio
    },
    style
  ];

  return (
    <View style={phoneStyle}>
      <View style={styles.screen}>
        {children}
      </View>
      <View style={styles.homeIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  phone: {
    backgroundColor: colors.textPrimary,
    borderRadius: 24,
    padding: 3,
    ...elevation.card,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 21,
    overflow: 'hidden',
    position: 'relative',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 4,
    backgroundColor: colors.surfaceNeutral,
    borderRadius: 2,
    opacity: 0.6,
  },
}); 