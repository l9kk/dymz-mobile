/**
 * METRIC BOOSTING UTILITY - EASILY REMOVABLE
 * 
 * This utility provides functions to boost metric scores for better user experience.
 * Can be easily disabled by setting ENABLE_METRIC_BOOSTING to false.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Feature flag to enable/disable metric boosting globally
export const ENABLE_METRIC_BOOSTING = true; // Set to false to disable all boosting

/**
 * Boosts a single metric score according to specified rules
 * - If score < 70: set to random 70-75
 * - If score is 70-75: boost to random 80-85
 * - If score is 76-93: add random 1-6
 * 
 * @param score - Original score (0-100)
 * @returns Boosted score
 */
export const boostSingleMetric = (score: number): number => {
  if (!ENABLE_METRIC_BOOSTING) {
    return score; // Return original score if boosting is disabled
  }

  let boostedScore = score;

  if (boostedScore < 70) {
    // Set to random value between 70-75
    boostedScore = Math.floor(Math.random() * 6) + 70; // Random 70-75
  } else if (boostedScore >= 70 && boostedScore <= 75) {
    // Boost scores that are initially 70-75 to 80-85 range
    boostedScore = Math.floor(Math.random() * 6) + 80; // Random 80-85
  } else if (boostedScore >= 76 && boostedScore < 94) {
    // Add random value between 1-6 for scores 76-93
    const boost = Math.floor(Math.random() * 6) + 1; // Random 1-6
    boostedScore = Math.min(100, boostedScore + boost); // Cap at 100
  }

  return boostedScore;
};

/**
 * Saves boosted metrics for a specific analysis to AsyncStorage
 * 
 * @param analysisId - The ID of the analysis
 * @param originalMetrics - The original metrics before boosting
 * @param boostedMetrics - The boosted metrics
 */
const saveBoostedMetrics = async <T extends { score: number }>(
  analysisId: string,
  originalMetrics: T[],
  boostedMetrics: T[]
): Promise<void> => {
  try {
    const key = `boosted_metrics_${analysisId}`;
    const data = {
      originalMetrics,
      boostedMetrics,
      timestamp: Date.now()
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log(`💾 Saved boosted metrics for analysis ${analysisId}`);
  } catch (error) {
    console.error('Error saving boosted metrics:', error);
  }
};

/**
 * Loads saved boosted metrics for a specific analysis from AsyncStorage
 * 
 * @param analysisId - The ID of the analysis
 * @returns Saved boosted metrics or null if not found
 */
const loadBoostedMetrics = async <T extends { score: number }>(
  analysisId: string
): Promise<T[] | null> => {
  try {
    const key = `boosted_metrics_${analysisId}`;
    const data = await AsyncStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      console.log(`📖 Loaded saved boosted metrics for analysis ${analysisId}`);
      return parsed.boostedMetrics;
    }
    return null;
  } catch (error) {
    console.error('Error loading boosted metrics:', error);
    return null;
  }
};

/**
 * Boosts metrics with persistence - saves and loads consistent boosted metrics per analysis
 * 
 * @param metrics - Array of metric objects with score property
 * @param analysisId - The ID of the analysis to ensure consistent boosting
 * @returns Array with boosted scores (consistent per analysis)
 */
export const boostMetricsWithPersistence = async <T extends { score: number }>(
  metrics: T[],
  analysisId?: string
): Promise<T[]> => {
  if (!ENABLE_METRIC_BOOSTING) {
    console.log('🔧 Metric boosting disabled, returning original metrics');
    return metrics;
  }

  // If no analysisId provided, fall back to regular boosting
  if (!analysisId) {
    console.log('⚠️ No analysisId provided, using regular boosting');
    return boostMetrics(metrics);
  }

  // Try to load saved boosted metrics first
  const savedMetrics = await loadBoostedMetrics<T>(analysisId);
  if (savedMetrics && savedMetrics.length === metrics.length) {
    console.log('✅ Using saved boosted metrics for analysis:', analysisId);
    return savedMetrics;
  }

  // If no saved metrics, apply boosting and save
  const boostedMetrics = metrics.map(metric => ({
    ...metric,
    score: boostSingleMetric(metric.score)
  }));

  // Save the boosted metrics for future use
  await saveBoostedMetrics(analysisId, metrics, boostedMetrics);

  console.log('🚀 Applied and saved new boosted metrics for analysis:', analysisId, {
    original: metrics.map(m => ({ title: (m as any).title, score: m.score })),
    boosted: boostedMetrics.map(m => ({ title: (m as any).title, score: m.score }))
  });

  return boostedMetrics;
};

/**
 * Boosts multiple metrics at once
 * 
 * @param metrics - Array of metric objects with score property
 * @returns Array with boosted scores
 */
export const boostMetrics = <T extends { score: number }>(metrics: T[]): T[] => {
  if (!ENABLE_METRIC_BOOSTING) {
    console.log('🔧 Metric boosting disabled, returning original metrics');
    return metrics; // Return original metrics if boosting is disabled
  }

  const originalMetrics = metrics.map(m => ({ title: (m as any).title, score: m.score }));
  const boostedMetrics = metrics.map(metric => ({
    ...metric,
    score: boostSingleMetric(metric.score)
  }));
  console.log('🚀 Metric boosting applied:', {
    original: originalMetrics,
    boosted: boostedMetrics.map(m => ({ title: (m as any).title, score: m.score }))
  });

  return boostedMetrics;
};

// Test function to verify boosting logic - for development only
export const testMetricBoosting = () => {
  console.log('🧪 Testing metric boosting logic:');

  const testScores = [50, 68, 70, 72, 75, 76, 80, 85, 90, 94, 95, 100];

  testScores.forEach(score => {
    const boosted = boostSingleMetric(score);
    console.log(`Score ${score} → ${boosted} (${score < 70 ? 'below 70' : score >= 70 && score <= 75 ? '70-75 range' : score >= 76 && score < 94 ? '76-93 range' : 'no change'})`);
  });
};

/**
 * Boosts a percentage value (0-1 range)
 * 
 * @param percentage - Original percentage (0-1)
 * @returns Boosted percentage
 */
export const boostPercentage = (percentage: number): number => {
  if (!ENABLE_METRIC_BOOSTING) {
    return percentage; // Return original percentage if boosting is disabled
  }

  // Convert to 0-100 scale, boost, then convert back
  const score = percentage * 100;
  const boostedScore = boostSingleMetric(score);
  return Math.min(1, boostedScore / 100);
};

/**
 * Boosts an average score (typically 0-100)
 * 
 * @param averageScore - Original average score
 * @returns Boosted average score
 */
export const boostAverageScore = (averageScore: number): number => {
  if (!ENABLE_METRIC_BOOSTING) {
    return averageScore; // Return original score if boosting is disabled
  }

  return boostSingleMetric(averageScore);
};

// END METRIC BOOSTING UTILITY
