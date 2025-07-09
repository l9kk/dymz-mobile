import { Easing } from 'react-native';

/**
 * Animation constants based on iOS Human Interface Guidelines
 * for smooth, polished interactions
 */
export const animations = {
    // iOS-standard timing values
    timing: {
        instant: 150,       // Quick feedback (button press)
        quick: 250,         // Standard transitions
        moderate: 350,      // Card presentations
        slow: 500,          // Full screen transitions
        slowest: 750,       // Complex sequences
    },

    // iOS-style easing curves
    easing: {
        // Primary curve - gentle ease-out (most common)
        standard: Easing.bezier(0.4, 0.0, 0.2, 1),

        // Emphasized curve - pronounced ease-out
        emphasized: Easing.bezier(0.0, 0.0, 0.2, 1),

        // Decelerated curve - stronger ease-out  
        decelerated: Easing.bezier(0.0, 0.0, 0.2, 1),

        // Gentle spring-like curve
        gentle: Easing.bezier(0.25, 0.1, 0.25, 1),

        // Sharp but smooth
        sharp: Easing.bezier(0.4, 0.0, 0.6, 1),
    },

    // Spring configurations for natural movement
    spring: {
        gentle: {
            tension: 120,
            friction: 14,
            useNativeDriver: true,
        },

        bouncy: {
            tension: 150,
            friction: 8,
            useNativeDriver: true,
        },

        soft: {
            tension: 100,
            friction: 12,
            useNativeDriver: true,
        },

        responsive: {
            tension: 180,
            friction: 12,
            useNativeDriver: true,
        },
    },

    // Common scale values for interactive elements
    scale: {
        press: 0.96,        // Button press feedback
        tap: 0.94,          // Stronger tap feedback
        lift: 1.02,         // Hover/focus state
        pop: 1.05,          // Attention-grabbing
    },

    // Opacity values for state changes
    opacity: {
        invisible: 0,
        disabled: 0.4,
        secondary: 0.6,
        primary: 0.85,
        full: 1,
    },

    // Stagger delays for sequence animations
    stagger: {
        tight: 50,          // Quick succession
        comfortable: 100,   // Standard stagger
        spacious: 150,      // Slower reveal
        dramatic: 200,      // Maximum impact
    },
};

/**
 * Common animation presets for consistent usage
 */
export const animationPresets = {
    // Button press feedback
    buttonPress: {
        duration: animations.timing.instant,
        easing: animations.easing.sharp,
        useNativeDriver: true,
    },

    // Screen transitions
    screenTransition: {
        duration: animations.timing.moderate,
        easing: animations.easing.standard,
        useNativeDriver: true,
    },

    // Fade animations
    fadeIn: {
        duration: animations.timing.quick,
        easing: animations.easing.gentle,
        useNativeDriver: true,
    },

    fadeOut: {
        duration: animations.timing.quick,
        easing: animations.easing.standard,
        useNativeDriver: true,
    },

    // Slide animations
    slideIn: {
        duration: animations.timing.moderate,
        easing: animations.easing.emphasized,
        useNativeDriver: true,
    },

    slideOut: {
        duration: animations.timing.quick,
        easing: animations.easing.standard,
        useNativeDriver: true,
    },

    // Scale animations
    scaleIn: {
        duration: animations.timing.quick,
        easing: animations.easing.gentle,
        useNativeDriver: true,
    },

    scaleOut: {
        duration: animations.timing.instant,
        easing: animations.easing.sharp,
        useNativeDriver: true,
    },

    // Drawing/stroke animations (cannot use native driver)
    draw: {
        duration: animations.timing.slow,
        easing: animations.easing.decelerated,
        useNativeDriver: false, // Required for stroke animations
    },
}; 