import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { colors, typography, spacing } from '../design-system/tokens';

interface ProcessingAnalysisProps {
  onComplete?: () => void;
  duration?: number; // Duration in milliseconds, default 3000
}

export const ProcessingAnalysis: React.FC<ProcessingAnalysisProps> = ({
  onComplete,
  duration = 3000
}) => {
  const { t } = useTranslation();
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotationAnim] = useState(new Animated.Value(0));
  const [progressAnim] = useState(new Animated.Value(0));
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    t('analysis.processingScreen.messages.analyzing'),
    t('analysis.processingScreen.messages.detecting'),
    t('analysis.processingScreen.messages.processing'),
    t('analysis.processingScreen.messages.almostReady')
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
      console.log('🎬 ProcessingAnalysis animation completed, calling onComplete');
      if (onComplete) {
        onComplete();
      } else {
        console.warn('⚠️ ProcessingAnalysis: onComplete callback is undefined!');
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
          {/* Background Glow Effect */}
          <Animated.View 
            style={[
              styles.glowEffect,
              {
                transform: [{ scale: pulseAnim }],
              }
            ]} 
          />
          
          {/* Scanning Rings */}
          <Animated.View 
            style={[
              styles.outerRing,
              {
                transform: [{ rotate: spin }],
              }
            ]} 
          />
          
          <Animated.View 
            style={[
              styles.innerRing,
              {
                transform: [{ rotate: spin }],
                opacity: progressAnim,
              }
            ]} 
          />
          
          {/* Center Analysis Icon */}
          <View style={styles.centerContainer}>
            <View style={styles.centerIcon}>
              {/* Face/Skin Analysis Icon */}
              <View style={styles.faceOutline}>
                <View style={styles.faceFeatures}>
                  <View style={styles.scanLine} />
                  <View style={[styles.scanLine, { top: 20 }]} />
                  <View style={[styles.scanLine, { top: 40 }]} />
                </View>
              </View>
            </View>
            
            {/* Scanning Indicator */}
            <Animated.View 
              style={[
                styles.scanIndicator,
                {
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.2],
                    outputRange: [0.3, 1],
                  }),
                }
              ]}
            />
          </View>
        </View>

        {/* Processing Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.primaryMessage}>
            {messages[currentMessage]}
          </Text>
          <Text style={styles.subMessage}>
            {t('analysis.processingScreen.subtitle')}
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
          <Text style={styles.progressText}>{t('analysis.processingScreen.progress')}</Text>
        </View>

        {/* Fun Facts */}
        <View style={styles.factsContainer}>
          <Text style={styles.factTitle}>{t('analysis.processingScreen.factTitle')}</Text>
          <Text style={styles.factText}>
            {t('analysis.processingScreen.factText')}
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
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.accentPalette[2],
    opacity: 0.1,
  },
  outerRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: colors.accentPalette[2],
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    opacity: 0.6,
  },
  innerRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: colors.accentPalette[2],
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  centerContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: colors.accentPalette[2],
    borderStyle: 'solid',
  },
  faceOutline: {
    width: 60,
    height: 75,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.accentPalette[2],
    position: 'relative',
    backgroundColor: 'transparent',
  },
  faceFeatures: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanLine: {
    position: 'absolute',
    width: 40,
    height: 2,
    backgroundColor: colors.accentPalette[2],
    borderRadius: 1,
    top: 10,
  },
  scanIndicator: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.backgroundPrimary,
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
    height: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accentPalette[2],
    borderRadius: 4,
    shadowColor: colors.accentPalette[2],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  progressText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  factsContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.l,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: '90%',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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