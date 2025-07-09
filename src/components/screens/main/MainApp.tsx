import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabNavigator, TabRoute } from '../../navigation/TabNavigator';
import { HomeScreen } from './HomeScreen';
import { AnalysisScreen } from './AnalysisScreen';
import { RoutineScreen } from './RoutineScreen';
import { ProfileScreen } from './ProfileScreen';
import { InsightsOverview } from '../InsightsOverview';
import { ErrorBoundary } from '../../shared/ErrorBoundary';
import { colors } from '../../design-system/tokens';
import { useAuthStore } from '../../../stores/authStore';

interface MainAppProps {
  onNavigateToCamera?: () => void;
  onNavigateToHelp?: () => void;
  onNavigateToPrivacy?: () => void;
  onSignOut?: () => void;
}

export const MainApp: React.FC<MainAppProps> = ({
  onNavigateToCamera,
  onNavigateToHelp,
  onNavigateToPrivacy,
  onSignOut
}) => {
  const [currentTab, setCurrentTab] = useState<TabRoute>('home');
  const [showInsights, setShowInsights] = useState(false);
  const { signOut } = useAuthStore();

  const handleSignOut = () => {
    signOut();
    if (onSignOut) {
      onSignOut();
    }
  };

  // Handle Progress navigation
  const handleNavigateToProgress = () => {
    setShowInsights(true);
  };

  const handleBackFromInsights = () => {
    setShowInsights(false);
  };

  // Show InsightsOverview if navigated to it
  if (showInsights) {
    return (
      <View style={styles.container}>
        <ErrorBoundary fallbackMessage="Insights screen temporarily unavailable">
          <InsightsOverview
            onBack={handleBackFromInsights}
            onNavigate={(screen: string) => {
              console.log('🔄 InsightsOverview navigation to:', screen);
              if (screen === 'CameraPreview' && onNavigateToCamera) {
                onNavigateToCamera();
              } else if (screen === 'AnalysisScreen') {
                // Navigate to the analysis tab
                console.log('✅ Navigating to analysis tab from insights');
                setShowInsights(false);
                setCurrentTab('analysis');
              } else if (screen === 'ProductRecommendations') {
                // Future: handle product recommendations navigation
                console.log('📋 Product recommendations navigation requested (not implemented yet)');
              } else {
                console.log('⚠️ Unknown navigation destination from insights:', screen);
              }
            }}
          />
        </ErrorBoundary>
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentTab) {
      case 'home':
        return (
          <ErrorBoundary fallbackMessage="Home screen temporarily unavailable">
            <HomeScreen
              onNavigateToAnalysis={() => setCurrentTab('analysis')}
              onNavigateToRoutine={() => setCurrentTab('routine')}
              onNavigateToProfile={() => setCurrentTab('profile')}
            />
          </ErrorBoundary>
        );
      
      case 'analysis':
        return (
          <ErrorBoundary fallbackMessage="Analysis screen temporarily unavailable">
            <AnalysisScreen
              onNavigateToCamera={onNavigateToCamera}
              onNavigateToProgress={handleNavigateToProgress}
            />
          </ErrorBoundary>
        );
      
      case 'routine':
        return (
          <ErrorBoundary fallbackMessage="Routine screen temporarily unavailable">
            <RoutineScreen
              onNavigateToProducts={() => {/* TODO: Navigate to products screen */}}
              onNavigateToHistory={() => {/* TODO: Navigate to routine history */}}
            />
          </ErrorBoundary>
        );
      
      case 'profile':
        return (
          <ErrorBoundary fallbackMessage="Profile screen temporarily unavailable">
            <ProfileScreen
              onNavigateToEdit={() => {/* TODO: Navigate to edit profile */}}
              onNavigateToHelp={onNavigateToHelp}
              onNavigateToPrivacy={onNavigateToPrivacy}
              onSignOut={handleSignOut}
            />
          </ErrorBoundary>
        );
      
      default:
        return (
          <ErrorBoundary fallbackMessage="Home screen temporarily unavailable">
            <HomeScreen
              onNavigateToAnalysis={() => setCurrentTab('analysis')}
              onNavigateToRoutine={() => setCurrentTab('routine')}
              onNavigateToProfile={() => setCurrentTab('profile')}
            />
          </ErrorBoundary>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <TabNavigator
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    flex: 1,
  },
}); 