import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, elevation } from '../tokens';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SuccessBadgeProps {
  style?: any;
  animated?: boolean;
  animationDelay?: number;
}

export const SuccessBadge: React.FC<SuccessBadgeProps> = ({ 
  style, 
  animated = true,
  animationDelay = 0
}) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const checkmarkProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      const timeout = setTimeout(() => {
        // First animate the circle appearing
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start(() => {
          // Then animate the checkmark drawing
          Animated.timing(checkmarkProgress, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
          }).start();
        });
      }, animationDelay);

      return () => clearTimeout(timeout);
    } else {
      scaleValue.setValue(1);
      checkmarkProgress.setValue(1);
    }
  }, [animated, animationDelay]);

  // SVG checkmark path
  const checkmarkPath = "M20 32 L32 44 L52 24";
  
  // Calculate path length for stroke animation
  const pathLength = 44; // Approximate length of the checkmark path

  const animatedStrokeDashoffset = checkmarkProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [pathLength, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleValue }] },
        style
      ]}
    >
      <Svg width="96" height="96" viewBox="0 0 72 72">
        <AnimatedPath
          d={checkmarkPath}
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={pathLength}
          strokeDashoffset={animatedStrokeDashoffset}
        />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 96,
    height: 96,
    borderRadius: 48, // Half of width/height for perfect circle
    backgroundColor: '#6AC47E', // Success green as specified
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.card, // Card shadow as specified
  },
}); 