/**
 * Analysis Timer Utilities
 * Handles analysis cooldown logic that resets at midnight local time
 */

/**
 * Check if an analysis was taken today (same calendar day in local timezone)
 */
export function isAnalysisTakenToday(analysisTimestamp: string): boolean {
    try {
        const analysisDate = new Date(analysisTimestamp);
        const today = new Date();

        // Compare year, month, and day in local timezone
        return (
            analysisDate.getFullYear() === today.getFullYear() &&
            analysisDate.getMonth() === today.getMonth() &&
            analysisDate.getDate() === today.getDate()
        );
    } catch (error) {
        console.warn('Error parsing analysis timestamp:', error);
        return false;
    }
}

/**
 * Calculate time remaining until next midnight in local timezone
 */
export function getTimeUntilMidnight(): {
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
} {
    const now = new Date();
    const tomorrow = new Date(now);

    // Set to next midnight in local timezone
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diffMs = tomorrow.getTime() - now.getTime();

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return {
        hours,
        minutes,
        seconds,
        totalMs: diffMs
    };
}

/**
 * Format countdown time for display
 */
export function formatTimeUntilMidnight(): string {
    const timeUntil = getTimeUntilMidnight();

    if (timeUntil.totalMs <= 0) {
        return 'Ready now!';
    }

    // If less than 1 hour, show minutes
    if (timeUntil.hours === 0) {
        return `${timeUntil.minutes}m`;
    }

    // Otherwise show hours and minutes
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    return `${pad(timeUntil.hours)}:${pad(timeUntil.minutes)}`;
}

/**
 * Check if analysis is available (not taken today)
 */
export function isAnalysisAvailable(lastAnalysisTimestamp?: string): boolean {
    if (!lastAnalysisTimestamp) {
        return true; // No previous analysis, so available
    }

    return !isAnalysisTakenToday(lastAnalysisTimestamp);
}

/**
 * Get human-readable status for analysis availability
 */
export function getAnalysisAvailabilityStatus(lastAnalysisTimestamp?: string): {
    isAvailable: boolean;
    message: string;
    timeUntilNext: string;
} {
    const isAvailable = isAnalysisAvailable(lastAnalysisTimestamp);

    if (isAvailable) {
        return {
            isAvailable: true,
            message: 'Ready for your next analysis',
            timeUntilNext: 'Ready now!'
        };
    }

    const timeUntilNext = formatTimeUntilMidnight();

    return {
        isAvailable: false,
        message: 'Analysis available tomorrow',
        timeUntilNext: timeUntilNext === 'Ready now!' ? 'Ready now!' : `Available in ${timeUntilNext}`
    };
} 