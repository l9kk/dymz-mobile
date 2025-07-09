import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../design-system/atoms/PrimaryButton';
import { BackButton } from '../design-system/atoms/BackButton';
import { colors, spacing, typography } from '../design-system/tokens';
import { useEmailSignIn } from '../../hooks/api/useAuth';

interface EmailSignInScreenProps {
  onBack: () => void;
  onSignInSuccess: () => void;
  onForgotPassword?: () => void;
}

export const EmailSignInScreen: React.FC<EmailSignInScreenProps> = ({ 
  onBack, 
  onSignInSuccess,
  onForgotPassword 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: signInWithEmail, isPending } = useEmailSignIn();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = () => {
    // Basic validation
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError(null);
    signInWithEmail({ email, password }, {
      onSuccess: (result) => {
        if (result.success) {
          onSignInSuccess();
        } else {
          setError(result.error || 'Failed to sign in');
        }
      },
      onError: (e: any) => {
        setError(e?.message || 'Failed to sign in');
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
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
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
            title={isPending ? 'Signing in…' : 'Sign In'}
            onPress={handleSignIn}
            disabled={isPending}
            style={styles.signInButton}
          />
          
          {onForgotPassword && (
            <TouchableOpacity onPress={onForgotPassword} style={styles.forgotPasswordLink}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          )}
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
  signInButton: {
    width: '100%',
  },
  forgotPasswordLink: {
    marginTop: spacing.m,
  },
  forgotPasswordText: {
    color: colors.ctaBackground,
    fontSize: typography.fontSizes.body,
    textAlign: 'center',
  },
});

export default EmailSignInScreen; 