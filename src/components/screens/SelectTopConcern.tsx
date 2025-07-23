import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { 
  BackButton, 
  LinearProgressStepper, 
  EmphasisHeadline 
} from '../design-system/atoms';
import { 
  PillTagWrapGrid 
} from '../design-system/molecules';
import { SecondaryLinkArrow, ForwardCircleFAB } from '../design-system/atoms';
import { colors, spacing } from '../design-system/tokens';

interface SelectTopConcernProps {
  onBack?: () => void;
  onConcernSelected?: (concern: string) => void;
  onGuidePress?: () => void;
}

export const SelectTopConcern: React.FC<SelectTopConcernProps> = ({
  onBack,
  onConcernSelected,
  onGuidePress,
}) => {
  const { t } = useTranslation();
  const [selectedConcern, setSelectedConcern] = useState<string>();

  const SKIN_CONCERNS = [
    t('selectTopConcern.concerns.acne'),
    t('selectTopConcern.concerns.blackheads'),
    t('selectTopConcern.concerns.dryness'),
    t('selectTopConcern.concerns.oilySkin'),
    t('selectTopConcern.concerns.darkSpots'),
    t('selectTopConcern.concerns.redness'),
    t('selectTopConcern.concerns.fineLines'),
    t('selectTopConcern.concerns.largePores'),
    t('selectTopConcern.concerns.sensitivity'),
    t('selectTopConcern.concerns.unevenTexture')
  ];

  const handleConcernPress = (concern: string) => {
    console.log('🎯 Concern pressed:', concern);
    setSelectedConcern(concern);
    console.log('✅ Selected concern state updated to:', concern);
  };

  const handleNext = () => {
    console.log('🚀 ForwardCircleFAB pressed, selectedConcern:', selectedConcern);
    if (selectedConcern) {
      console.log('✅ Calling onConcernSelected with:', selectedConcern);
      onConcernSelected?.(selectedConcern);
    } else {
      console.log('❌ No concern selected, not calling onConcernSelected');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
        </View>

        <View style={styles.progressContainer}>
          <LinearProgressStepper 
            currentStep={9}
            totalSteps={12}
          />
        </View>

        <View style={styles.content}>
          <EmphasisHeadline 
            parts={[t('selectTopConcern.titlePart1'), t('selectTopConcern.titlePart2')]}
            accentIndices={[1]}
            style={styles.title}
          />
          
          <Text style={styles.subtitle}>
            {t('selectTopConcern.subtitle')}
          </Text>

          <View style={styles.pillContainer}>
            <PillTagWrapGrid
              options={SKIN_CONCERNS}
              selectedOption={selectedConcern}
              onOptionPress={handleConcernPress}
            />
          </View>

        </View>
      </ScrollView>
      
      <ForwardCircleFAB
        visible={!!selectedConcern}
        onPress={handleNext}
      />
      {/* Debug info */}
      {(() => {
        console.log('🔍 FAB visible:', !!selectedConcern, 'selectedConcern:', selectedConcern);
        return null;
      })()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for FAB
  },
  header: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
  },
  progressContainer: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xl,
  },
  title: {
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  pillContainer: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: spacing.l,
  },
}); 