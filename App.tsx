import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, InteractionManager, Alert, StatusBar } from 'react-native';
import * as Linking from 'expo-linking';
import { AppProviders } from './src/providers/AppProviders';
import { useAuth } from './src/stores/authStore';
import { useCompleteOnboarding, useCreateOnboardingFromUserData } from './src/hooks/api/useUser';
import { useAnalysisWorkflow } from './src/hooks/api/useAnalysis';
import { 
  SplashScreen, 
  OnboardingTakePicture, 
  OnboardingGetResults,
  OnboardingProductRecommendations,
  OnboardingTrackProgress,
  WelcomeAuthScreen,
  CaptureGuidelines,
  CameraPreview,
  ProcessingAnalysis,
  KnowYouBetterIntro,
  OnboardingGender,
  OnboardingAge,
  ValuePropExpertOnYou,
  OnboardingSkincareExperience,
  ValuePropDatabase,
  SuccessUnderstanding,
  MotivationIntro,
  SurveyStatementYN,
  NotificationsPermissionExplain,
  TrendingProductsIntro,
  SocialProofResults,
  SuccessMotivations,
  SkinIssuesIntro,
  SelectTopConcern,
  ConcernDuration,
  MotivationWhyConcern,
  SuccessSkinIssues,
  RatingPrompt,
  PlanRoadmap,
  AnalysisLoading,
  ResultsLegend,
  FirstAnalysisView,
  BuildRoutineIntro,
  SunExposureLevel,
  ProductUsageYesNo,
  ProductEffectFeedback,
  MatchSummary,
  CustomRoutineDetail,
  InsightsOverview,
  MainApp,
  UserProfile,
  EmailEnterScreen,
  EmailVerifyCodeScreen,
  EmailSignInScreen,
  HelpSupportScreen,
  PrivacyPolicyScreen
} from './src/components/screens';
import { colors, animations, animationPresets } from './src/components/design-system/tokens';
import { ErrorBoundary } from './src/components/shared/ErrorBoundary';

type AppState = 
  | 'splash' 
  | 'onboarding-take-picture' 
  | 'onboarding-get-results'
  | 'onboarding-product-recommendations-preview'  // Preview mode - no data fetch
  | 'onboarding-product-recommendations'  // Real mode - with data
  | 'onboarding-track-progress'
  | 'welcome-auth'
  | 'capture-guidelines'
  | 'camera-preview'
  | 'processing-analysis'  // New processing animation screen
  | 'main-app-analysis-results'  // New results screen for main app analysis
  | 'know-you-better-intro'
  | 'onboarding-gender'
  | 'onboarding-age'
  | 'value-prop-expert'
  | 'onboarding-skincare-experience'
  | 'value-prop-database'
  | 'success-understanding'
  | 'motivation-intro'
  | 'survey-statement-1'
  | 'survey-statement-2'
  | 'notifications-permission'
  | 'trending-products-intro'
  | 'social-proof-results'
  | 'success-motivations'
  | 'skin-issues-intro'
  | 'select-top-concern'
  | 'concern-duration'
  | 'motivation-why-concern'
  | 'success-skin-issues'
  | 'rating-prompt'
  | 'plan-roadmap'
  | 'analysis-loading'
  | 'results-legend'
  | 'first-analysis-view'
  | 'build-routine-intro'
  | 'sun-exposure-level'
  | 'product-usage-yes-no'
  | 'product-effect-feedback'
  | 'match-summary'
  | 'custom-routine-detail'
  | 'insights-overview'
  | 'main-app'
  | 'user-profile'
  | 'help-support'
  | 'privacy-policy'
  | 'email-enter'
  | 'email-verify'
  | 'email-signin';

type CameraContext = 'onboarding' | 'main-app';

interface UserData {
  photoUri?: string;
  gender?: string;
  ageRange?: string;
  skincareExperience?: string;
  motivation?: {
    strugglesWithSkin?: boolean;
    timeConstraints?: boolean;
    wantsNotifications?: boolean;
  };
  trendingProducts?: {
    buysTrendingProducts?: boolean;
    influencedBySocial?: boolean;
  };
  deepMotivation?: {
    neverAchieveDreamSkin?: boolean;
  };
  skinConcerns?: {
    selectedConcern?: string;
    concernDuration?: string;
    motivationReason?: string;
  };
  routinePreferences?: {
    sunExposure?: 'low' | 'occasional' | 'high';
    hasTriedProducts?: boolean;
    productEffectiveness?: 'helped-lot' | 'helped-little' | 'no-effect' | 'made-worse';
  };
  analysisData?: any;
}

const screenWidth = Dimensions.get('window').width;

// Main App component that contains the app logic
const AppContent: React.FC = () => {
  const { isLoading: authLoading, isAuthenticated, initialize, userProfile } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AppState>('splash');
  const [userData, setUserData] = useState<UserData>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [emailForAuth, setEmailForAuth] = useState<string>('');
  const [passwordForAuth, setPasswordForAuth] = useState<string>('');
  const [cameraContext, setCameraContext] = useState<CameraContext>('onboarding');
  
  // Backend integration hooks
  const { submitUserData, isLoading: isSubmittingOnboarding } = useCreateOnboardingFromUserData();
  const { mutate: startAnalysis, isPending: isAnalyzing } = useAnalysisWorkflow();
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Initialize authentication on app start
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle deep links for OAuth callback
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      console.log('App: Received deep link:', url);
      
      // Check if this is an auth callback (handle both development and production URLs)
      if (url.includes('/auth') || url.includes('access_token') || url.includes('dymz://auth')) {
        console.log('App: Auth callback detected, processing OAuth callback...');
        // Let Supabase handle the OAuth callback
        console.log('App: Processing OAuth callback URL:', url);
      }
    };

    // Handle app opening from deep link
    const getInitialURL = async () => {
      const initialURL = await Linking.getInitialURL();
      if (initialURL) {
        handleDeepLink(initialURL);
      }
    };

    // Handle deep links while app is open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    getInitialURL();

    return () => {
      subscription?.remove();
    };
  }, [currentScreen]);

  const transitionToScreen = (newScreen: AppState, direction: 'forward' | 'back' = 'forward') => {
    console.log('🔄 transitionToScreen called:', { newScreen, isTransitioning, currentScreen });
    
    if (isTransitioning) {
      console.log('❌ Transition blocked - already transitioning');
      return;
    }
    
    console.log('✅ Starting transition to:', newScreen);
    setIsTransitioning(true);
    
    // INSTANT response - starts immediately with no delays
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250, // Faster exit
        easing: animations.easing.sharp, // Snappier easing
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 200,
        easing: animations.easing.sharp,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Change screen immediately - no delay
      setCurrentScreen(newScreen);
      
      // Immediate entrance animation - no timeout
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350, // Quick but smooth
          easing: animations.easing.gentle,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200, // More responsive spring
          friction: 15,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  // Handle authentication state changes and onboarding completion check
  useEffect(() => {
    console.log('App: Auth state effect triggered', { authLoading, isAuthenticated, currentScreen });
    
    // Don't do anything while auth is still loading
    if (authLoading) {
      console.log('App: Auth still loading, waiting...');
      return;
    }

    // Skip redirection if user is in critical auth flows
    const criticalAuthScreens = [
      'email-enter', 'email-verify', 'email-signin', 'welcome-auth'
    ];
    
    if (criticalAuthScreens.includes(currentScreen)) {
      console.log('App: User in critical auth flow, skipping redirection');
      return;
    }

    // Handle authenticated users - check onboarding completion regardless of current screen
    if (isAuthenticated && userProfile) {
      // Defensive check for profile data integrity
      const hasCompletedOnboarding = userProfile.onboarding_completed === true;
      console.log('App: User authenticated with profile loaded', {
        user_id: userProfile.user_id,
        display_name: userProfile.display_name,
        onboarding_completed: hasCompletedOnboarding,
        currentScreen
      });
      
      if (hasCompletedOnboarding) {
        // User has completed onboarding - redirect to main app (with comprehensive exclusions)
        const allowedScreensForCompletedUsers = [
          'main-app', 'user-profile', 'help-support', 'privacy-policy', 'insights-overview'
        ];
        
        if (!allowedScreensForCompletedUsers.includes(currentScreen)) {
          console.log('App: Existing user detected, skipping onboarding to main app');
          transitionToScreen('main-app');
        }
      } else {
        // User hasn't completed onboarding - redirect to onboarding flow
        const onboardingScreens = [
          'capture-guidelines', 'camera-preview', 'processing-analysis', 'know-you-better-intro',
          'onboarding-gender', 'onboarding-age', 'value-prop-expert', 'onboarding-skincare-experience',
          'value-prop-database', 'success-understanding', 'motivation-intro', 'survey-statement-1',
          'survey-statement-2', 'notifications-permission', 'trending-products-intro', 'social-proof-results', 'success-motivations',
          'skin-issues-intro', 'select-top-concern', 'concern-duration', 'motivation-why-concern',
          'success-skin-issues', 'rating-prompt', 'plan-roadmap', 'analysis-loading', 'results-legend',
          'first-analysis-view', 'build-routine-intro', 'sun-exposure-level', 'product-usage-yes-no',
          'product-effect-feedback', 'match-summary', 'custom-routine-detail'
        ];
        
        if (!onboardingScreens.includes(currentScreen) && !criticalAuthScreens.includes(currentScreen)) {
          console.log('App: User needs to complete onboarding, starting onboarding flow');
          transitionToScreen('capture-guidelines');
        }
      }
      return;
    }

    // Handle authenticated users without profile loaded yet (profile still loading)
    if (isAuthenticated && userProfile === null) {
      console.log('App: User authenticated but profile still loading, waiting...');
      // Don't make any routing decisions - let the profile load first
      // The splash screen timeout or manual auth handlers will provide fallbacks if needed
      return;
    }

    // Handle user not authenticated trying to access protected screens
    if (!isAuthenticated) {
      const protectedScreens = [
        'main-app', 'user-profile', 'insights-overview'
      ];
      
      if (protectedScreens.includes(currentScreen)) {
        console.log('App: User not authenticated on protected screen, redirecting to auth screen');
        transitionToScreen('welcome-auth');
        return;
      }
    }
  }, [authLoading, isAuthenticated, currentScreen, userProfile?.onboarding_completed, userProfile?.user_id]);

  useEffect(() => {
    // Show splash screen for 2 seconds, then check auth state before transitioning
    const timer = setTimeout(() => {
      if (currentScreen === 'splash') {
        if (!authLoading) {
          // Wait for both authentication AND profile to load for authenticated users
          if (isAuthenticated) {
            if (userProfile !== null) {
              // Profile loaded - make routing decision
              const hasCompletedOnboarding = userProfile.onboarding_completed === true;
              
              if (hasCompletedOnboarding) {
                console.log('App: Splash complete, authenticated user with completed onboarding going to main app');
                transitionToScreen('main-app');
              } else {
                console.log('App: Splash complete, authenticated user starting onboarding');
                transitionToScreen('capture-guidelines');
              }
            } else {
              // Profile still loading - extend splash screen by 1 second
              console.log('App: Authenticated but profile still loading, extending splash');
              setTimeout(() => {
                if (currentScreen === 'splash') {
                  // Fallback: if profile still not loaded, start onboarding
                  console.log('App: Profile load timeout, defaulting to onboarding');
                  transitionToScreen('capture-guidelines');
                }
              }, 1000);
            }
          } else {
            // Not authenticated - show initial onboarding flow
            console.log('App: Splash complete, not authenticated, showing initial onboarding');
            transitionToScreen('onboarding-take-picture');
          }
        } else {
          // Auth still loading - extend splash screen by 1 second
          console.log('App: Splash timer complete but auth still loading, extending splash');
          setTimeout(() => {
            if (currentScreen === 'splash') {
              // Fallback: if auth still loading, show initial onboarding
              console.log('App: Auth load timeout, defaulting to initial onboarding');
              transitionToScreen('onboarding-take-picture');
            }
          }, 1000);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentScreen, authLoading, isAuthenticated, userProfile]);

  const handleTakePictureContinue = () => {
    transitionToScreen('onboarding-get-results');
  };

  const handleGetResultsContinue = () => {
    // Show preview version during initial onboarding
    transitionToScreen('onboarding-product-recommendations-preview');
  };

  const handleProductRecommendationsContinue = () => {
    // Check if we're in preview mode or real mode
    if (currentScreen === 'onboarding-product-recommendations-preview') {
      // Preview mode - continue to track progress then auth
      transitionToScreen('onboarding-track-progress');
    } else {
      // Real mode - after seeing personalized recommendations, continue with profile building
      transitionToScreen('build-routine-intro');
    }
  };

  const handleTrackProgressContinue = () => {
    transitionToScreen('welcome-auth');
  };

  const handleContinueAsGuest = () => {
    // For now, continue to capture guidelines
    transitionToScreen('capture-guidelines');
  };

  const handleSignInWithGoogle = () => {
    // This is now handled directly in WelcomeAuthScreen
    console.log('Google sign in initiated from App.tsx (should not happen)');
  };

  const handleLogin = () => {
    // Keep existing behavior if needed
    transitionToScreen('capture-guidelines');
  };

  const handleEmailSignUp = () => {
    transitionToScreen('email-enter');
  };

  const handleEmailSignIn = () => {
    transitionToScreen('email-signin');
  };

  const handleEmailAuthStart = () => {
    // Deprecated - keeping for compatibility
    transitionToScreen('email-enter');
  };

  const handleAccountCreated = (email: string, password: string, needsVerification: boolean) => {
    setEmailForAuth(email);
    setPasswordForAuth(password);
    
    if (needsVerification) {
      // Account created but needs email verification
      console.log('App: Account created, needs email verification');
      transitionToScreen('email-verify');
    } else {
      // Account created and verified, proceed to onboarding
      console.log('App: Account created and verified, proceeding to onboarding');
      transitionToScreen('capture-guidelines');
    }
  };

  const handleEmailSignInSuccess = () => {
    // After successful email + password sign in, check if user has completed onboarding
    console.log('App: Email sign in successful, checking user onboarding status...');
    
    if (userProfile) {
      const hasCompletedOnboarding = userProfile.onboarding_completed;
      console.log('App: User profile found', {
        user_id: userProfile.user_id,
        display_name: userProfile.display_name,
        onboarding_completed: hasCompletedOnboarding
      });
      
      if (hasCompletedOnboarding) {
        console.log('App: Existing user signed in, redirecting to main app');
        transitionToScreen('main-app');
      } else {
        console.log('App: User has incomplete onboarding, continuing onboarding');
        transitionToScreen('capture-guidelines');
      }
    } else {
      // Profile not loaded yet - for existing users, default to main app and let auth useEffect handle proper routing
      console.log('App: User profile not loaded yet after sign in, defaulting to main app (auth useEffect will handle routing)');
      transitionToScreen('main-app');
    }
  };

  const handleEmailVerified = () => {
    // After successful OTP verification (sign up), check if user has completed onboarding
    console.log('App: Email verified, checking user onboarding status...');
    
    if (userProfile) {
      const hasCompletedOnboarding = userProfile.onboarding_completed;
      console.log('App: User profile found', {
        user_id: userProfile.user_id,
        display_name: userProfile.display_name,
        onboarding_completed: hasCompletedOnboarding
      });
      
      if (hasCompletedOnboarding) {
        console.log('App: Existing user detected after email verification, redirecting to main app');
        transitionToScreen('main-app');
      } else {
        console.log('App: New user or incomplete onboarding after email verification, continuing onboarding');
        transitionToScreen('capture-guidelines');
      }
    } else {
      // New user without profile - start onboarding flow
      console.log('App: New user without profile after email verification, starting onboarding');
      transitionToScreen('capture-guidelines');
    }
  };

  const handleCaptureGuidelinesContinue = () => {
    transitionToScreen('camera-preview');
  };

  const handleTakePicture = (photoUri?: string) => {
    if (photoUri) {
      setUserData(prev => ({ ...prev, photoUri }));
      console.log('Photo captured:', photoUri);
      
      if (cameraContext === 'main-app') {
        // Main app flow: Show processing animation, then start analysis
        transitionToScreen('processing-analysis');
      } else {
        // Onboarding flow: Store the photo and continue with user data collection
        // Analysis will happen later after collecting all user data
        transitionToScreen('know-you-better-intro');
      }
    } else {
      // No photo taken, handle based on context
      if (cameraContext === 'main-app') {
        // Return to main app without photo
        transitionToScreen('main-app');
      } else {
        // Continue onboarding anyway
        transitionToScreen('know-you-better-intro');
      }
    }
  };

  const handleKnowYouBetterContinue = () => {
    transitionToScreen('onboarding-gender');
  };

  const handleGenderContinue = (gender: string) => {
    setUserData(prev => ({ ...prev, gender }));
    console.log('Gender selected:', gender);
    transitionToScreen('onboarding-age');
  };

  const handleAgeContinue = (ageRange: string) => {
    setUserData(prev => ({ ...prev, ageRange }));
    console.log('Age range selected:', ageRange);
    transitionToScreen('value-prop-expert');
  };

  const handleValuePropExpertContinue = () => {
    transitionToScreen('onboarding-skincare-experience');
  };

  const handleSkincareExperienceContinue = (experience: string) => {
    setUserData(prev => ({ ...prev, skincareExperience: experience }));
    console.log('Skincare experience selected:', experience);
    transitionToScreen('value-prop-database');
  };

  const handleValuePropDatabaseContinue = () => {
    transitionToScreen('success-understanding');
  };

  const handleSuccessUnderstandingContinue = () => {
    console.log('User data collected so far:', userData);
    transitionToScreen('motivation-intro');
  };

  // Block 6 navigation handlers
  const handleMotivationIntro = () => {
    transitionToScreen('survey-statement-1');
  };

  const handleSurveyStatement1Yes = () => {
    setUserData(prev => ({
      ...prev,
      motivation: { ...prev.motivation, strugglesWithSkin: true }
    }));
    transitionToScreen('survey-statement-2');
  };

  const handleSurveyStatement1No = () => {
    setUserData(prev => ({
      ...prev,
      motivation: { ...prev.motivation, strugglesWithSkin: false }
    }));
    transitionToScreen('survey-statement-2');
  };

  const handleSurveyStatement2Yes = () => {
    setUserData(prev => ({
      ...prev,
      motivation: { ...prev.motivation, timeConstraints: true }
    }));
    transitionToScreen('notifications-permission');
  };

  const handleSurveyStatement2No = () => {
    setUserData(prev => ({
      ...prev,
      motivation: { ...prev.motivation, timeConstraints: false }
    }));
    transitionToScreen('notifications-permission');
  };

  const handleNotificationsComplete = () => {
    console.log('User data after Block 6:', userData);
    transitionToScreen('trending-products-intro');
  };

  // Block 7 navigation handlers
  const handleTrendingProductsIntro = () => {
    transitionToScreen('social-proof-results');
  };

  const handleSocialProofResultsContinue = () => {
    transitionToScreen('success-motivations');
  };

  const handleSuccessMotivationsContinue = () => {
    console.log('Success motivations completed, transitioning to skin analysis!');
    transitionToScreen('skin-issues-intro');
  };

  // Block 9 navigation handlers
  const handleSkinIssuesIntroContinue = () => {
    transitionToScreen('select-top-concern');
  };

  const handleTopConcernSelected = (concern: string) => {
    console.log('🎯 App.tsx - handleTopConcernSelected called with:', concern);
    setUserData(prev => ({
      ...prev,
      skinConcerns: { ...prev.skinConcerns, selectedConcern: concern }
    }));
    console.log('✅ App.tsx - User data updated, transitioning to concern-duration');
    transitionToScreen('concern-duration');
  };

  const handleConcernDurationSelected = (duration: string) => {
    setUserData(prev => ({
      ...prev,
      skinConcerns: { ...prev.skinConcerns, concernDuration: duration }
    }));
    console.log('Concern duration selected:', duration);
    transitionToScreen('motivation-why-concern');
  };

  // Block 10 navigation handlers
  const handleMotivationReasonSelected = (motivation: string) => {
    setUserData(prev => ({
      ...prev,
      skinConcerns: { ...prev.skinConcerns, motivationReason: motivation }
    }));
    console.log('Motivation reason selected:', motivation);
    transitionToScreen('success-skin-issues');
  };

  const handleSuccessSkinIssuesContinue = () => {
    // Continue to rating prompt - onboarding data will be submitted at the end of the flow
    transitionToScreen('rating-prompt');
  };

  const handleRateApp = () => {
    console.log('User rated the app - would open app store');
    // Transition to plan roadmap to begin analysis phase
    transitionToScreen('plan-roadmap');
  };

  const handleRatingDismiss = () => {
    console.log('User dismissed rating - continuing without rating');
    // Transition to plan roadmap to begin analysis phase
    transitionToScreen('plan-roadmap');
  };

  // Block 11 handlers
  const handlePlanRoadmapContinue = () => {
    console.log('🚀 Plan roadmap continue pressed - checking prerequisites');
    console.log('📋 Current state:', {
      isAuthenticated,
      hasPhotoUri: !!userData.photoUri,
      photoUri: userData.photoUri
    });
    
    // Start real analysis if we have a photo and user is authenticated
    if (isAuthenticated && userData.photoUri) {
      console.log('✅ Prerequisites met - starting real skin analysis');
      
      // First transition to analysis loading screen
      transitionToScreen('analysis-loading');
      
      // Then start the analysis after a brief delay to ensure screen transition
      setTimeout(() => {
        console.log('🔵 Initiating analysis workflow...');
        startAnalysis({
          imageUri: userData.photoUri!,
          onProgress: (progress) => {
            console.log(`📤 Analysis upload progress: ${progress.toFixed(1)}%`);
          },
          onStatusUpdate: (status, progress) => {
            console.log(`📊 Analysis status update: ${status}${progress ? ` (${progress.toFixed(1)}%)` : ''}`);
          }
        }, {
          onSuccess: (analysis) => {
            console.log('🎉 Analysis completed successfully:', {
              id: analysis.id,
              status: analysis.status,
              skinMetrics: analysis.skin_metrics ? 'Available' : 'Not available',
              imageUrl: analysis.image_url,
              createdAt: analysis.created_at
            });
            
            // Store analysis data for later use
            setUserData(prev => ({ ...prev, analysisData: analysis }));
            
            // Move to results legend after successful completion
            setTimeout(() => {
              console.log('🎯 Transitioning to results legend screen');
              transitionToScreen('results-legend');
            }, 1000); // Small delay to show completion
          },
          onError: (error) => {
            console.error('❌ Analysis failed with error details:', {
              message: error.message,
              status: error.status,
              code: error.code,
              isNetworkError: error.isNetworkError,
              isRetryable: error.isRetryable
            });
            
            Alert.alert(
              'Analysis Error', 
              `We had trouble analyzing your photo: ${error.message}. Please try again.`,
              [
                { 
                  text: 'Try Again', 
                  onPress: () => {
                    console.log('🔄 User chose to try again - returning to camera');
                    transitionToScreen('camera-preview');
                  }
                },
                { 
                  text: 'Continue Anyway', 
                  onPress: () => {
                    console.log('⏭️ User chose to continue anyway - proceeding to loading screen');
                    transitionToScreen('analysis-loading');
                  }
                }
              ]
            );
          }
        });
      }, 100); // Brief delay to ensure smooth transition
    } else {
      // No photo or not authenticated - just go to loading screen
      console.log('⚠️ Prerequisites not met:', {
        missingAuth: !isAuthenticated,
        missingPhoto: !userData.photoUri
      });
      console.log('🔄 Proceeding to loading screen for demo mode');
      transitionToScreen('analysis-loading');
    }
  };

  const handleProcessingComplete = () => {
    // Start real analysis when processing animation is done
    if (isAuthenticated && userData.photoUri) {
      console.log('🔄 Starting real analysis after processing animation');
      
      startAnalysis(
        {
          imageUri: userData.photoUri,
          onStatusUpdate: (status: string, progress?: number) => {
            console.log(`Analysis status: ${status}, progress: ${progress}%`);
          }
        },
        {
          onSuccess: (analysisResult: any) => {
            console.log('✅ Analysis completed successfully:', {
              analysisId: analysisResult.id,
              hasMetrics: !!analysisResult.skin_metrics
            });
            
            setUserData(prev => ({ ...prev, analysisData: analysisResult }));
            transitionToScreen('main-app-analysis-results');
          },
          onError: (error: any) => {
            console.error('❌ Analysis failed:', error);
            // Return to main app with error (could show error state later)
            transitionToScreen('main-app');
          }
        }
      );
    } else {
      // No photo or not authenticated - return to main app
      transitionToScreen('main-app');
    }
  };

  const handleMainAppAnalysisComplete = () => {
    // Return to main app after viewing results
    transitionToScreen('main-app');
  };

  const handleAnalysisComplete = () => {
    transitionToScreen('results-legend');
  };

  const handleResultsLegendContinue = () => {
    console.log('📊 Results legend continue - transitioning to first-analysis-view');
    console.log('Auth state:', { isAuthenticated, hasUserProfile: !!userProfile });
    transitionToScreen('first-analysis-view');
  };

  const handleBuildRoutine = () => {
    console.log('🛠️ Build routine pressed - transitioning to build-routine-intro');
    console.log('Current auth state:', { isAuthenticated, hasUserProfile: !!userProfile });
    // After viewing analysis, continue to build routine intro
    transitionToScreen('build-routine-intro');
  };

  // Block 12 handlers
  const handleBuildRoutineIntroContinue = () => {
    transitionToScreen('sun-exposure-level');
  };

  const handleSunExposureSelected = (sunExposure: 'low' | 'occasional' | 'high') => {
    setUserData(prev => ({
      ...prev,
      routinePreferences: {
        ...prev.routinePreferences,
        sunExposure
      }
    }));
    transitionToScreen('product-usage-yes-no');
  };

  const handleProductUsageSelected = (hasTriedProducts: boolean) => {
    setUserData(prev => ({
      ...prev,
      routinePreferences: {
        ...prev.routinePreferences,
        hasTriedProducts
      }
    }));
    
    if (hasTriedProducts) {
      transitionToScreen('product-effect-feedback');
    } else {
      // Skip effectiveness question and proceed to routine matching
      // No need to ask about effectiveness if they haven't tried products
      transitionToScreen('match-summary');
    }
  };

  const handleProductEffectSelected = (productEffectiveness: 'helped-lot' | 'helped-little' | 'no-effect' | 'made-worse') => {
    setUserData(prev => ({
      ...prev,
      routinePreferences: {
        ...prev.routinePreferences,
        productEffectiveness
      }
    }));
    
    // Move to routine recommendations
    transitionToScreen('match-summary');
  };

  const handleMatchSummaryContinue = () => {
    transitionToScreen('custom-routine-detail');
  };

  const handleCustomRoutineDetailBack = () => {
    transitionToScreen('match-summary', 'back');
  };

  const handleCustomRoutineDetailComplete = () => {
    // Submit onboarding data to backend before completing
    if (isAuthenticated && userData) {
      console.log('Submitting onboarding data to backend:', userData);
      
      try {
        submitUserData(userData);
        console.log('Onboarding data submitted successfully');
      } catch (error) {
        console.error('Failed to submit onboarding data:', error);
        Alert.alert(
          'Profile Save Error',
          'We had trouble saving your profile. You can continue, but your preferences may not be saved.',
          [{ text: 'Continue Anyway', onPress: () => transitionToScreen('main-app') }]
        );
        return;
      }
    }
    
    // Navigate to main app after routines are saved
    transitionToScreen('main-app');
  };

  const handleInsightsNavigation = (destination: string) => {
    if (destination === 'insights') {
      // Already on insights page
      return;
    }
    // Handle other navigation destinations from bottom nav
    console.log('Navigate to:', destination);
  };

  const handleSkinConcernsGuidePress = () => {
    console.log('Skin concerns guide pressed - would open guide overlay');
  };

  const handleValuePropContinue = () => {
    console.log('User data collected:', userData);
    // For now, loop back to start (in future, continue to main app)
    transitionToScreen('splash');
    setUserData({}); // Reset data
  };

  const handleNavigateToCamera = (context: CameraContext = 'onboarding') => {
    setCameraContext(context);
    transitionToScreen('camera-preview');
  };

  const handleSignOut = () => {
    // Reset data and go back to welcome screen
    setUserData({});
    transitionToScreen('welcome-auth');
  };

  const handleNavigateToHelp = () => {
    transitionToScreen('help-support');
  };

  const handleNavigateToPrivacy = () => {
    transitionToScreen('privacy-policy');
  };

  const handleBack = () => {
    // Enhanced back navigation for new screens
    switch (currentScreen) {
      case 'email-enter':
        transitionToScreen('welcome-auth', 'back');
        break;
      case 'email-verify':
        transitionToScreen('email-enter', 'back');
        break;
      case 'email-signin':
        transitionToScreen('welcome-auth', 'back');
        break;
      case 'value-prop-expert':
        transitionToScreen('onboarding-age', 'back');
        break;
      case 'onboarding-skincare-experience':
        transitionToScreen('value-prop-expert', 'back');
        break;
      case 'onboarding-age':
        transitionToScreen('onboarding-gender', 'back');
        break;
      case 'onboarding-gender':
        transitionToScreen('know-you-better-intro', 'back');
        break;
      case 'value-prop-database':
        transitionToScreen('onboarding-skincare-experience', 'back');
        break;
      case 'motivation-intro':
        transitionToScreen('success-understanding', 'back');
        break;
      case 'survey-statement-1':
        transitionToScreen('motivation-intro', 'back');
        break;
      case 'survey-statement-2':
        transitionToScreen('survey-statement-1', 'back');
        break;
      case 'notifications-permission':
        transitionToScreen('survey-statement-2', 'back');
        break;
      case 'trending-products-intro':
        transitionToScreen('notifications-permission', 'back');
        break;
      case 'social-proof-results':
        transitionToScreen('trending-products-intro', 'back');
        break;
      case 'success-motivations':
        transitionToScreen('social-proof-results', 'back');
        break;
      case 'skin-issues-intro':
        transitionToScreen('success-motivations', 'back');
        break;
      case 'select-top-concern':
        transitionToScreen('skin-issues-intro', 'back');
        break;
      case 'concern-duration':
        transitionToScreen('select-top-concern', 'back');
        break;
      case 'motivation-why-concern':
        transitionToScreen('concern-duration', 'back');
        break;
      case 'results-legend':
        transitionToScreen('analysis-loading', 'back');
        break;
      case 'first-analysis-view':
        transitionToScreen('results-legend', 'back');
        break;
      case 'build-routine-intro':
        transitionToScreen('first-analysis-view', 'back');
        break;
      case 'sun-exposure-level':
        transitionToScreen('build-routine-intro', 'back');
        break;
      case 'product-usage-yes-no':
        transitionToScreen('sun-exposure-level', 'back');
        break;
      case 'product-effect-feedback':
        transitionToScreen('product-usage-yes-no', 'back');
        break;
      case 'match-summary':
        transitionToScreen('product-effect-feedback', 'back');
        break;
      case 'custom-routine-detail':
        transitionToScreen('match-summary', 'back');
        break;
      case 'insights-overview':
        transitionToScreen('custom-routine-detail', 'back');
        break;
      case 'help-support':
        transitionToScreen('main-app', 'back');
        break;
      case 'privacy-policy':
        transitionToScreen('main-app', 'back');
        break;
      // Note: success-skin-issues, rating-prompt, plan-roadmap, and analysis-loading don't have back buttons
      default:
        // Handle other back cases as needed
        break;
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding-take-picture':
        return <OnboardingTakePicture onContinue={handleTakePictureContinue} />;
      case 'onboarding-get-results':
        return <OnboardingGetResults onContinue={handleGetResultsContinue} />;
      case 'onboarding-product-recommendations-preview':
        return (
          <OnboardingProductRecommendations 
            onContinue={handleProductRecommendationsContinue}
            shouldFetchData={false}
            analysisData={null}
          />
        );
      case 'onboarding-product-recommendations':
        return (
          <OnboardingProductRecommendations 
            onContinue={handleProductRecommendationsContinue}
            shouldFetchData={currentScreen === 'onboarding-product-recommendations' && !!userData.analysisData}
            analysisData={userData.analysisData}
          />
        );
      case 'onboarding-track-progress':
        return <OnboardingTrackProgress onContinue={handleTrackProgressContinue} />;
      case 'welcome-auth':
        return (
          <WelcomeAuthScreen 
            onEmailSignUp={handleEmailSignUp}
            onEmailSignIn={handleEmailSignIn}
          />
        );
      case 'capture-guidelines':
        return <CaptureGuidelines onContinue={handleCaptureGuidelinesContinue} />;
      case 'camera-preview':
        return <CameraPreview onTakePicture={handleTakePicture} />;
      case 'processing-analysis':
        return <ProcessingAnalysis onComplete={handleProcessingComplete} />;
      case 'main-app-analysis-results':
        return <FirstAnalysisView 
          analysisData={userData.analysisData} 
          onBuildRoutine={handleMainAppAnalysisComplete} 
        />;
      case 'know-you-better-intro':
        return <KnowYouBetterIntro onContinue={handleKnowYouBetterContinue} />;
      case 'onboarding-gender':
        return <OnboardingGender onContinue={handleGenderContinue} onBack={handleBack} />;
      case 'onboarding-age':
        return <OnboardingAge onContinue={handleAgeContinue} onBack={handleBack} />;
      case 'value-prop-expert':
        return <ValuePropExpertOnYou onContinue={handleValuePropExpertContinue} />;
      case 'onboarding-skincare-experience':
        return <OnboardingSkincareExperience onContinue={handleSkincareExperienceContinue} onBack={handleBack} />;
      case 'value-prop-database':
        return <ValuePropDatabase onContinue={handleValuePropDatabaseContinue} onBack={handleBack} />;
      case 'success-understanding':
        return <SuccessUnderstanding onContinue={handleSuccessUnderstandingContinue} />;
      case 'motivation-intro':
        return <MotivationIntro onContinue={handleMotivationIntro} onBack={handleBack} />;
      case 'survey-statement-1':
        return <SurveyStatementYN 
          onYes={handleSurveyStatement1Yes} 
          onNo={handleSurveyStatement1No} 
          onBack={handleBack}
          currentStep={1}
          totalSteps={3}
          questionTitle="Do you relate to this statement?"
          statementQuote="I keep trying different products but my skin never seems to improve, no matter what I do."
          statementImageKey="skinStruggles"
        />;
      case 'survey-statement-2':
        return <SurveyStatementYN 
          onYes={handleSurveyStatement2Yes} 
          onNo={handleSurveyStatement2No} 
          onBack={handleBack}
          currentStep={2}
          totalSteps={3}
          questionTitle="How about this one?"
          statementQuote="I'm so confused about which products to use and when – there are too many options out there."
          statementImageKey="confusedAboutProducts"
        />;
      case 'notifications-permission':
        return <NotificationsPermissionExplain onContinue={handleNotificationsComplete} onBack={handleBack} currentStep={3} totalSteps={3} />;
      case 'trending-products-intro':
        return <TrendingProductsIntro onContinue={handleTrendingProductsIntro} />;
      case 'social-proof-results':
        return <SocialProofResults onContinue={handleSocialProofResultsContinue} />;
      case 'success-motivations':
        return <SuccessMotivations onContinue={handleSuccessMotivationsContinue} />;
      case 'skin-issues-intro':
        return <SkinIssuesIntro onContinue={handleSkinIssuesIntroContinue} onBack={handleBack} />;
      case 'select-top-concern':
        return <SelectTopConcern onConcernSelected={handleTopConcernSelected} onBack={handleBack} />;
      case 'concern-duration':
        return <ConcernDuration onDurationSelected={handleConcernDurationSelected} onBack={handleBack} />;
      case 'motivation-why-concern':
        return <MotivationWhyConcern onMotivationSelected={handleMotivationReasonSelected} onBack={handleBack} />;
      case 'success-skin-issues':
        return <SuccessSkinIssues onContinue={handleSuccessSkinIssuesContinue} />;
      case 'rating-prompt':
        return <RatingPrompt onRateApp={handleRateApp} onDismiss={handleRatingDismiss} />;
      case 'plan-roadmap':
        return <PlanRoadmap onContinue={handlePlanRoadmapContinue} />;
      case 'analysis-loading':
        return <AnalysisLoading onComplete={handleAnalysisComplete} />;
      case 'results-legend':
        return <ResultsLegend onContinue={handleResultsLegendContinue} />;
      case 'first-analysis-view':
        return <FirstAnalysisView 
          analysisData={userData.analysisData} 
          onBuildRoutine={handleBuildRoutine} 
        />;
      case 'build-routine-intro':
        return <BuildRoutineIntro onContinue={handleBuildRoutineIntroContinue} />;
      case 'sun-exposure-level':
        return <SunExposureLevel onBack={handleBack} onOptionSelect={handleSunExposureSelected} />;
      case 'product-usage-yes-no':
        return <ProductUsageYesNo onBack={handleBack} onOptionSelect={handleProductUsageSelected} />;
      case 'product-effect-feedback':
        return <ProductEffectFeedback onBack={handleBack} onOptionSelect={handleProductEffectSelected} />;
      case 'match-summary':
        return <MatchSummary onContinue={handleMatchSummaryContinue} />;
      case 'custom-routine-detail':
        return <CustomRoutineDetail onBack={handleCustomRoutineDetailBack} onRoutinesSaved={handleCustomRoutineDetailComplete} />;
      case 'insights-overview':
        return <InsightsOverview onNavigate={handleInsightsNavigation} onBack={handleBack} />;
      case 'main-app':
        return <MainApp 
          onNavigateToCamera={() => handleNavigateToCamera('main-app')}
          onSignOut={handleSignOut}
          onNavigateToHelp={handleNavigateToHelp}
          onNavigateToPrivacy={handleNavigateToPrivacy}
        />;
      case 'user-profile':
        return <UserProfile onBack={handleBack} onSignOut={handleSignOut} />;
      case 'email-enter':
        return <EmailEnterScreen onBack={handleBack} onAccountCreated={handleAccountCreated} />;
      case 'email-verify':
        return <EmailVerifyCodeScreen email={emailForAuth} onBack={handleBack} onVerified={handleEmailVerified} />;
      case 'email-signin':
        return <EmailSignInScreen onBack={handleBack} onSignInSuccess={handleEmailSignInSuccess} />;
      case 'help-support':
        return <HelpSupportScreen onBack={handleBack} />;
      case 'privacy-policy':
        return <PrivacyPolicyScreen onBack={handleBack} />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.screenContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {renderCurrentScreen()}
        </Animated.View>
      </View>
    </ErrorBoundary>
  );
};

// Main App wrapper with providers
export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  screenContainer: {
    flex: 1,
  },
});
