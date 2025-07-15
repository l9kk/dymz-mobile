import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../stores/authStore';

interface DailyCompletionState {
    morningCompletedToday: boolean;
    eveningCompletedToday: boolean;
    lastMorningCompletion: string | null;
    lastEveningCompletion: string | null;
    lastResetDate: string; // Track when we last reset for proper daily cycles
}

const STORAGE_KEY_PREFIX = '@daily_completion_status';

export const useDailyCompletion = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [dailyStatus, setDailyStatus] = useState<DailyCompletionState>({
        morningCompletedToday: false,
        eveningCompletedToday: false,
        lastMorningCompletion: null,
        lastEveningCompletion: null,
        lastResetDate: getTodayDateString(),
    });

    // Get user-specific storage key
    const getStorageKey = useCallback(() => {
        if (!user?.id) return null;
        return `${STORAGE_KEY_PREFIX}_${user.id}`;
    }, [user?.id]);

    // Get today's date string in a consistent format (handles timezone issues)
    function getTodayDateString(): string {
        const now = new Date();
        // Use local date to avoid timezone issues
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    // Check if a date string is today
    const isToday = useCallback((dateString: string | null): boolean => {
        if (!dateString) return false;
        const today = getTodayDateString();

        // Handle both ISO strings and regular date strings
        let dateOnly: string;
        if (dateString.includes('T')) {
            // For ISO strings, convert to local date to match getTodayDateString behavior
            const date = new Date(dateString);
            dateOnly = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        } else {
            // For regular date strings, extract date part
            dateOnly = dateString.split(' ')[0] || dateString;
        }

        const result = dateOnly === today;
        return result;
    }, []);

    // Load daily status with automatic reset check
    const loadDailyStatus = useCallback(async () => {
        const storageKey = getStorageKey();
        if (!storageKey || !isAuthenticated) {
            // Reset to default if no user
            setDailyStatus({
                morningCompletedToday: false,
                eveningCompletedToday: false,
                lastMorningCompletion: null,
                lastEveningCompletion: null,
                lastResetDate: getTodayDateString(),
            });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const stored = await AsyncStorage.getItem(storageKey);
            const today = getTodayDateString();

            if (stored) {
                const parsedStatus: DailyCompletionState = JSON.parse(stored);

                // Check if we need to reset for a new day
                const needsReset = !parsedStatus.lastResetDate || parsedStatus.lastResetDate !== today;

                if (needsReset) {
                    // It's a new day, reset completion status
                    const resetStatus: DailyCompletionState = {
                        morningCompletedToday: false,
                        eveningCompletedToday: false,
                        lastMorningCompletion: parsedStatus.lastMorningCompletion, // Keep for history
                        lastEveningCompletion: parsedStatus.lastEveningCompletion, // Keep for history
                        lastResetDate: today,
                    };

                    setDailyStatus(resetStatus);
                    await AsyncStorage.setItem(storageKey, JSON.stringify(resetStatus));
                    console.log('✅ Daily routine status reset for new day:', today);
                } else {
                    // Same day, check if completions are from today
                    const morningIsToday = isToday(parsedStatus.lastMorningCompletion);
                    const eveningIsToday = isToday(parsedStatus.lastEveningCompletion);

                    const finalStatus = {
                        ...parsedStatus,
                        morningCompletedToday: morningIsToday,
                        eveningCompletedToday: eveningIsToday,
                        lastResetDate: today, // Ensure reset date is updated
                    };

                    setDailyStatus(finalStatus);
                }
            } else {
                // No stored data, start fresh
                const initialStatus: DailyCompletionState = {
                    morningCompletedToday: false,
                    eveningCompletedToday: false,
                    lastMorningCompletion: null,
                    lastEveningCompletion: null,
                    lastResetDate: today,
                };

                setDailyStatus(initialStatus);
                await AsyncStorage.setItem(storageKey, JSON.stringify(initialStatus));
            }
        } catch (error) {
            console.error('Error loading daily completion status:', error);
            // Reset to default on error
            setDailyStatus({
                morningCompletedToday: false,
                eveningCompletedToday: false,
                lastMorningCompletion: null,
                lastEveningCompletion: null,
                lastResetDate: getTodayDateString(),
            });
        } finally {
            setIsLoading(false);
        }
    }, [getStorageKey, isAuthenticated, isToday]);

    // Mark routine as completed
    const markRoutineCompleted = useCallback(async (routineType: 'morning' | 'evening') => {
        const storageKey = getStorageKey();
        if (!storageKey || !isAuthenticated) {
            console.warn('Cannot mark routine completed: not authenticated or no storage key');
            return false;
        }

        // Use local timezone for consistency with getTodayDateString
        const now = new Date();
        const localISOString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
        const today = getTodayDateString();

        try {
            const newStatus: DailyCompletionState = {
                ...dailyStatus,
                lastResetDate: today,
                ...(routineType === 'morning'
                    ? {
                        morningCompletedToday: true,
                        lastMorningCompletion: localISOString,
                    }
                    : {
                        eveningCompletedToday: true,
                        lastEveningCompletion: localISOString,
                    }
                ),
            };

            setDailyStatus(newStatus);
            await AsyncStorage.setItem(storageKey, JSON.stringify(newStatus));

            console.log(`✅ ${routineType} routine marked completed for today`);
            return true;
        } catch (error) {
            console.error('Error saving completion status:', error);
            return false;
        }
    }, [getStorageKey, isAuthenticated, dailyStatus]);

    // Reset daily status (for testing or manual reset)
    const resetDailyStatus = useCallback(async () => {
        const storageKey = getStorageKey();
        if (!storageKey) return;

        const newStatus: DailyCompletionState = {
            morningCompletedToday: false,
            eveningCompletedToday: false,
            lastMorningCompletion: null,
            lastEveningCompletion: null,
            lastResetDate: getTodayDateString(),
        };

        setDailyStatus(newStatus);
        await AsyncStorage.setItem(storageKey, JSON.stringify(newStatus));
        console.log('🔄 Daily routine status manually reset');
    }, [getStorageKey]);

    // Clear current user's data (for sign out)
    const clearUserData = useCallback(async () => {
        const storageKey = getStorageKey();
        if (!storageKey) return;

        try {
            await AsyncStorage.removeItem(storageKey);
            setDailyStatus({
                morningCompletedToday: false,
                eveningCompletedToday: false,
                lastMorningCompletion: null,
                lastEveningCompletion: null,
                lastResetDate: getTodayDateString(),
            });
            console.log('🗑️ User routine completion data cleared');
        } catch (error) {
            console.error('Error clearing user routine data:', error);
        }
    }, [getStorageKey]);

    // Clear all routine completion data (for complete app reset)
    const clearAllData = useCallback(async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const routineKeys = keys.filter(key => key.startsWith(STORAGE_KEY_PREFIX));

            if (routineKeys.length > 0) {
                await AsyncStorage.multiRemove(routineKeys);
                console.log('🗑️ All routine completion data cleared');
            }

            setDailyStatus({
                morningCompletedToday: false,
                eveningCompletedToday: false,
                lastMorningCompletion: null,
                lastEveningCompletion: null,
                lastResetDate: getTodayDateString(),
            });
        } catch (error) {
            console.error('Error clearing all routine data:', error);
        }
    }, []);

    // Check if routine is completed today
    const isRoutineCompletedToday = useCallback((routineType: 'morning' | 'evening') => {
        const result = routineType === 'morning'
            ? dailyStatus.morningCompletedToday
            : dailyStatus.eveningCompletedToday;

        return result;
    }, [dailyStatus]);

    // Check if both routines are completed today
    const bothRoutinesCompletedToday = useCallback(() => {
        return dailyStatus.morningCompletedToday && dailyStatus.eveningCompletedToday;
    }, [dailyStatus]);

    // Load status when component mounts or user changes
    useEffect(() => {
        loadDailyStatus();
    }, [loadDailyStatus]);

    // Set up interval to check for day changes (runs every minute)
    useEffect(() => {
        const checkForDayChange = () => {
            const today = getTodayDateString();
            if (dailyStatus.lastResetDate !== today) {
                console.log('📅 Day changed detected, reloading routine status');
                loadDailyStatus();
            }
        };

        // Check every minute for day changes
        const interval = setInterval(checkForDayChange, 60000);

        return () => clearInterval(interval);
    }, [dailyStatus.lastResetDate, loadDailyStatus]);

    return {
        dailyStatus,
        isLoading,
        isRoutineCompletedToday,
        markRoutineCompleted,
        bothRoutinesCompletedToday,
        resetDailyStatus,
        clearUserData,     // Call on sign out
        clearAllData,      // Call on account deletion
        loadDailyStatus,   // For manual refresh
    };
}; 