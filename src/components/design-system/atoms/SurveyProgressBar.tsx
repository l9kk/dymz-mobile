import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../tokens';

interface SurveyProgressBarProps {
  totalSteps: number;
  currentStep: number;
  height?: number;
  cornerRadius?: number;
  animated?: boolean;
}

export const SurveyProgressBar: React.FC<SurveyProgressBarProps> = ({
  totalSteps,
  currentStep,
  height = 6,
  cornerRadius = 3,
  animated = true,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressPercentage = Math.min(currentStep / totalSteps, 1);

  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progressPercentage,
        duration: 350,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(progressPercentage);
    }
  }, [progressPercentage, animated]);

  return (
    <View style={[styles.container, { height, borderRadius: cornerRadius }]}>
      <Animated.View
        style={[
          styles.progressFill,
          {
            borderRadius: cornerRadius,
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
          },
        ]}
      />
      {/* Segment markers for visual division */}
      {Array.from({ length: totalSteps - 1 }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.segmentMarker,
            {
              left: `${((index + 1) / totalSteps) * 100}%`,
              height: height,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.08)', // upcoming segments
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accentPalette[4], // green as specified
    position: 'absolute',
    left: 0,
    top: 0,
  },
  segmentMarker: {
    position: 'absolute',
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: 0,
  },
}); 