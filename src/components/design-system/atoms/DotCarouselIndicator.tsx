import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../tokens';

interface DotCarouselIndicatorProps {
  totalDots: number;
  activeIndex: number;
  dotSize?: number;
  gap?: number;
  activeColor?: string;
  inactiveColor?: string;
  style?: any;
}

export const DotCarouselIndicator: React.FC<DotCarouselIndicatorProps> = ({
  totalDots,
  activeIndex,
  dotSize = 8,
  gap = 8,
  activeColor = colors.ctaBackground,
  inactiveColor = 'rgba(0,0,0,0.25)',
  style
}) => {
  return (
    <View style={[styles.container, { gap }, style]}>
      {Array.from({ length: totalDots }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: index === activeIndex ? activeColor : inactiveColor,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    // Individual dot styling handled via props
  },
}); 