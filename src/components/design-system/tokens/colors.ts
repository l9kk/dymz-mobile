export const colors = {
    backgroundPrimary: '#FFF9F3',
    backgroundSecondary: '#F5F5F5',
    backgroundTertiary: '#E8E8E8',
    surfaceNeutral: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceNeutralTint: '#FBEFEC',
    textPrimary: '#5C5243',
    textSecondary: 'rgba(92, 82, 67, 0.6)',
    textOnDark: '#FFFFFF',
    ctaBackground: '#5C5243',
    ctaText: '#FFFFFF',

    // Primary colors
    primary: '#5C5243',
    brandPrimary: '#5C5243',
    secondary: '#F4A556',
    accent: '#F5CA31',

    // Status colors
    success: '#6AC47E',
    successBackground: '#6AC47E',
    error: '#E74C3C',
    errorBackground: '#E74C3C',
    warning: '#F39C12',
    info: '#3498DB',

    // UI colors
    border: '#E8E8E8',
    borderPrimary: '#E8E8E8',
    divider: '#F0F0F0',

    // Accent colors for specific use cases
    accentYellow: '#F5CA31',
    accentGreen: '#6AC47E',
    accentBlue: '#3498DB',

    accentPalette: [
        '#F5CA31',
        '#F8DB87',
        '#F4A556',
        '#14B8A6', // Teal to complement warm color scheme
        '#6AC47E'
    ],

    // Highlight colors for routine building
    highlightYellow: '#FFE7A0',
    highlightLavender: '#B2F5EA', // Light teal to complement warm color scheme
    routineTag: '#C7E7C6',

    // Insights dashboard colors
    insightRingFill: '#F4A556',
    trendChartStroke: '#F4A556'
} as const;

export type ColorTokens = typeof colors; 