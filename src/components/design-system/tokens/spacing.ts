export const spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    '2xl': 48
} as const;

export const radii = {
    pill: 999,
    card: 20,
    s: 8,
    m: 12,
    l: 16
} as const;

// Alias for backward compatibility
export const borderRadius = radii;

export const elevation = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    subtle: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    }
} as const;

export type SpacingTokens = typeof spacing;
export type RadiiTokens = typeof radii;
export type ElevationTokens = typeof elevation; 