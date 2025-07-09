import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../design-system/tokens';

interface ProcessingAnalysisProps {
  onComplete?: () => void;
  duration?: number; // Duration in milliseconds, default 3000
}

export const ProcessingAnalysis: React.FC<ProcessingAnalysisProps> = ({
  onComplete,
  duration = 3000
}) => {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotationAnim] = useState(new Animated.Value(0));
  const [progressAnim] = useState(new Animated.Value(0));
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "Analyzing your skin...",
    "Detecting skin metrics...",
    "Processing results...",
    "Almost ready!"
  ];

  useEffect(() => {
    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    // Rotation animation
    const rotationAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Progress animation
    const progressAnimation = Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    });

    // Start animations
    pulseAnimation.start();
    rotationAnimation.start();
    progressAnimation.start();

    // Message cycling
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, duration / messages.length);

    // Complete after duration
    const completeTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => {
      pulseAnimation.stop();
      rotationAnimation.stop();
      progressAnimation.stop();
      clearInterval(messageInterval);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Main Animation Area */}
        <View style={styles.animationContainer}>
          {/* Pulsing Background Circle */}
          <Animated.View 
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
              }
            ]} 
          />
          
          {/* Rotating Scanner Effect */}
          <Animated.View 
            style={[
              styles.scannerRing,
              {
                transform: [{ rotate: spin }],
              }
            ]} 
          />
          
          {/* Center AI Icon */}
          <View style={styles.centerIcon}>
            <Text style={styles.aiEmoji}>🤖</Text>
          </View>
        </View>

        {/* Processing Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.primaryMessage}>
            {messages[currentMessage]}
          </Text>
          <Text style={styles.subMessage}>
            Our AI is analyzing your skin in detail
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: progressWidth }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>Processing...</Text>
        </View>

        {/* Fun Facts */}
        <View style={styles.factsContainer}>
          <Text style={styles.factTitle}>💡 Did you know?</Text>
          <Text style={styles.factText}>
            Our AI analyzes over 15 different skin metrics to give you personalized insights
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
  },
  animationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulseCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accentPalette[2],
    opacity: 0.2,
  },
  scannerRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: colors.accentPalette[2],
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  centerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aiEmoji: {
    fontSize: 40,
  },
  messageContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.m,
  },
  primaryMessage: {
    fontSize: typography.fontSizes.headingL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  subMessage: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.s,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accentPalette[2],
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
  },
  factsContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.m,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: '90%',
  },
  factTitle: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  factText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.caption,
  },
}); 