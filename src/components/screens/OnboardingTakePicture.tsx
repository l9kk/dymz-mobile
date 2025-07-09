import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Icon } from '../design-system/atoms/Icon';
import { PrimaryButton } from '../design-system/atoms/PrimaryButton';
import { colors, typography, spacing } from '../design-system/tokens';

interface OnboardingTakePictureProps {
  onContinue?: () => void;
}

export const OnboardingTakePicture: React.FC<OnboardingTakePictureProps> = ({ onContinue }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon 
            name="camera" 
            size={80} 
            color={colors.accentPalette[2]}
          />
        </View>
        
        <Text style={styles.title}>
          Take a selfie to analyze your skin
        </Text>
        
        <Text style={styles.subtitle}>
          Capture a clear photo in good lighting. Make sure your face is well-lit and centered in the frame.
        </Text>
        
        <PrimaryButton 
          title="Continue" 
          onPress={onContinue}
          style={styles.button}
        />
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
    gap: spacing.l,
  },
  iconContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 50,
    padding: spacing.l,
    marginBottom: spacing.m,
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
    marginTop: spacing.m,
  },
  subtitle: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
    marginHorizontal: spacing.m,
  },
  button: {
    marginTop: spacing.l,
    width: '100%',
  },
}); 