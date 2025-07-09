import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleAvatarCluster } from '../design-system/molecules/CircleAvatarCluster';
import { PrimaryButton } from '../design-system/atoms/PrimaryButton';
import { colors, typography, spacing } from '../design-system/tokens';

interface KnowYouBetterIntroProps {
  onContinue: () => void;
}

export const KnowYouBetterIntro: React.FC<KnowYouBetterIntroProps> = ({
  onContinue
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Let's get to know you better
        </Text>
        
        <Text style={styles.subtitle}>
          A few quick questions will help us personalize your skincare recommendations
        </Text>
        
        <CircleAvatarCluster 
          caption="Join 50,000+ users on their skincare journey"
          style={styles.avatarCluster}
        />
        
        <Text style={styles.bodyCopy}>
          Our AI has helped over 50,000 people discover their perfect skincare routine and achieve healthier, more radiant skin.
        </Text>
        
        <PrimaryButton 
          title="Let's do it!" 
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
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
    marginBottom: spacing.m,
  },
  subtitle: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
    marginBottom: spacing.l,
    paddingHorizontal: spacing.m,
  },
  avatarCluster: {
    marginVertical: spacing.xl,
  },
  bodyCopy: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.body,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.m,
  },
  button: {
    width: '100%',
  },
}); 