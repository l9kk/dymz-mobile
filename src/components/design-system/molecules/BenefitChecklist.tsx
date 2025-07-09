import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, typography, spacing } from '../tokens';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Benefit {
  id: string;
  text: string;
  type: 'check' | 'star'; // check for normal benefits, star for highlights
}

interface BenefitChecklistProps {
  benefits: Benefit[];
  style?: any;
  staggerDelay?: number;
}

interface AnimatedCheckmarkProps {
  type: 'check' | 'star';
  animationDelay: number;
}

const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({ type, animationDelay }) => {
  const checkmarkProgress = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 8,
        }),
        Animated.timing(checkmarkProgress, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
    }, animationDelay);

    return () => clearTimeout(timeout);
  }, [animationDelay]);

  if (type === 'star') {
    return (
      <Animated.Text
        style={[
          styles.icon,
          { 
            color: '#F5CA31',
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        ⭐
      </Animated.Text>
    );
  }

  const checkmarkPath = "M4 10 L8 14 L16 6";
  const pathLength = 18;

  const animatedStrokeDashoffset = checkmarkProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [pathLength, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.checkmarkContainer,
        {
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <Svg width="20" height="20" viewBox="0 0 20 20">
        <AnimatedPath
          d={checkmarkPath}
          stroke="#6AC47E"
          strokeWidth="2.5"
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

export const BenefitChecklist: React.FC<BenefitChecklistProps> = ({
  benefits,
  style,
  staggerDelay = 150
}) => {
  return (
    <View style={[styles.container, style]}>
      {benefits.map((benefit, index) => (
        <View key={benefit.id} style={styles.benefitItem}>
          <AnimatedCheckmark 
            type={benefit.type}
            animationDelay={index * staggerDelay + 300}
          />
          <Text style={styles.text}>{benefit.text}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.s,
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    marginRight: spacing.s,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: spacing.s,
    marginTop: 2, // Align with text baseline
    fontWeight: 'bold',
  },
  text: {
    flex: 1,
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textPrimary,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
  },
}); 