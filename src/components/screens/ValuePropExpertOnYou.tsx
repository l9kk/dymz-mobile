import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BenefitChecklist } from '../design-system/molecules/BenefitChecklist';
import { PrimaryButton } from '../design-system/atoms/PrimaryButton';
import { Icon } from '../design-system/atoms/Icon';
import { colors, typography, spacing } from '../design-system/tokens';

interface ValuePropExpertOnYouProps {
  onContinue: () => void;
}

export const ValuePropExpertOnYou: React.FC<ValuePropExpertOnYouProps> = ({
  onContinue
}) => {
  const benefits = [
    {
      id: '1',
      text: 'Get personalized product recommendations based on your unique skin analysis',
      type: 'check' as const,
    },
    {
      id: '2', 
      text: 'Understand how each product affects your skin with detailed progress tracking',
      type: 'check' as const,
    },
    {
      id: '3',
      text: 'Track your skin journey with easy-to-use progress monitoring tools',
      type: 'check' as const,
    },
    {
      id: '4',
      text: 'Access to 90,000+ skincare products in our comprehensive database',
      type: 'star' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Replace phone mockup with direct icon layout */}
          <View style={styles.iconSection}>
            {/* Beautiful main icon representing personalized recommendations */}
            <View style={styles.mainRecommendationIcon}>
              <Icon 
                name="sparkles" 
                size={60} 
                color={colors.accentPalette[2]}
              />
            </View>
            
            {/* Small product category icons */}
            <View style={styles.productCategoryIcons}>
              <View style={styles.productCategoryIcon}>
                <Icon name="water-outline" size={24} color={colors.accentPalette[0]} />
              </View>
              <View style={styles.productCategoryIcon}>
                <Icon name="sunny-outline" size={24} color={colors.accentPalette[1]} />
              </View>
              <View style={styles.productCategoryIcon}>
                <Icon name="shield-checkmark-outline" size={24} color={colors.accentPalette[4]} />
              </View>
            </View>
          </View>
          
          <Text style={styles.headline}>
            You're the expert on your skin
          </Text>
          
          <BenefitChecklist 
            benefits={benefits}
            style={styles.benefitsList}
          />
          
          <PrimaryButton 
            title="Let's do it!"
            onPress={onContinue}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.xl,
  },
  mainRecommendationIcon: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 40,
    padding: spacing.l,
    marginBottom: spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productCategoryIcons: {
    flexDirection: 'row',
    gap: spacing.m,
    justifyContent: 'center',
  },
  productCategoryIcon: {
    backgroundColor: colors.surfaceNeutral,
    borderRadius: 20,
    padding: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headline: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.regular,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.tight * typography.fontSizes.displayL,
    marginBottom: spacing.xl,
  },
  benefitsList: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  button: {
    width: '100%',
  },
}); 