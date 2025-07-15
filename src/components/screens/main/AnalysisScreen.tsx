import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  SectionHeading,
  StatParagraph,
  StatPill,
  IconFeatureCard,
  ForwardCircleFAB,
  LatestResultsCard,
  LoadingSpinner
} from '../../design-system';
import { colors, spacing } from '../../design-system/tokens';
import { useAnalysesList, useLatestAnalysis } from '../../../hooks/api/useAnalysis';
import { useAnalyticsDashboard } from '../../../hooks/api/useAnalytics';
import { 
  isAnalysisAvailable, 
  getAnalysisAvailabilityStatus, 
  formatTimeUntilMidnight 
} from '../../../utils/analysisTimer';

interface AnalysisScreenProps {
  onNavigateToCamera?: () => void;
  onNavigateToProgress?: () => void;
}

// Analysis screen states
enum AnalysisState {
  NO_ANALYSIS = 'no_analysis',
  HAS_COMPLETED = 'has_completed', 
  PROCESSING = 'processing',
  FAILED = 'failed',
  READY_FOR_NEW = 'ready_for_new'
}

interface MetricItem {
  title: string;
  score: number; // 0-100
  isLocked?: boolean;
}

const ANALYSIS_COOLDOWN_KEY = 'analysis_last_taken';

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  onNavigateToCamera,
  onNavigateToProgress
}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [timeUntilNext, setTimeUntilNext] = React.useState<string>('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [hasRefreshedOnFocus, setHasRefreshedOnFocus] = React.useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = React.useState(0);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const stateTransitionAnim = React.useRef(new Animated.Value(1)).current;
  
  // Loading messages that cycle through
  const loadingMessages = [
    "Analyzing your skin...",
    "Detecting skin texture...",
    "Measuring skin clarity...",
    "Calculating health scores...",
    "Almost ready!"
  ];
  
  // Fetch data with polling for processing analyses
  const { data: analyses, isLoading: analysesLoading, refetch: refetchAnalyses } = useAnalysesList();
  const { 
    data: latestAnalysis, 
    isLoading: latestLoading, 
    refetch: refetchLatest 
  } = useLatestAnalysis();
  const analytics = useAnalyticsDashboard();

  // Refresh data when component mounts or when analysis changes
  React.useEffect(() => {
    if (!hasRefreshedOnFocus) {
      console.log('🔄 AnalysisScreen mounted, refreshing data...');
      refetchLatest();
      refetchAnalyses();
      analytics.refetch();
      setHasRefreshedOnFocus(true);
    }
  }, [refetchLatest, refetchAnalyses, analytics, hasRefreshedOnFocus]);

  // Reset refresh flag when component unmounts or analysis changes
  React.useEffect(() => {
    // Reset flag when analysis changes
    return () => {
      setHasRefreshedOnFocus(false);
    };
  }, [latestAnalysis?.id]); // Reset when analysis changes

  // Save analysis timestamp to local storage when a new analysis is completed
  React.useEffect(() => {
    if (latestAnalysis?.status === 'completed' && latestAnalysis.created_at) {
      AsyncStorage.setItem(ANALYSIS_COOLDOWN_KEY, latestAnalysis.created_at);
    }
  }, [latestAnalysis?.status, latestAnalysis?.created_at]);

  // Determine current analysis state with daily reset logic
  const getAnalysisState = async (): Promise<AnalysisState> => {
    if (!latestAnalysis) {
      console.log('📊 No latest analysis found, state: NO_ANALYSIS');
      return AnalysisState.NO_ANALYSIS;
    }
    
    console.log('📊 Checking analysis state for:', {
      id: latestAnalysis.id,
      status: latestAnalysis.status,
      created_at: latestAnalysis.created_at
    });
    
    switch (latestAnalysis.status) {
      case 'processing':
        console.log('📊 Analysis is processing');
        return AnalysisState.PROCESSING;
      case 'failed':
        console.log('📊 Analysis failed');
        return AnalysisState.FAILED;
      case 'completed':
        // Check if analysis is available (daily reset logic)
        try {
          const lastAnalysisTime = await AsyncStorage.getItem(ANALYSIS_COOLDOWN_KEY);
          const analysisTimestamp = lastAnalysisTime || latestAnalysis.created_at;
          
          const isAvailable = isAnalysisAvailable(analysisTimestamp);
          console.log('📊 Analysis completed, checking availability:', {
            analysisTimestamp,
            isAvailable
          });
          
          return isAvailable 
            ? AnalysisState.READY_FOR_NEW 
            : AnalysisState.HAS_COMPLETED;
        } catch (error) {
          console.error('📊 Error checking analysis availability:', error);
          return AnalysisState.READY_FOR_NEW;
        }
      default:
        console.log('📊 Unknown analysis status, defaulting to NO_ANALYSIS');
        return AnalysisState.NO_ANALYSIS;
    }
  };

  const [analysisState, setAnalysisState] = React.useState<AnalysisState>(AnalysisState.NO_ANALYSIS);

  // Update analysis state
  React.useEffect(() => {
    getAnalysisState().then((newState) => {
      if (newState !== analysisState) {
        console.log('📊 Analysis state changed:', { from: analysisState, to: newState });
        
        // Animate state transition
        Animated.sequence([
          Animated.timing(stateTransitionAnim, {
            toValue: 0.8,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(stateTransitionAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
        
        setAnalysisState(newState);
      }
    });
  }, [latestAnalysis?.status, latestAnalysis?.created_at, latestAnalysis?.id, analysisState, stateTransitionAnim]);

  // Auto-refetch when analysis is processing
  React.useEffect(() => {
    if (analysisState === AnalysisState.PROCESSING) {
      console.log('🔄 Starting polling for processing analysis...');
      const interval = setInterval(() => {
        console.log('🔄 Polling for analysis update...');
        refetchLatest();
        refetchAnalyses(); // Also refetch analyses list
      }, 3000); // Poll every 3 seconds for faster updates
      
      return () => {
        console.log('⏹️ Stopping analysis polling');
        clearInterval(interval);
      };
    }
  }, [analysisState, refetchLatest, refetchAnalyses]);

  // Loading animation effects
  React.useEffect(() => {
    if (analysisState === AnalysisState.PROCESSING) {
      // Start continuous rotation animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      rotateAnimation.start();

      // Start pulsing animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Cycle through loading messages
      const messageInterval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => 
          (prevIndex + 1) % loadingMessages.length
        );
      }, 3000); // Change message every 3 seconds

      return () => {
        rotateAnimation.stop();
        pulseAnimation.stop();
        clearInterval(messageInterval);
        // Reset animations
        rotateAnim.setValue(0);
        scaleAnim.setValue(1);
      };
    }
  }, [analysisState, rotateAnim, scaleAnim, loadingMessages.length]);

  // Smooth text transition animation
  React.useEffect(() => {
    if (analysisState === AnalysisState.PROCESSING) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loadingMessageIndex, fadeAnim, analysisState]);

  // Extract metrics from analysis
  const getMetricsFromAnalysis = (): MetricItem[] => {
    if (!latestAnalysis?.skin_metrics?.metrics) {
      return [];
    }

    const metrics = latestAnalysis.skin_metrics.metrics;
    
    return Object.entries(metrics).map(([key, value]) => {
      let score = 0;
      
      if (typeof value === 'number') {
        score = Math.round((1 - value) * 100);
      } else if (typeof value === 'object' && value !== null) {
        const val = value as any;
        score = Math.round((1 - (val.score || val.value || val.level || 0)) * 100);
      }

      return {
        title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        score: Math.max(0, Math.min(100, score)),
        isLocked: false
      };
    }).filter(metric => metric.score < 100); // Only show metrics with meaningful data
  };

  // Countdown logic with daily reset
  React.useEffect(() => {
    const updateCountdown = async () => {
      if (analysisState !== AnalysisState.HAS_COMPLETED) {
        setTimeUntilNext('');
        return;
      }

      try {
        const lastAnalysisTime = await AsyncStorage.getItem(ANALYSIS_COOLDOWN_KEY);
        const analysisTimestamp = lastAnalysisTime || latestAnalysis?.created_at;
        
        if (!analysisTimestamp) {
          setTimeUntilNext('Ready now!');
          return;
        }

        const availabilityStatus = getAnalysisAvailabilityStatus(analysisTimestamp);
        
        if (availabilityStatus.isAvailable) {
          setTimeUntilNext('Ready now!');
          // Update state if analysis became available
          setAnalysisState(AnalysisState.READY_FOR_NEW);
          return;
        }

        setTimeUntilNext(formatTimeUntilMidnight());
      } catch {
        setTimeUntilNext('Ready now!');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60 * 1000); // Update every minute
    return () => clearInterval(timer);
  }, [analysisState, latestAnalysis?.created_at]);

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshing(true);
    
    try {
      await Promise.all([
        refetchAnalyses(),
        refetchLatest(),
        analytics.refetch(),
      ]);
      
      // Update state after refresh
      const newState = await getAnalysisState();
      console.log('📊 State after refresh:', newState);
      setAnalysisState(newState);
    } catch (error) {
      console.error('❌ Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleTakeNewAnalysis = async () => {
    console.log('📷 Taking new analysis...');
    // Clear cooldown when user takes new analysis
    await AsyncStorage.removeItem(ANALYSIS_COOLDOWN_KEY);
    
    // Force refresh to get the latest state
    await refetchLatest();
    await refetchAnalyses();
    
    if (onNavigateToCamera) {
      onNavigateToCamera();
    }
  };

  // Custom loading component
  const renderLoadingIndicator = () => {
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.loadingContainer}>
        <Animated.View
          style={[
            styles.loadingRing,
            {
              transform: [{ rotate: spin }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.loadingRingInner} />
        </Animated.View>
        <View style={styles.loadingCenter}>
          <Animated.View 
            style={[
              styles.loadingDot,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const metrics = getMetricsFromAnalysis();
  const totalAnalyses = analytics.overview?.total_analyses || 0;

  // Render different states
  const renderMainContent = () => {
    switch (analysisState) {
      case AnalysisState.NO_ANALYSIS:
        return (
          <TouchableOpacity style={styles.welcomeCard} onPress={handleTakeNewAnalysis}>
            <Text style={styles.welcomeEmoji}>🌟</Text>
            <Text style={styles.welcomeTitle}>Welcome to Skin Analysis!</Text>
            <Text style={styles.welcomeSubtitle}>
              Take your first selfie to get personalized insights about your skin
            </Text>
            <View style={styles.welcomeFeatures}>
              <Text style={styles.featureText}>✨ AI-powered analysis</Text>
              <Text style={styles.featureText}>📊 Detailed metrics</Text>
              <Text style={styles.featureText}>📈 Track your progress</Text>
            </View>
          </TouchableOpacity>
        );

      case AnalysisState.PROCESSING:
        return (
          <View style={styles.processingCard}>
            {renderLoadingIndicator()}
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text style={styles.processingTitle}>
                {loadingMessages[loadingMessageIndex]}
              </Text>
            </Animated.View>
            <Text style={styles.processingSubtitle}>
              We're analyzing your skin using advanced AI. This process creates detailed insights about your skin health.
            </Text>
            <View style={styles.progressDots}>
              {loadingMessages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index === loadingMessageIndex && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        );

      case AnalysisState.FAILED:
        return (
          <TouchableOpacity style={styles.errorCard} onPress={handleTakeNewAnalysis}>
            <Text style={styles.errorEmoji}>😔</Text>
            <Text style={styles.errorTitle}>Analysis failed</Text>
            <Text style={styles.errorSubtitle}>
              {latestAnalysis?.error_message || 'Something went wrong. Tap to try again.'}
            </Text>
          </TouchableOpacity>
        );

      case AnalysisState.READY_FOR_NEW:
        return (
          <View style={styles.readyStateContainer}>
            <TouchableOpacity style={styles.readyCard} onPress={handleTakeNewAnalysis}>
              <Text style={styles.readyEmoji}>⏰</Text>
              <Text style={styles.readyTitle}>Ready for your next scan!</Text>
              <Text style={styles.readySubtitle}>Your daily analysis is now available. Tap to analyze again.</Text>
            </TouchableOpacity>

            {latestAnalysis && (
              <View style={styles.historySection}>
                <Text style={styles.historySectionTitle}>📊 Previous Analysis</Text>
                <TouchableOpacity 
                  style={styles.previousAnalysisCard}
                  onPress={() => setModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.previousAnalysisHeader}>
                    <Text style={styles.previousAnalysisDate}>
                      {new Date(latestAnalysis.created_at).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                    <View style={styles.statusCompleted}>
                      <Text style={styles.statusText}>✅ Complete</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.previousAnalysisDescription}>
                    {latestAnalysis.skin_metrics?.metrics 
                      ? `${Object.keys(latestAnalysis.skin_metrics.metrics).length} skin metrics analyzed`
                      : 'Tap to view analysis details'
                    }
                  </Text>
                  
                  <View style={styles.tapToViewContainer}>
                    <Text style={styles.tapToViewText}>Tap to view full results</Text>
                    <Text style={styles.expandIcon}>▶</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case AnalysisState.HAS_COMPLETED:
      default:
        return (
          <View style={styles.completedStateContainer}>
            <View style={styles.nextAnalysisCard}>
              <Text style={styles.nextAnalysisTitle}>📅 Next Analysis</Text>
              <Text style={styles.nextAnalysisMessage}>
                Your next daily analysis will be available {timeUntilNext === 'Ready now!' ? 'now' : timeUntilNext}
              </Text>
            </View>

            {latestAnalysis && (
              <View style={styles.historySection}>
                <Text style={styles.historySectionTitle}>📊 Latest Analysis</Text>
                <TouchableOpacity 
                  style={styles.previousAnalysisCard}
                  onPress={() => setModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.previousAnalysisHeader}>
                    <Text style={styles.previousAnalysisDate}>
                      {new Date(latestAnalysis.created_at).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                    <View style={styles.statusCompleted}>
                      <Text style={styles.statusCheckmark}>✓</Text>
                      <Text style={styles.statusText}>Complete</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.previousAnalysisDescription}>
                    {latestAnalysis.skin_metrics?.metrics 
                      ? `${Object.keys(latestAnalysis.skin_metrics.metrics).length} skin metrics analyzed`
                      : 'Tap to view analysis details'
                    }
                  </Text>
                  
                  <View style={styles.tapToViewContainer}>
                    <Text style={styles.tapToViewText}>View Full Results</Text>
                    <Text style={styles.expandIcon}>→</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
    }
  };

  const renderCountdownSection = () => {
    if (analysisState === AnalysisState.HAS_COMPLETED && timeUntilNext) {
      return (
        <View style={styles.countdownRow}>
          <StatPill 
            value={timeUntilNext} 
            label="Next Scan In" 
            variant={timeUntilNext === 'Ready now!' ? 'accent' : 'secondary'} 
          />
          <StatPill value={totalAnalyses} label="Total Scans" variant="secondary" />
        </View>
      );
    }

    if (analysisState === AnalysisState.READY_FOR_NEW) {
      return (
        <View style={styles.countdownRow}>
          <StatPill value="Ready!" label="Status" variant="accent" />
          <StatPill value={totalAnalyses} label="Total Scans" variant="secondary" />
        </View>
      );
    }

    return null;
  };

  const isNewAnalysisDisabled = analysisState === AnalysisState.PROCESSING || analysisState === AnalysisState.HAS_COMPLETED;

  if (latestLoading && !latestAnalysis) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>Loading your analysis data...</Text>
      </View>
    );
  }

  console.log('📊 AnalysisScreen render:', {
    analysisState,
    latestAnalysis: latestAnalysis ? {
      id: latestAnalysis.id,
      status: latestAnalysis.status,
      created_at: latestAnalysis.created_at
    } : null,
    isLoading: latestLoading
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <SectionHeading>Skin Analysis</SectionHeading>
          <StatParagraph style={styles.subtitle}>
            {analysisState === AnalysisState.NO_ANALYSIS 
              ? 'Start your skin health journey'
              : analysisState === AnalysisState.PROCESSING
              ? 'Analysis in progress...'
              : analysisState === AnalysisState.READY_FOR_NEW
              ? 'Ready for your daily analysis'
              : 'Your skin analysis results'
            }
          </StatParagraph>
        </View>

        {/* Main Content */}
        <Animated.View style={{ opacity: stateTransitionAnim }}>
          {renderMainContent()}
        </Animated.View>

        {/* Countdown/Status Section */}
        {renderCountdownSection()}

        {/* Actions */}
        <View style={styles.section}>
          <SectionHeading style={styles.sectionTitle}>Actions</SectionHeading>
          <View style={styles.actionsGrid}>
            <IconFeatureCard
              icon="camera"
              title={analysisState === AnalysisState.NO_ANALYSIS ? "Start Analysis" : "New Analysis"}
              description={isNewAnalysisDisabled ? "Available " + (timeUntilNext === 'Ready now!' ? 'now' : timeUntilNext) : "Take your daily photo"}
              onPress={isNewAnalysisDisabled ? undefined : handleTakeNewAnalysis}
              style={[
                styles.actionCard,
                isNewAnalysisDisabled && styles.actionCardDisabled
              ]}
            />
            <IconFeatureCard
              icon="trending-up"
              title="Progress"
              description="View trends"
              onPress={onNavigateToProgress}
              style={styles.actionCard}
            />
          </View>
        </View>
      </ScrollView>

      {/* Floating Camera Button */}
      <ForwardCircleFAB 
        onPress={isNewAnalysisDisabled ? undefined : handleTakeNewAnalysis} 
        visible={!isNewAnalysisDisabled} 
      />

      {/* Expanded Results Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Analysis Results</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {latestAnalysis?.image_url && (
              <LatestResultsCard 
                imageUrl={latestAnalysis.image_url} 
                metrics={metrics} 
              />
            )}
            
            <View style={styles.modalInfoSection}>
              <Text style={styles.modalInfoTitle}>Analysis Date</Text>
              <Text style={styles.modalInfoText}>
                {latestAnalysis && new Date(latestAnalysis.created_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>

            <View style={styles.modalInfoSection}>
              <Text style={styles.modalInfoTitle}>Metrics Analyzed</Text>
              <Text style={styles.modalInfoText}>
                {metrics.length} skin health indicators
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  scrollContent: {
    paddingBottom: spacing.xl * 3,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.m,
  },
  headerSection: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xl + spacing.xl,
    paddingBottom: spacing.m,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.s,
  },
  
  // Welcome state
  welcomeCard: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
    backgroundColor: colors.surfaceNeutral,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
  },
  welcomeEmoji: {
    fontSize: 48,
    marginBottom: spacing.m,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  welcomeFeatures: {
    alignSelf: 'stretch',
  },
  featureText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },

  // Processing state
  processingCard: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
    backgroundColor: colors.surfaceNeutral,
    borderRadius: 24,
    padding: spacing.xl * 2, // Increased from spacing.xl * 1.5
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xl * 2, // Increased from spacing.xl
    marginBottom: spacing.m, // Increased from spacing.s
    textAlign: 'center',
  },
  processingSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl, // Increased from spacing.l
    lineHeight: 22,
  },

  // Custom loading animation styles
  loadingContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.accentGreen + '30',
    borderTopColor: colors.accentGreen,
    borderRightColor: colors.accentGreen,
  },
  loadingRingInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.accentGreen + '20',
    borderTopColor: colors.accentGreen + '60',
    margin: 7,
  },
  loadingCenter: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accentGreen + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accentGreen,
    shadowColor: colors.accentGreen,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl * 1.5, // Increased from spacing.l
    gap: spacing.s,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary + '40',
  },
  progressDotActive: {
    backgroundColor: colors.accentGreen,
    transform: [{ scale: 1.2 }],
  },

  // Error state
  errorCard: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
    backgroundColor: '#FFF0F0',
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: spacing.m,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.error,
    marginBottom: spacing.s,
  },
  errorSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Ready for new state
  readyStateContainer: {
    paddingHorizontal: spacing.l,
  },
  readyCard: {
    marginBottom: spacing.l,
    backgroundColor: '#F0FFE0',
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
  },
  readyEmoji: {
    fontSize: 48,
    marginBottom: spacing.m,
  },
  readyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.success,
    marginBottom: spacing.s,
  },
  readySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.l,
    marginBottom: spacing.l,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.l,
    gap: spacing.m,
  },
  actionCard: {
    width: '47%',
  },
  actionCardDisabled: {
    opacity: 0.5,
  },

  // Results state
  resultsCard: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
    backgroundColor: colors.surfaceNeutral,
    borderRadius: 16,
    padding: spacing.xl,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  resultsEmoji: {
    fontSize: 48,
    marginRight: spacing.m,
  },
  resultsInfo: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  expandIcon: {
    fontSize: 18,
    color: colors.accentGreen,
    fontWeight: '600',
  },
  metricsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.m,
  },
  metricPreviewItem: {
    marginRight: spacing.m,
  },
  metricPreviewTitle: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  metricPreviewScore: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  moreMetrics: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Expanded Results Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.s,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  modalContent: {
    flex: 1,
  },
  modalInfoSection: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  modalInfoText: {
    fontSize: 16,
    color: colors.textPrimary,
  },

  // Completed state styles
  completedStateContainer: {
    paddingHorizontal: spacing.l,
  },
  nextAnalysisCard: {
    backgroundColor: colors.surfaceNeutral,
    borderRadius: 16,
    padding: spacing.l,
    marginBottom: spacing.l,
    alignItems: 'center',
  },
  nextAnalysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  nextAnalysisMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  historySection: {
    marginBottom: spacing.l,
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  previousAnalysisCard: {
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 20,
    padding: spacing.xl,
    marginHorizontal: spacing.xs,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.border + '40', // More subtle border
  },
  previousAnalysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.l,
  },
  previousAnalysisDate: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.m,
  },
  previousAnalysisDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.l,
    lineHeight: 22,
  },
  tapToViewContainer: {
    backgroundColor: colors.accentGreen + '15', // Subtle green background
    borderRadius: 12,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accentGreen + '30',
  },
  tapToViewText: {
    fontSize: 16,
    color: colors.accentGreen,
    fontWeight: '600',
    marginRight: spacing.s,
  },
  statusCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentGreen,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 20,
    minWidth: 100,
    justifyContent: 'center',
    shadowColor: colors.accentGreen,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    marginLeft: spacing.xs,
  },
  statusCheckmark: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
}); 