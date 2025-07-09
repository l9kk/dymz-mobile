import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { 
  SectionHeading, 
  PrimaryButton 
} from '../design-system/atoms';
import { colors, spacing } from '../design-system/tokens';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface SuccessSkinIssuesProps {
  onContinue?: () => void;
}

export const SuccessSkinIssues: React.FC<SuccessSkinIssuesProps> = ({
  onContinue,
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
        <View style={styles.centerContent}>
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
          
          <SectionHeading>
            Your skin issues
          </SectionHeading>
          
          <Text style={styles.subtitle}>
            We're analyzing your concerns now! 👀{'\n'}
            Get ready for personalized insights about your skin.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton 
            title="Continue"
            onPress={onContinue}
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
    paddingVertical: spacing.l,
  },
  centerContent: {
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
  headline: {
    marginBottom: spacing.l,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  buttonContainer: {
    marginTop: 'auto',
  },
}); 