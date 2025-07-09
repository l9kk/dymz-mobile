import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../tokens';

interface PageDotsIndicatorProps {
  totalDots: number;
  activeDot: number;
  dotSize?: number;
  gap?: number;
}

export const PageDotsIndicator: React.FC<PageDotsIndicatorProps> = ({
  totalDots,
  activeDot,
  dotSize = 8,
  gap = 8
}) => {
  const renderDot = (index: number) => {
    const isActive = index === activeDot;
    
    return (
      <View
        key={index}
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: isActive ? colors.ctaBackground : 'rgba(0,0,0,0.15)',
            marginHorizontal: gap / 2,
          }
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: totalDots }, (_, index) => renderDot(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    minHeight: 32, // Ensure minimum touch area as per guidelines
  },
  dot: {
    // Base dot styles - size and color applied dynamically
  },
}); 