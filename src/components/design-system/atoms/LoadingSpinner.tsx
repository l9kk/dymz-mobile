import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../tokens';

interface LoadingSpinnerProps {
  size?: number;
  tintColor?: string;
  accessibilityLabel?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 48,
  tintColor = colors.ctaBackground,
  accessibilityLabel = "Analyzing, please wait"
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={tintColor}
        style={{ width: size, height: size }}
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 