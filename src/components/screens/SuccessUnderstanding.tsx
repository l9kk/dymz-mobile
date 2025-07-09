import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, Easing } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { 
  PrimaryButton
} from '../design-system';
import { colors, typography, spacing } from '../design-system/tokens';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SuccessUnderstandingProps {
  onContinue?: () => void;
}

export const SuccessUnderstanding: React.FC<SuccessUnderstandingProps> = ({
  onContinue
}) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
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

          <Text style={styles.title}>
            We're getting to{'\n'}know you!
          </Text>

          <Text style={styles.subtitle}>
            Your personalized analysis is almost ready
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <PrimaryButton
            title="Continue"
            onPress={onContinue}
            style={styles.continueButton}
          />
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
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    width: 120,
    height: 120,
    marginBottom: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.l,
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
  },
  subtitle: {
    fontSize: typography.fontSizes.bodyL,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.bodyL,
    paddingHorizontal: spacing.m,
  },
  buttonSection: {
    paddingBottom: spacing.l,
  },
  continueButton: {
    width: '100%',
  },
}); 