import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  PrimaryButton,
  spacing,
  colors,
} from '../design-system';
import { useTranslation } from '../../hooks/useTranslation';
// Temporarily commented out until useAwardPoints is implemented
// import { useAwardPoints } from '../../hooks/api/useGamification';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface SuccessMotivationsProps {
  onContinue?: () => void;
}

export const SuccessMotivations: React.FC<SuccessMotivationsProps> = ({ onContinue }) => {
  const { t } = useTranslation();
  // Award points for completing motivation assessment
  // Temporarily commented out until useAwardPoints is implemented
  // const awardPoints = useAwardPoints();
  const awardPoints = { mutate: (data: any) => {} }; // Mock for now

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation after a small delay
    const timer = setTimeout(() => {
      // Sequence: Fade in → Scale circle and keep it
      Animated.sequence([
        // First: Fade in
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        // Then: Scale in circle with bounce and keep it
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    // Award points for motivation completion (could contribute to streak progress)
    awardPoints.mutate({
      action_type: 'check_in',
      points: 50,
      metadata: {
        section: 'onboarding',
        step: 'motivation_completion'
      }
    });
    
    onContinue?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.animationContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <AnimatedSvg width={120} height={120} viewBox="0 0 120 120">
            {/* Green circle background */}
            <AnimatedCircle
              cx="60"
              cy="60"
              r="55"
              fill="#6AC47E"
              stroke="none"
            />
            {/* Static checkmark */}
            <Path
              d="M35 60 L50 75 L85 40"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </AnimatedSvg>
        </Animated.View>
        
        <Text style={styles.title}>{t('onboarding.successMotivations.title')}</Text>
        
        <Text style={styles.subtitle}>
          {t('onboarding.successMotivations.subtitle')}
        </Text>
        
        <PrimaryButton title={t('buttons.continue')} onPress={handleContinue} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
    gap: spacing.l,
  },
  animationContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.m,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.l,
  },
}); 