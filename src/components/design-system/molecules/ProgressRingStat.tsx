import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography, spacing } from '../tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingStatProps {
  score: number;
  maxScore?: number;
  title: string;
  size?: number;
  ringThickness?: number;
  fillColor?: string;
  animationDelay?: number;
  animationDuration?: number;
}

// Helper function to determine ring color based on score
const getScoreColor = (score: number): string => {
  if (score <= 40) {
    return '#FF4757'; // Red for scores 40 and below
  } else if (score <= 75) {
    return '#FFA502'; // Yellow/Orange for scores 40-75
  } else {
    return '#2ED573'; // Green for scores above 75
  }
};

export const ProgressRingStat: React.FC<ProgressRingStatProps> = ({
  score,
  maxScore = 100,
  title,
  size = 80,
  ringThickness = 6,
  fillColor,
  animationDelay = 0,
  animationDuration = 1000
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const radius = (size - ringThickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetProgress = Math.min(score / maxScore, 1);
  
  // Use score-based color if no fillColor provided
  const ringColor = fillColor || getScoreColor(score);

  useEffect(() => {
    // Entrance animation
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Progress animation after entrance
        Animated.timing(progressAnim, {
          toValue: targetProgress,
          duration: animationDuration,
          useNativeDriver: false,
        }).start();
      });
    }, animationDelay);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStrokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference * (1 - targetProgress)],
    extrapolate: 'clamp',
  });

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
        <Svg width={size} height={size} style={styles.ring}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={ringThickness}
            fill="transparent"
          />
          {/* Animated progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={ringThickness}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={animatedStrokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{Math.round(score)}</Text>
        </View>
      </View>
      <Text style={styles.titleText}>{title}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: spacing.s,
  },
  ringContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
  },
  scoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: typography.fontSizes.displayL,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilies.display,
  },
  titleText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.s,
    fontFamily: typography.fontFamilies.body,
  },
}); 