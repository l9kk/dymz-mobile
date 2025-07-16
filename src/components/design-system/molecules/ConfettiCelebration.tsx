import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography } from '../tokens';

interface StreakCelebrationProps {
  visible: boolean;
  currentStreak: number;
  previousStreak?: number;
  message?: string;
  onComplete?: () => void;
}

interface ParticleProps {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
  type: 'star' | 'fire' | 'circle' | 'streak';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const streakColors = [
  '#FFD700', // Gold
  '#FF6B35', // Orange-red
  '#FF4757', // Red
  '#FFA502', // Orange
  '#F39C12', // Yellow-orange
  '#E74C3C', // Red
  '#FF9FF3', // Pink
  '#54A0FF', // Blue
];

const getStreakEmoji = (streak: number): string => {
  if (streak >= 30) return '🏆';
  if (streak >= 21) return '💎';
  if (streak >= 14) return '⭐';
  if (streak >= 7) return '🔥';
  if (streak >= 3) return '✨';
  return '🎉';
};

const getStreakMessage = (streak: number): string => {
  if (streak === 1) return 'Great Start!';
  if (streak >= 30) return 'Legendary Streak!';
  if (streak >= 21) return 'Incredible Streak!';
  if (streak >= 14) return 'Amazing Streak!';
  if (streak >= 7) return 'On Fire!';
  if (streak >= 3) return 'Building Momentum!';
  return 'Keep Going!';
};

export const ConfettiCelebration: React.FC<StreakCelebrationProps> = ({
  visible,
  currentStreak,
  previousStreak = 0,
  message,
  onComplete,
}) => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayStreak, setDisplayStreak] = useState(previousStreak);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const streakCountAnim = useRef(new Animated.Value(previousStreak)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  // Refs for cleanup
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const listenerIdRef = useRef<string | null>(null);
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);
  const vibrationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    if (listenerIdRef.current) {
      streakCountAnim.removeListener(listenerIdRef.current);
      listenerIdRef.current = null;
    }
    
    // Clear all vibration timeouts
    vibrationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    vibrationTimeoutsRef.current = [];
    
    // Stop all running animations
    animationsRef.current.forEach(animation => {
      animation.stop();
    });
    animationsRef.current = [];
    
    setIsAnimating(false);
    setParticles([]);
  }, [streakCountAnim]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Vibration helper functions
  const scheduleVibration = useCallback((type: Haptics.ImpactFeedbackStyle, delay: number = 0) => {
    const timeout = setTimeout(() => {
      Haptics.impactAsync(type);
    }, delay);
    vibrationTimeoutsRef.current.push(timeout);
  }, []);

  const createPulseVibrationPattern = useCallback(() => {
    // Create a pulsing vibration pattern that matches the badge pulse
    const pulseInterval = 1600; // 800ms up + 800ms down
    const maxPulses = 3; // Limit to avoid overwhelming the user
    
    for (let i = 0; i < maxPulses; i++) {
      scheduleVibration(Haptics.ImpactFeedbackStyle.Light, 800 + (i * pulseInterval));
    }
  }, [scheduleVibration]);

  const createCountUpVibrationPattern = useCallback((duration: number) => {
    // Create subtle vibrations during count-up animation
    const vibrationCount = Math.min(currentStreak - previousStreak, 5); // Limit to avoid spam
    const interval = duration / vibrationCount;
    
    for (let i = 0; i < vibrationCount; i++) {
      scheduleVibration(Haptics.ImpactFeedbackStyle.Light, i * interval);
    }
  }, [currentStreak, previousStreak, scheduleVibration]);

  const createParticleExplosionVibration = useCallback(() => {
    // Create a burst of light vibrations for particle explosion
    const particleVibrations = [0, 100, 200, 300, 500]; // Staggered timing
    particleVibrations.forEach(delay => {
      scheduleVibration(Haptics.ImpactFeedbackStyle.Light, delay);
    });
  }, [scheduleVibration]);

  useEffect(() => {
    if (visible && !isAnimating) {
      setIsAnimating(true);
      setDisplayStreak(previousStreak);
      
      // Create optimized particle system (reduced count for performance)
      const newParticles: ParticleProps[] = [];
      const particleCount = Math.min(25, 15 + currentStreak);
      
      for (let i = 0; i < particleCount; i++) {
        const particleTypes: ('star' | 'fire' | 'circle' | 'streak')[] = ['star', 'fire', 'circle', 'streak'];
        newParticles.push({
          id: i,
          x: new Animated.Value(screenWidth * 0.5 + (Math.random() - 0.5) * 100),
          y: new Animated.Value(screenHeight * 0.5 + (Math.random() - 0.5) * 100),
          rotation: new Animated.Value(0),
          scale: new Animated.Value(0),
          opacity: new Animated.Value(1),
          color: streakColors[Math.floor(Math.random() * streakColors.length)],
          type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
        });
      }
      setParticles(newParticles);

      // Reset animation values
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.3);
      streakCountAnim.setValue(previousStreak);
      pulseAnim.setValue(1);
      glowAnim.setValue(0);

      // Main entrance animation sequence with vibration
      const entranceAnimation = Animated.sequence([
        // 1. Fade in background
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // 2. Scale in badge with bounce
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 4,
          useNativeDriver: true,
        }),
        // 3. Glow effect
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]);

      // Start entrance vibration
      scheduleVibration(Haptics.ImpactFeedbackStyle.Medium, 0); // Immediate impact
      scheduleVibration(Haptics.ImpactFeedbackStyle.Light, 300); // On bounce

      animationsRef.current.push(entranceAnimation);
      entranceAnimation.start();

      // Count up animation for streak number with proper cleanup
      const countAnimation = Animated.timing(streakCountAnim, {
        toValue: currentStreak,
        duration: 1000,
        useNativeDriver: false,
      });

      // Add listener with proper cleanup tracking
      listenerIdRef.current = streakCountAnim.addListener(({ value }) => {
        setDisplayStreak(Math.round(value));
      });

      // Start count-up vibration pattern
      createCountUpVibrationPattern(1000);

      animationsRef.current.push(countAnimation);
      countAnimation.start();

      // Pulse animation for streak badge
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      // Start pulse vibration pattern
      createPulseVibrationPattern();

      animationsRef.current.push(pulseAnimation);
      pulseAnimation.start();

      // Particle explosion animation
      const particleAnimations = newParticles.map((particle, index) => {
        const delay = index * 15; // Slightly faster particle timing
        const endX = screenWidth * 0.5 + (Math.random() - 0.5) * screenWidth;
        const endY = screenHeight * 0.3 + Math.random() * screenHeight * 0.4;
        
        return Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            // Scale in
            Animated.spring(particle.scale, {
              toValue: 0.8 + Math.random() * 0.4,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
            // Move to position
            Animated.timing(particle.x, {
              toValue: endX,
              duration: 1500, // Slightly faster for better performance
              useNativeDriver: true,
            }),
            Animated.timing(particle.y, {
              toValue: endY,
              duration: 1500,
              useNativeDriver: true,
            }),
            // Rotate
            Animated.timing(particle.rotation, {
              toValue: 360 * (2 + Math.random() * 2),
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          // Fade out
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]);
      });

      const allParticleAnimations = Animated.parallel(particleAnimations);
      
      // Start particle explosion vibration
      createParticleExplosionVibration();
      
      animationsRef.current.push(allParticleAnimations);
      allParticleAnimations.start();

      // Auto complete with proper cleanup
      animationTimeoutRef.current = setTimeout(() => {
        // Final completion vibration
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 2200); // Slightly shorter duration

    } else if (!visible && isAnimating) {
      // Exit animation with subtle vibration
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const exitAnimation = Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);

      animationsRef.current.push(exitAnimation);
      exitAnimation.start(() => {
        cleanup();
      });
    }

    // Cleanup on dependency change
    return () => {
      if (!visible && isAnimating) {
        cleanup();
      }
    };
  }, [visible, currentStreak, previousStreak, cleanup]);

  const renderParticle = (particle: ParticleProps) => {
    const rotateInterpolate = particle.rotation.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });

    let particleContent;
    switch (particle.type) {
      case 'star':
        particleContent = <Text style={[styles.particleEmoji, { color: particle.color }]}>⭐</Text>;
        break;
      case 'fire':
        particleContent = <Text style={[styles.particleEmoji, { color: particle.color }]}>🔥</Text>;
        break;
      case 'streak':
        particleContent = <Text style={[styles.particleEmoji, { color: particle.color }]}>✨</Text>;
        break;
      default:
        particleContent = (
          <View style={[styles.particleCircle, { backgroundColor: particle.color }]} />
        );
    }

    return (
      <Animated.View
        key={particle.id}
        style={[
          styles.particle,
          {
            transform: [
              { translateX: particle.x },
              { translateY: particle.y },
              { rotate: rotateInterpolate },
              { scale: particle.scale },
            ],
            opacity: particle.opacity,
          },
        ]}
      >
        {particleContent}
      </Animated.View>
    );
  };

  if (!visible && !isAnimating) return null;

  const streakEmoji = getStreakEmoji(currentStreak);
  const streakMessage = message || getStreakMessage(currentStreak);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { opacity: fadeAnim }
      ]}
    >
      {/* Particles */}
      <View style={styles.particlesContainer}>
        {particles.map(renderParticle)}
      </View>
      
      {/* Main celebration content */}
      <Animated.View style={[
        styles.celebrationCard,
        { 
          transform: [
            { 
              scale: Animated.multiply(scaleAnim, pulseAnim)
            }
          ]
        }
      ]}>
        {/* Glow effect */}
        <Animated.View style={[
          styles.glowEffect,
          { 
            opacity: glowAnim,
            transform: [{ scale: glowAnim }]
          }
        ]} />
        
        {/* Streak badge */}
        <View style={styles.streakBadge}>
          <Text style={styles.streakEmoji}>{streakEmoji}</Text>
          <Text style={styles.streakNumber}>
            {displayStreak}
          </Text>
        </View>
        
        {/* Messages */}
        <View style={styles.messagesContainer}>
          <Text style={styles.streakLabel}>Day Streak!</Text>
          <Text style={styles.celebrationMessage}>{streakMessage}</Text>
          <Text style={styles.encouragementText}>Keep up the amazing work!</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1001,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
  },
  particleEmoji: {
    fontSize: 16,
  },
  particleCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  celebrationCard: {
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1002,
    borderWidth: 2,
    borderColor: colors.accentGreen,
  },
  glowEffect: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 44,
    backgroundColor: colors.accentGreen,
    opacity: 0.2,
  },
  streakBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accentGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.l,
    shadowColor: colors.accentGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  streakEmoji: {
    fontSize: 24,
    position: 'absolute',
    top: 8,
  },
  streakNumber: {
    fontSize: 32,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.bold,
    color: colors.textOnDark,
    marginTop: 8,
  },
  messagesContainer: {
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: typography.fontSizes.headingS,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.bold,
    color: colors.accentGreen,
    marginBottom: spacing.xs,
  },
  celebrationMessage: {
    fontSize: typography.fontSizes.headingM,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  encouragementText: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});