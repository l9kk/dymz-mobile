import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../design-system/atoms/PrimaryButton';
import { BackButton } from '../design-system/atoms/BackButton';
import { colors, spacing, typography } from '../design-system/tokens';
import { useOTPVerify, useOTPSignIn } from '../../hooks/api/useAuth';

interface EmailVerifyCodeScreenProps {
  email: string;
  onBack: () => void;
  onVerified: () => void;
}

export const EmailVerifyCodeScreen: React.FC<EmailVerifyCodeScreenProps> = ({ email, onBack, onVerified }) => {
  const [code, setCode] = useState('');
  const { mutate: verifyOtp, isPending } = useOTPVerify();
  const { mutate: resendOtp, isPending: isResending } = useOTPSignIn();
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60); // 1 minute countdown
  const [canResend, setCanResend] = useState(false);

  // Start countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerify = () => {
    if (code.length !== 6) {
      setError('Enter 6-digit code');
      return;
    }
    setError(null);
    verifyOtp({ email, token: code }, {
      onSuccess: (result) => {
        if (result.success) {
          onVerified();
        } else {
          setError(result.error || 'Invalid code');
        }
      },
      onError: (e: any) => setError(e?.message || 'Invalid code'),
    });
  };

  const handleResend = () => {
    if (!canResend || isResending) return;
    
    resendOtp({ email }, {
      onSuccess: () => {
        setResendTimer(60); // Reset timer to 1 minute
        setCanResend(false);
        setError(null);
      },
      onError: (e: any) => {
        setError(e?.message || 'Failed to resend code');
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Verify Code</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code we sent to {'\n'}{email}</Text>
          <TextInput
            style={styles.input}
            placeholder="123456"
            keyboardType="numeric"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            placeholderTextColor={colors.textSecondary}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <PrimaryButton
            title={isPending ? 'Verifying…' : 'Verify'}
            onPress={handleVerify}
            disabled={isPending}
            style={{ width: '100%' }}
          />
          <TouchableOpacity 
            disabled={!canResend || isResending} 
            onPress={handleResend} 
            style={[styles.resendLink, (!canResend || isResending) && styles.resendDisabled]}
          >
            <Text style={[styles.resendText, (!canResend || isResending) && styles.resendDisabledText]}>
              {isResending 
                ? 'Resending…' 
                : canResend 
                  ? 'Resend code' 
                  : `Resend in ${formatTime(resendTimer)}`
              }
            </Text>
          </TouchableOpacity>
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
    maxWidth: 300,
  },
  input: {
    width: '60%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.surfaceNeutral,
  },
  resendLink: {
    marginTop: spacing.m,
  },
  resendText: {
    color: colors.ctaBackground,
    fontSize: 14,
  },
  resendDisabled: {
    opacity: 0.5,
  },
  resendDisabledText: {
    color: colors.textSecondary,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    marginBottom: spacing.s,
  },
});

export default EmailVerifyCodeScreen; 