/**
 * screens/ForgotPassword/ForgotPasswordScreen.tsx
 * Password recovery flow — two-step: enter email → enter OTP + new password.
 * Mock mode: accepts any email, simulates success instantly.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { AuthStackParamList } from '@/types/navigation';

type NavProp = NativeStackNavigationProp<AuthStackParamList>;

type Step = 'email' | 'otp';

export function ForgotPasswordScreen() {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isOtpFocused, setIsOtpFocused] = useState(false);
  const [isNewPwFocused, setIsNewPwFocused] = useState(false);
  const [isConfirmPwFocused, setIsConfirmPwFocused] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [newPwError, setNewPwError] = useState<string | null>(null);
  const [confirmPwError, setConfirmPwError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSendOtp = async () => {
    Keyboard.dismiss();
    setServerError(null);
    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError(null);
    setIsLoading(true);
    try {
      // Mock: simulate OTP sent successfully
      await new Promise(resolve => setTimeout(resolve, 1200));
      setSuccessMsg(`A 6-digit reset code was sent to ${email.trim()}`);
      setStep('otp');
    } catch (e: any) {
      setServerError(e?.response?.data?.message ?? 'Failed to send reset code. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    Keyboard.dismiss();
    setServerError(null);
    let valid = true;

    if (!otp.trim() || otp.trim().length < 4) {
      setOtpError('Please enter the 6-digit code');
      valid = false;
    } else {
      setOtpError(null);
    }
    if (!newPassword || newPassword.length < 6) {
      setNewPwError('Password must be at least 6 characters');
      valid = false;
    } else {
      setNewPwError(null);
    }
    if (newPassword !== confirmPassword) {
      setConfirmPwError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPwError(null);
    }
    if (!valid) return;

    setIsLoading(true);
    try {
      // Mock: simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1200));
      setSuccessMsg('Password reset successful! You can now sign in.');
      setTimeout(() => navigation.navigate('Login'), 2000);
    } catch (e: any) {
      setServerError(e?.response?.data?.message ?? 'Reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#ef4444', '#ea580c']} style={styles.gradientContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#ef4444" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingTop: insets.top > 0 ? insets.top + 16 : 40, paddingBottom: insets.bottom + 24 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentWrapper}>
              {/* Back Button */}
              <TouchableOpacity
                style={[styles.backBtn, { top: insets.top > 0 ? insets.top + 4 : 20 }]}
                onPress={() => (step === 'otp' ? setStep('email') : navigation.navigate('Login'))}
                activeOpacity={0.7}
              >
                <Feather name="arrow-left" size={22} color="#ffffff" />
              </TouchableOpacity>

              {/* Header */}
              <View style={styles.headerContainer}>
                <View style={styles.logoBadge}>
                  <Feather name={step === 'email' ? 'key' : 'check-circle'} size={38} color="#ef4444" />
                </View>
                <Text style={styles.title}>
                  {step === 'email' ? 'Forgot Password' : 'Enter Reset Code'}
                </Text>
                <Text style={styles.subtitle}>
                  {step === 'email'
                    ? "Enter your email and we'll send a reset code"
                    : 'Check your email for the 6-digit code'}
                </Text>
              </View>

              {/* Form Card */}
              <View style={styles.formCard}>
                {serverError && (
                  <View style={styles.serverErrorBanner}>
                    <Feather name="alert-triangle" size={16} color="#e53e3e" style={styles.bannerIcon} />
                    <Text style={styles.serverErrorText}>{serverError}</Text>
                  </View>
                )}
                {successMsg && (
                  <View style={styles.successBanner}>
                    <Feather name="check-circle" size={16} color="#276749" style={styles.bannerIcon} />
                    <Text style={styles.successText}>{successMsg}</Text>
                  </View>
                )}

                {step === 'email' ? (
                  /* ── Step 1: Email ── */
                  <View style={styles.form}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          isEmailFocused && styles.inputWrapperFocused,
                          emailError ? styles.inputWrapperError : null,
                        ]}
                      >
                        <Feather
                          name="mail"
                          size={18}
                          color={emailError ? '#e53e3e' : isEmailFocused ? '#ef4444' : '#a0aec0'}
                          style={styles.fieldIcon}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="your@email.com"
                          placeholderTextColor="#a0aec0"
                          value={email}
                          onChangeText={(v) => { setEmail(v); if (emailError) setEmailError(null); }}
                          onFocus={() => setIsEmailFocused(true)}
                          onBlur={() => setIsEmailFocused(false)}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="email-address"
                          autoComplete="email"
                        />
                      </View>
                      {emailError && <Text style={styles.errorText}>{emailError}</Text>}
                    </View>

                    <TouchableOpacity
                      style={[styles.button, isLoading && styles.buttonDisabled]}
                      onPress={handleSendOtp}
                      disabled={isLoading}
                      activeOpacity={0.9}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#ffffff" size="small" />
                      ) : (
                        <View style={styles.btnContent}>
                          <Feather name="send" size={16} color="#fff" style={{ marginRight: 8 }} />
                          <Text style={styles.buttonText}>Send Reset Code</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* ── Step 2: OTP + New Password ── */
                  <View style={styles.form}>
                    {/* OTP Code */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>6-DIGIT RESET CODE</Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          isOtpFocused && styles.inputWrapperFocused,
                          otpError ? styles.inputWrapperError : null,
                        ]}
                      >
                        <Feather
                          name="hash"
                          size={18}
                          color={otpError ? '#e53e3e' : isOtpFocused ? '#ef4444' : '#a0aec0'}
                          style={styles.fieldIcon}
                        />
                        <TextInput
                          style={[styles.input, styles.otpInput]}
                          placeholder="• • • • • •"
                          placeholderTextColor="#a0aec0"
                          value={otp}
                          onChangeText={(v) => { setOtp(v); if (otpError) setOtpError(null); }}
                          onFocus={() => setIsOtpFocused(true)}
                          onBlur={() => setIsOtpFocused(false)}
                          keyboardType="number-pad"
                          maxLength={6}
                        />
                      </View>
                      {otpError && <Text style={styles.errorText}>{otpError}</Text>}
                    </View>

                    {/* New Password */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>NEW PASSWORD</Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          isNewPwFocused && styles.inputWrapperFocused,
                          newPwError ? styles.inputWrapperError : null,
                        ]}
                      >
                        <Feather
                          name="lock"
                          size={18}
                          color={newPwError ? '#e53e3e' : isNewPwFocused ? '#ef4444' : '#a0aec0'}
                          style={styles.fieldIcon}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Min. 6 characters"
                          placeholderTextColor="#a0aec0"
                          value={newPassword}
                          onChangeText={(v) => { setNewPassword(v); if (newPwError) setNewPwError(null); }}
                          onFocus={() => setIsNewPwFocused(true)}
                          onBlur={() => setIsNewPwFocused(false)}
                          secureTextEntry={!showNewPw}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        <TouchableOpacity onPress={() => setShowNewPw(!showNewPw)} style={styles.eyeToggle} activeOpacity={0.6}>
                          <Feather name={showNewPw ? 'eye-off' : 'eye'} size={18} color="#a0aec0" />
                        </TouchableOpacity>
                      </View>
                      {newPwError && <Text style={styles.errorText}>{newPwError}</Text>}
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>CONFIRM NEW PASSWORD</Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          isConfirmPwFocused && styles.inputWrapperFocused,
                          confirmPwError ? styles.inputWrapperError : null,
                        ]}
                      >
                        <Feather
                          name="shield"
                          size={18}
                          color={confirmPwError ? '#e53e3e' : isConfirmPwFocused ? '#ef4444' : '#a0aec0'}
                          style={styles.fieldIcon}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Repeat your new password"
                          placeholderTextColor="#a0aec0"
                          value={confirmPassword}
                          onChangeText={(v) => { setConfirmPassword(v); if (confirmPwError) setConfirmPwError(null); }}
                          onFocus={() => setIsConfirmPwFocused(true)}
                          onBlur={() => setIsConfirmPwFocused(false)}
                          secureTextEntry={!showConfirmPw}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPw(!showConfirmPw)} style={styles.eyeToggle} activeOpacity={0.6}>
                          <Feather name={showConfirmPw ? 'eye-off' : 'eye'} size={18} color="#a0aec0" />
                        </TouchableOpacity>
                      </View>
                      {confirmPwError && <Text style={styles.errorText}>{confirmPwError}</Text>}
                    </View>

                    <TouchableOpacity
                      style={[styles.button, isLoading && styles.buttonDisabled]}
                      onPress={handleResetPassword}
                      disabled={isLoading}
                      activeOpacity={0.9}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#ffffff" size="small" />
                      ) : (
                        <View style={styles.btnContent}>
                          <Feather name="check" size={16} color="#fff" style={{ marginRight: 8 }} />
                          <Text style={styles.buttonText}>Reset Password</Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* Resend */}
                    <TouchableOpacity
                      style={styles.resendBtn}
                      onPress={() => { setStep('email'); setOtp(''); setSuccessMsg(null); }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.resendText}>Didn't receive the code? Resend</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Footer */}
                <View style={styles.loginRow}>
                  <Text style={styles.loginPrompt}>Remember your password? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.emergencyFooter}>
                Emergency? Call <Text style={styles.boldFooter}>114</Text> immediately
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  keyboardAvoid: { flex: 1, backgroundColor: 'transparent' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 },
  contentWrapper: { width: '100%', alignItems: 'center' },
  backBtn: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    padding: 8,
  },
  headerContainer: { alignItems: 'center', marginBottom: 28, marginTop: 24 },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  title: { color: '#ffffff', fontSize: 26, fontFamily: 'Inter-ExtraBold', textAlign: 'center', marginVertical: 4 },
  subtitle: { color: '#ffd2d9', fontSize: 13, textAlign: 'center', fontFamily: 'Inter-Medium', paddingHorizontal: 8 },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  serverErrorBanner: {
    backgroundColor: '#fff5f5',
    borderColor: '#fed7d7',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  successBanner: {
    backgroundColor: '#f0fff4',
    borderColor: '#9ae6b4',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerIcon: { marginRight: 10 },
  serverErrorText: { color: '#c53030', fontSize: 13, fontFamily: 'Inter-Medium', flex: 1, lineHeight: 18 },
  successText: { color: '#276749', fontSize: 13, fontFamily: 'Inter-Medium', flex: 1, lineHeight: 18 },
  form: { width: '100%' },
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    color: '#4a5568',
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1.2,
    marginBottom: 7,
    paddingLeft: 2,
  },
  inputWrapper: {
    backgroundColor: '#f7fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  inputWrapperFocused: { borderColor: '#e53e3e', backgroundColor: '#ffffff' },
  inputWrapperError: { borderColor: '#e53e3e', backgroundColor: '#fff5f5' },
  fieldIcon: { marginRight: 10 },
  input: { flex: 1, color: '#1a202c', fontSize: 15, fontFamily: 'Inter-Medium', height: '100%' },
  otpInput: { letterSpacing: 6, fontSize: 18, fontFamily: 'Inter-Bold' },
  eyeToggle: { padding: 4 },
  errorText: { color: '#ef4444', fontSize: 12, fontFamily: 'Inter-Medium', marginTop: 5, paddingLeft: 4 },
  button: {
    backgroundColor: '#ef4444',
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.65 },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#ffffff', fontFamily: 'Inter-Bold', fontSize: 16, letterSpacing: 0.5 },
  resendBtn: { marginTop: 16, alignSelf: 'center' },
  resendText: { color: '#ef4444', fontSize: 13, fontFamily: 'Inter-Medium' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginPrompt: { color: '#718096', fontSize: 13, fontFamily: 'Inter-Medium' },
  loginLink: { color: '#ef4444', fontSize: 13, fontFamily: 'Inter-Bold' },
  emergencyFooter: { color: '#ffd2d9', fontSize: 13, textAlign: 'center', marginTop: 28, fontFamily: 'Inter-Medium' },
  boldFooter: { color: '#ffffff', fontFamily: 'Inter-Bold' },
});
