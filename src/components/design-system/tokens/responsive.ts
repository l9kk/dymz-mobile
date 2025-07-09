import { Dimensions } from 'react-native';

export const getScreenDimensions = () => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
};

export const isTablet = () => {
    const { width } = getScreenDimensions();
    return width >= 768; // iPad Mini and larger
};

export const getResponsiveValue = (phoneValue: number, tabletValue: number) => {
    return isTablet() ? tabletValue : phoneValue;
};

export const getContentWidth = () => {
    const { width } = getScreenDimensions();
    if (isTablet()) {
        // Limit content width on tablets for better readability
        return Math.min(width * 0.8, 600);
    }
    return width;
};

export const responsive = {
    // Spacing
    spacing: {
        xs: getResponsiveValue(4, 6),
        s: getResponsiveValue(8, 12),
        m: getResponsiveValue(16, 20),
        l: getResponsiveValue(24, 32),
        xl: getResponsiveValue(32, 48),
        '2xl': getResponsiveValue(48, 64),
    },

    // Typography
    fontSize: {
        small: getResponsiveValue(12, 14),
        body: getResponsiveValue(16, 18),
        title: getResponsiveValue(20, 24),
        heading: getResponsiveValue(24, 32),
        hero: getResponsiveValue(32, 40),
    },

    // Component sizing
    buttonHeight: getResponsiveValue(48, 56),
    iconSize: getResponsiveValue(24, 28),
    avatarSize: getResponsiveValue(40, 48),

    // Layout
    contentPadding: getResponsiveValue(24, 48),
    maxContentWidth: 600, // Maximum content width on tablets

    // Grid
    columns: getResponsiveValue(1, 2), // For product grids, etc.
} as const;

export type ResponsiveTokens = typeof responsive; 