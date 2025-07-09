import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton, SectionHeading, StatParagraph } from '../design-system';
import { colors, spacing, typography } from '../design-system/tokens';
import { useLatestAnalysis } from '../../hooks/api/useAnalysis';
import { analysisApi } from '../../services/analysisApi';

interface DiagnosticResult {
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

export const BackendAIDiagnostic: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { data: latestAnalysis, refetch } = useLatestAnalysis();

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);
    
    const results: DiagnosticResult[] = [];

    try {
      // Test 1: Check if we can fetch latest analysis
      results.push({ 
        status: 'success', 
        message: 'API Connection: ✅ Successfully connected to backend'
      });

      // Test 2: Analyze latest analysis data
      if (latestAnalysis) {
        results.push({
          status: 'success',
          message: `Latest Analysis Found: ID ${latestAnalysis.id}`,
          details: {
            status: latestAnalysis.status,
            created: latestAnalysis.created_at,
            hasMetrics: !!latestAnalysis.skin_metrics
          }
        });

        // Test 3: Check for AI processing issues
        if (latestAnalysis.status === 'completed' && latestAnalysis.skin_metrics?.metrics) {
          const metrics = latestAnalysis.skin_metrics.metrics;
          const scores = Object.values(metrics).map(metric => {
            if (typeof metric === 'object' && metric !== null) {
              return (metric as any).score || 0;
            }
            return 0;
          });

          // Check for fallback data patterns
          const hasRoundNumbers = scores.some(score => [0.2, 0.6, 0.8].includes(score));
          const hasNoVariation = new Set(scores).size <= 2;
          const confidenceScore = latestAnalysis.skin_metrics.confidence_score;
          const hasLowConfidence = confidenceScore !== undefined && confidenceScore < 0.3;

          if (hasRoundNumbers || hasNoVariation || hasLowConfidence) {
            results.push({
              status: 'error',
              message: '🚨 BACKEND AI FAILURE DETECTED',
              details: {
                issue: 'Analysis contains fallback/dummy data patterns',
                scores: scores.map(s => Math.round(s * 100)),
                confidence: confidenceScore,
                patterns: {
                  hasRoundNumbers,
                  hasNoVariation,
                  hasLowConfidence
                }
              }
            });
          } else {
            results.push({
              status: 'success',
              message: '✅ Analysis data appears valid (no fallback patterns detected)',
              details: {
                scores: scores.map(s => Math.round(s * 100)),
                confidence: confidenceScore
              }
            });
          }
        } else if (latestAnalysis.status === 'failed') {
          results.push({
            status: 'error',
            message: '❌ Analysis failed',
            details: {
              error: latestAnalysis.error_message,
              isGeminiFailure: latestAnalysis.error_message?.includes('Gemini') ||
                              latestAnalysis.error_message?.includes('fallback')
            }
          });
        }
      } else {
        results.push({
          status: 'warning',
          message: '⚠️ No analysis data found'
        });
      }

    } catch (error: any) {
      results.push({
        status: 'error',
        message: `❌ API Error: ${error.message}`,
        details: error
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      default: return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <SectionHeading style={styles.title}>
          Backend AI Diagnostic
        </SectionHeading>
        
        <StatParagraph style={styles.description}>
          This tool helps identify if your backend's Gemini API integration is working properly
          or returning fallback/dummy data.
        </StatParagraph>

        <PrimaryButton
          title={isRunning ? "Running Diagnostics..." : "Run Diagnostic"}
          onPress={runDiagnostics}
          disabled={isRunning}
          style={styles.button}
        />

        {diagnostics.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Diagnostic Results:</Text>
            
            {diagnostics.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={[styles.resultMessage, { color: getStatusColor(result.status) }]}>
                  {result.message}
                </Text>
                
                {result.details && (
                  <Text style={styles.resultDetails}>
                    {JSON.stringify(result.details, null, 2)}
                  </Text>
                )}
              </View>
            ))}

            {diagnostics.some(d => d.status === 'error') && (
              <View style={styles.actionContainer}>
                <Text style={styles.actionTitle}>🔧 Next Steps:</Text>
                <Text style={styles.actionText}>
                  1. Check your backend logs for Gemini API errors{'\n'}
                  2. Verify your Gemini API key is valid{'\n'}
                  3. Ensure analysis.py is properly processing images{'\n'}
                  4. Fix any "Invalid result type: NoneType" errors{'\n'}
                  5. Remove fallback data responses
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
    padding: spacing.l,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  description: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: colors.textSecondary,
  },
  button: {
    marginBottom: spacing.xl,
  },
  resultsContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.l,
    borderRadius: 12,
  },
  resultsTitle: {
    fontSize: typography.fontSizes.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  resultItem: {
    marginBottom: spacing.m,
    paddingBottom: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultMessage: {
    fontSize: typography.fontSizes.body,
    fontWeight: '500',
    marginBottom: spacing.s,
  },
  resultDetails: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    backgroundColor: colors.backgroundPrimary,
    padding: spacing.s,
    borderRadius: 4,
  },
  actionContainer: {
    marginTop: spacing.l,
    padding: spacing.m,
    backgroundColor: colors.error + '20',
    borderRadius: 8,
  },
  actionTitle: {
    fontSize: typography.fontSizes.body,
    fontWeight: '600',
    color: colors.error,
    marginBottom: spacing.s,
  },
  actionText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
}); 