import { Animated, InteractionManager } from 'react-native';
import { animations, animationPresets } from '../components/design-system/tokens';

/**
 * Animation utilities for creating smooth, iOS-style interactions
 * Based on React Native performance best practices
 */

export interface AnimationSequenceItem {
    animation: Animated.CompositeAnimation;
    delay?: number;
}

/**
 * Creates a staggered animation sequence with proper delays
 * Useful for revealing multiple elements smoothly
 */
export const createStaggeredAnimation = (
    animatedValues: Animated.Value[],
    config: {
        stagger?: number;
        animation?: 'fadeIn' | 'slideUp' | 'scaleIn';
        duration?: number;
    } = {}
): Animated.CompositeAnimation => {
    const {
        stagger = animations.stagger.comfortable,
        animation = 'fadeIn',
        duration = animations.timing.quick,
    } = config;

    const animationConfigs = {
        fadeIn: (value: Animated.Value) =>
            Animated.timing(value, {
                toValue: 1,
                duration,
                easing: animations.easing.gentle,
                useNativeDriver: true,
            }),
        slideUp: (value: Animated.Value) =>
            Animated.timing(value, {
                toValue: 0,
                duration,
                easing: animations.easing.emphasized,
                useNativeDriver: true,
            }),
        scaleIn: (value: Animated.Value) =>
            Animated.spring(value, {
                toValue: 1,
                ...animations.spring.gentle,
            }),
    };

    return Animated.stagger(
        stagger,
        animatedValues.map(value => animationConfigs[animation](value))
    );
};

/**
 * Creates a smooth entrance animation for components
 * Combines opacity, scale, and translate for polished feel
 */
export const createEntranceAnimation = (
    opacity: Animated.Value,
    scale: Animated.Value,
    translateY?: Animated.Value
): Animated.CompositeAnimation => {
    const animations_list: Animated.CompositeAnimation[] = [
        Animated.timing(opacity, {
            toValue: 1,
            ...animationPresets.fadeIn,
            duration: animations.timing.instant,
        }),
        Animated.spring(scale, {
            toValue: 1,
            ...animations.spring.gentle,
        }),
    ];

    if (translateY) {
        animations_list.push(
            Animated.spring(translateY, {
                toValue: 0,
                ...animations.spring.soft,
            })
        );
    }

    return Animated.parallel(animations_list);
};

/**
 * Creates a smooth exit animation for components
 */
export const createExitAnimation = (
    opacity: Animated.Value,
    scale: Animated.Value,
    translateY?: Animated.Value
): Animated.CompositeAnimation => {
    const animations_list: Animated.CompositeAnimation[] = [
        Animated.timing(opacity, {
            toValue: 0,
            ...animationPresets.fadeOut,
        }),
        Animated.timing(scale, {
            toValue: 0.9,
            ...animationPresets.scaleOut,
        }),
    ];

    if (translateY) {
        animations_list.push(
            Animated.timing(translateY, {
                toValue: 10,
                duration: animations.timing.quick,
                easing: animations.easing.standard,
                useNativeDriver: true,
            })
        );
    }

    return Animated.parallel(animations_list);
};

/**
 * Creates a button press animation with haptic-like feedback
 */
export const createButtonPressAnimation = (
    scale: Animated.Value,
    onComplete?: () => void
): Animated.CompositeAnimation => {
    return Animated.sequence([
        Animated.spring(scale, {
            toValue: animations.scale.tap,
            ...animations.spring.responsive,
            tension: 200,
        }),
        Animated.spring(scale, {
            toValue: 1,
            ...animations.spring.bouncy,
        }),
    ]);
};

/**
 * Runs an animation with InteractionManager for smooth performance
 * Use this for animations that might interfere with UI updates
 */
export const runSmoothAnimation = (
    animation: Animated.CompositeAnimation,
    onComplete?: () => void
): (() => void) => {
    const interaction = InteractionManager.runAfterInteractions(() => {
        animation.start(onComplete);
    });

    return () => interaction.cancel();
};

/**
 * Creates a smooth loading animation (for future use)
 */
export const createLoadingAnimation = (
    rotation: Animated.Value
): Animated.CompositeAnimation => {
    return Animated.loop(
        Animated.timing(rotation, {
            toValue: 1,
            duration: 1000,
            easing: animations.easing.standard,
            useNativeDriver: true,
        })
    );
};

/**
 * Creates a pulse animation for highlighting elements
 */
export const createPulseAnimation = (
    scale: Animated.Value,
    pulseCount: number = 3
): Animated.CompositeAnimation => {
    const pulseSequence = Array.from({ length: pulseCount }, () => [
        Animated.spring(scale, {
            toValue: animations.scale.pop,
            ...animations.spring.bouncy,
        }),
        Animated.spring(scale, {
            toValue: 1,
            ...animations.spring.gentle,
        }),
    ]).flat();

    return Animated.sequence(pulseSequence);
};

/**
 * Default animation values for common use cases
 */
export const defaultAnimationValues = {
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0),
    translateY: new Animated.Value(20),
    translateX: new Animated.Value(0),
    rotation: new Animated.Value(0),
}; 