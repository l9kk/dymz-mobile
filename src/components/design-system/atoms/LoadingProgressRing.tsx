import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface LoadingProgressRingProps {
  progress?: number; // 0-100, if not provided shows indeterminate loading
  size?: number;
  ringThickness?: number;
  color?: string;
  backgroundColor?: string;
  indeterminateSpeed?: number; // ms for one full rotation
  children?: React.ReactNode; // Content to display inside the ring
}

export const LoadingProgressRing: React.FC<LoadingProgressRingProps> = ({
  progress,
  size = 120,
  ringThickness = 8,
  color = colors.ctaBackground,
  backgroundColor = 'rgba(0,0,0,0.08)',
  indeterminateSpeed = 1500,
  children
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const radius = (size - ringThickness) / 2;
  const circumference = 2 * Math.PI * radius;

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Progress animation - when progress prop changes
  useEffect(() => {
    if (progress !== undefined) {
      const targetProgress = Math.min(Math.max(progress / 100, 0), 1);
      Animated.timing(progressAnim, {
        toValue: targetProgress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [progress]);

  // Indeterminate rotation animation - when no progress prop provided
  useEffect(() => {
    if (progress === undefined) {
      const rotateAnimation = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: indeterminateSpeed,
          useNativeDriver: true,
        }),
        { iterations: -1 }
      );
      rotateAnimation.start();

      return () => rotateAnimation.stop();
    }
  }, [progress, indeterminateSpeed]);

  // Animation interpolations
  const animatedStrokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
    extrapolate: 'clamp',
  });

  const rotationInterpolation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isIndeterminate = progress === undefined;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <View style={[styles.ringContainer, { width: size, height: size }]}>
        <Animated.View
          style={[
            styles.svgContainer,
            isIndeterminate && {
              transform: [{ rotate: rotationInterpolation }],
            }
          ]}
        >
          <Svg width={size} height={size}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={backgroundColor}
              strokeWidth={ringThickness}
              fill="transparent"
            />
            {/* Animated progress circle */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={ringThickness}
              fill="transparent"
              strokeDasharray={
                isIndeterminate 
                  ? `${circumference * 0.25} ${circumference * 0.75}` // 25% visible for indeterminate
                  : circumference
              }
              strokeDashoffset={
                isIndeterminate 
                  ? 0 
                  : animatedStrokeDashoffset
              }
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
        </Animated.View>
        
        {/* Inner content area for children */}
        <View style={[styles.innerContent, { width: size - ringThickness * 4, height: size - ringThickness * 4 }]}>
          {children}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    position: 'absolute',
  },
  innerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
}); 