import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../hooks/useTranslation';
import { PrimaryButton } from '../design-system/atoms/PrimaryButton';
import { BackButton } from '../design-system/atoms/BackButton';
import { colors, spacing, typography } from '../design-system/tokens';
import { useEmailSignUp } from '../../hooks/api/useAuth';

interface EmailEnterScreenProps {
  onBack: () => void;
  onAccountCreated: (email: string, password: string, needsVerification: boolean) => void;
}

export const EmailEnterScreen: React.FC<EmailEnterScreenProps> = ({ onBack, onAccountCreated }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: signUpWithEmail, isPending } = useEmailSignUp();
  const [error, setError] = useState<string | null>(null);

  const handleCreateAccount = () => {
    // Basic validation
    if (!email.includes('@')) {
      setError(t('auth.emailEnter.errors.invalidEmail'));
      return;
    }
    if (!password || password.length < 6) {
      setError(t('auth.emailEnter.errors.passwordTooShort'));
      return;
    }
    
    setError(null);
    
    // Create account with email and password
    signUpWithEmail({ email, password }, {
      onSuccess: (result) => {
        if (result.success) {
          // Pass email, password, and whether verification is needed
          onAccountCreated(email, password, result.needsVerification || false);
        } else {
          setError(result.error || t('auth.emailEnter.errors.failedToCreate'));
        }
      },
      onError: (e: any) => {
        setError(e?.message || t('auth.emailEnter.errors.failedToCreate'));
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{t('auth.emailEnter.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.emailEnter.subtitle')}</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('auth.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder={t('auth.emailEnter.passwordPlaceholder')}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          {error && <Text style={styles.error}>{error}</Text>}
          
          <PrimaryButton
            title={isPending ? t('auth.emailEnter.creatingAccount') : t('auth.emailEnter.createAccount')}
            onPress={handleCreateAccount}
            disabled={isPending}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.l,
    paddingHorizontal: spacing.l,
  },
  title: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  inputContainer: {
    width: '100%',
    gap: spacing.m,
  },
  input: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.surfaceNeutral,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
});

export default EmailEnterScreen; 