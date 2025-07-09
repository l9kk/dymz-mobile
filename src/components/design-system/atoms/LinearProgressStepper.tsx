import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../tokens';

interface LinearProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  style?: any;
  animationDuration?: number;
}

export const LinearProgressStepper: React.FC<LinearProgressStepperProps> = ({
  currentStep,
  totalSteps,
  style,
  animationDuration = 600
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const progress = Math.max(0, Math.min(1, currentStep / totalSteps));

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
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  }, [progress, animationDuration]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        style,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <View style={styles.track}>
        <Animated.View 
          style={[
            styles.fill,
            { width: progressWidth }
          ]} 
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  track: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.ctaBackground,
    borderRadius: 2,
    shadowColor: colors.ctaBackground,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
}); 