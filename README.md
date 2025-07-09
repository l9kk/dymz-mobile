# Dymz AI Mobile App

A React Native (Expo) mobile application providing AI-powered skincare analysis and personalized routine recommendations. The app leverages Google Gemini API for skin analysis and integrates with a comprehensive skincare product database.

## ✨ Features

- 🤳 **One-Click Skin Analysis**: Upload a selfie to receive detailed skin metrics (dryness, redness, pores, hydration)
- 🧪 **AI-Powered Recommendations**: Get personalized morning & evening skincare routines
- 📊 **Progress Tracking**: Monitor your skin's improvement with before/after comparisons
- 🏆 **Gamified Experience**: Stay motivated with streak badges and achievements
- 📱 **Professional UX**: Smooth 60fps animations and intuitive interface
- 🔄 **Offline Support**: Critical functionality works without internet

## 🏗 Architecture

### Design System
- Follows Atomic Design Pattern (atoms → molecules → organisms)
- 44+ production-ready components
- Consistent design tokens for colors, typography, spacing
- Professional animations using React Native Animated API

### Key Features
1. **Authentication & Onboarding**
   - Email + password with OTP verification
   - 25-screen comprehensive user profiling

2. **AI Skin Analysis**
   - Camera integration with capture guidelines
   - Real-time processing with progress feedback
   - Detailed metrics with intuitive score display

3. **Personalized Routines**
   - Custom product recommendations
   - Morning/evening routine management
   - Progress tracking and completion gamification

4. **Progress Analytics**
   - Daily completion tracking
   - Before/after comparisons
   - Trend analysis and insights

## 📦 Project Structure

```
BlissSkinAI/
├── src/
│   ├── components/
│   │   ├── design-system/      # Atomic design components
│   │   ├── screens/            # All app screens
│   │   └── shared/             # Shared utilities
│   ├── hooks/                  # Custom React hooks
│   ├── services/               # API integration
│   ├── stores/                 # State management
│   └── utils/                  # Helper functions
├── assets/                     # Images and static files
└── App.tsx                     # Entry point
```

## 🔒 Security Features

- Secure authentication flow
- Protected API endpoints
- Safe image handling
- Proper data persistence
- Error boundaries

## 🎯 Status

- **Version**: 1.0.0