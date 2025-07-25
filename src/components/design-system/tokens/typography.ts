export const typography = {
    fontFamilies: {
        display: 'System',
        body: 'System',
        primary: 'System',
        mono: 'Courier'
    },
    fontSizes: {
        displayXL: 32,
        displayL: 28,
        headingL: 24,
        headingM: 20,
        headingS: 18,
        bodyL: 18,
        body: 16,
        caption: 14,
        small: 12
    },
    fontWeights: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const
    },
    letterSpacing: {
        tight: -0.2,
        normal: 0
    },
    lineHeights: {
        tight: 1.15,
        normal: 1.35,
        relaxed: 1.5
    },
    // Complete style objects for common use cases
    displayL: {
        fontSize: 28,
        fontFamily: 'System',
        fontWeight: '400' as const,
        lineHeight: 32.2, // tight * fontSize
    },
    body: {
        fontSize: 16,
        fontFamily: 'System',
        fontWeight: '400' as const,
        lineHeight: 21.6, // normal * fontSize
    },
    caption: {
        fontSize: 14,
        fontFamily: 'System',
        fontWeight: '400' as const,
        lineHeight: 18.9, // normal * fontSize
    },
    h3: {
        fontSize: 20,
        fontFamily: 'System',
        fontWeight: '600' as const,
        lineHeight: 27, // normal * fontSize
    }
} as const;

export type TypographyTokens = typeof typography; 