import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const SKIN_CONCERNS = [
  'Acne',
  'Blackheads',
  'Dryness', 
  'Oily Skin',
  'Dark Spots',
  'Redness',
  'Fine Lines',
  'Large Pores',
  'Sensitivity',
  'Uneven Texture'
];

export const SelectTopConcern: React.FC<SelectTopConcernProps> = ({
  onBack,
  onConcernSelected,
  onGuidePress,
}) => {
  const [selectedConcern, setSelectedConcern] = useState<string>();

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
            parts={["What's your biggest", "skin concern?"]}
            accentIndices={[1]}
            style={styles.title}
          />
          
          <Text style={styles.subtitle}>
            Pick the one area you'd most like to improve. We'll prioritize 
            this in your personalized routine.
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