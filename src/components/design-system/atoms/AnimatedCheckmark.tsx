import React, { useRef, useEffect } from 'react';
import { Animated, ViewStyle } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { animations } from '../tokens';

interface AnimatedCheckmarkProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  animationDelay?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({
  size = 80,
  color = '#6AC47E',
  strokeWidth = 3,
  animationDelay = 0,
  style,
  animated = true
}) => {
  const scaleAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;

  useEffect(() => {
    if (animated) {
      // Simple, smooth animation with proper timing
      const timeout = setTimeout(() => {
        Animated.parallel([
          // Smooth scale animation with bounce
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          // Smooth opacity fade in
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: animations.timing.quick,
            easing: animations.easing.gentle,
            useNativeDriver: true,
          }),
        ]).start();
      }, animationDelay);

      return () => clearTimeout(timeout);
    }
  }, [animated, animationDelay, scaleAnim, opacityAnim]);

  // Simple, clean checkmark path
  const checkmarkPath = `M${size * 0.25} ${size * 0.5} L${size * 0.4} ${size * 0.65} L${size * 0.75} ${size * 0.35}`;

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
        style
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Circle background */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill={color}
        />
        {/* Static checkmark (no stroke animation for better performance) */}
        <Path
          d={checkmarkPath}
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
}; 