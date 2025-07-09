import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions } from 'react-native';
import { colors, spacing, typography, animations } from '../tokens';

interface ConfettiCelebrationProps {
  visible: boolean;
  message?: string;
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const confettiColors = [
  colors.accentGreen,
  colors.ctaBackground,
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light salmon
  '#98D8C8', // Mint
];

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  visible,
  message = "🎉 Routine Complete!",
  onComplete,
}) => {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const onCompleteRef = useRef(onComplete);

  // Keep the latest onComplete callback in ref
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (visible && !isAnimating) {
      // Prevent double animation
      setIsAnimating(true);
      
      // Create fewer confetti pieces for better performance
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < 30; i++) {
        pieces.push({
          id: i,
          x: new Animated.Value(Math.random() * screenWidth),
          y: new Animated.Value(-50),
          rotation: new Animated.Value(0),
          scale: new Animated.Value(0.5 + Math.random() * 0.5),
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle',
        });
      }
      setConfettiPieces(pieces);

      // Reset animation values before starting
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);

      // Smooth entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animations.timing.quick,
          easing: animations.easing.gentle,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          ...animations.spring.gentle,
        }),
      ]).start();

      // Start confetti animations
      const confettiAnimations = pieces.map((piece) => {
        return Animated.parallel([
          Animated.timing(piece.y, {
            toValue: screenHeight + 100,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotation, {
            toValue: 360 * (1 + Math.random() * 2),
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(piece.scale, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(piece.scale, {
              toValue: 0,
              duration: 300,
              delay: 1500 + Math.random() * 500,
              useNativeDriver: true,
            }),
          ]),
        ]);
      });

      Animated.parallel(confettiAnimations).start();

      // Auto complete after 2 seconds (shorter duration)
      const autoCompleteTimeout = setTimeout(() => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 2000);

      // Cleanup function to clear timeout
      return () => clearTimeout(autoCompleteTimeout);

    } else if (!visible && isAnimating) {
      // Smooth exit animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animations.timing.quick,
          easing: animations.easing.standard,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: animations.timing.quick,
          easing: animations.easing.standard,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false);
        setConfettiPieces([]);
        // Reset animation values for next time
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.8);
      });
    }
  }, [visible]);

  const renderConfettiPiece = (piece: ConfettiPiece) => {
    const rotateInterpolate = piece.rotation.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });

    let shapeStyle;
    switch (piece.shape) {
      case 'circle':
        shapeStyle = {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: piece.color,
        };
        break;
      case 'square':
        shapeStyle = {
          width: 6,
          height: 6,
          backgroundColor: piece.color,
        };
        break;
      case 'triangle':
        shapeStyle = {
          width: 0,
          height: 0,
          borderLeftWidth: 4,
          borderRightWidth: 4,
          borderBottomWidth: 7,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: piece.color,
        };
        break;
    }

    return (
      <Animated.View
        key={piece.id}
        style={[
          styles.confettiPiece,
          shapeStyle,
          {
            transform: [
              { translateX: piece.x },
              { translateY: piece.y },
              { rotate: rotateInterpolate },
              { scale: piece.scale },
            ],
          },
        ]}
      />
    );
  };

  if (!visible && !isAnimating) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      {/* Confetti Pieces */}
      <View style={styles.confettiContainer}>
        {confettiPieces.map(renderConfettiPiece)}
      </View>
      
      {/* Success Message */}
      <View style={styles.messageContainer}>
        <View style={styles.successBadge}>
          <Text style={styles.successEmoji}>✨</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.subMessage}>Keep up the great work!</Text>
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1001,
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
  },
  messageContainer: {
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1002,
  },
  successBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accentGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  successEmoji: {
    fontSize: 24,
  },
  message: {
    fontSize: typography.fontSizes.headingM,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  subMessage: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
}); 