/**
 * screens/Register/RegisterScreen.tsx
 * Sign-up flow — mirrors LoginScreen design language.
 * Supports mock register (stores mock_access_token) and real API.
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
import { useAuth } from '@/contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { AuthStackParamList } from '@/types/navigation';

type NavProp = NativeStackNavigationProp<AuthStackParamList>;

export function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const validateForm = (): boolean => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim() || fullName.trim().length < 2) {
      setNameError('Full name must be at least 2 characters');
      isValid = false;
    } else {
      setNameError(null);
    }

    if (!email) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (!confirmPassword) {
      setConfirmError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmError(null);
    }

    return isValid;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    setServerError(null);
    setSuccessMsg(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({ name: fullName.trim(), email: email.trim(), password });
      // AuthContext will set user → RootNavigator auto-transitions to AppStack
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Registration failed. Please try again.';
      setServerError(msg);
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
              { paddingTop: insets.top > 0 ? insets.top + 16 : 36, paddingBottom: insets.bottom + 24 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentWrapper}>
              {/* Header */}
              <View style={styles.headerContainer}>
                <View style={styles.logoBadge}>
                  <Feather name="user-plus" size={40} color="#ef4444" />
                </View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join Smart Fire Alert today</Text>
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

                <View style={styles.form}>
                  {/* Full Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>FULL NAME</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        isNameFocused && styles.inputWrapperFocused,
                        nameError ? styles.inputWrapperError : null,
                      ]}
                    >
                      <Feather
                        name="user"
                        size={18}
                        color={nameError ? '#e53e3e' : isNameFocused ? '#ef4444' : '#a0aec0'}
                        style={styles.fieldIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Your full name"
                        placeholderTextColor="#a0aec0"
                        value={fullName}
                        onChangeText={(v) => { setFullName(v); if (nameError) setNameError(null); }}
                        onFocus={() => setIsNameFocused(true)}
                        onBlur={() => setIsNameFocused(false)}
                        autoCapitalize="words"
                        autoCorrect={false}
                      />
                    </View>
                    {nameError && <Text style={styles.errorText}>{nameError}</Text>}
                  </View>

                  {/* Email */}
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

                  {/* Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>PASSWORD</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        isPasswordFocused && styles.inputWrapperFocused,
                        passwordError ? styles.inputWrapperError : null,
                      ]}
                    >
                      <Feather
                        name="lock"
                        size={18}
                        color={passwordError ? '#e53e3e' : isPasswordFocused ? '#ef4444' : '#a0aec0'}
                        style={styles.fieldIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Min. 6 characters"
                        placeholderTextColor="#a0aec0"
                        value={password}
                        onChangeText={(v) => { setPassword(v); if (passwordError) setPasswordError(null); }}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="new-password"
                      />
                      <TouchableOpacity
                        style={styles.eyeToggle}
                        onPress={() => setShowPassword(!showPassword)}
                        activeOpacity={0.6}
                      >
                        <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#a0aec0" />
                      </TouchableOpacity>
                    </View>
                    {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                  </View>

                  {/* Confirm Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        isConfirmFocused && styles.inputWrapperFocused,
                        confirmError ? styles.inputWrapperError : null,
                      ]}
                    >
                      <Feather
                        name="shield"
                        size={18}
                        color={confirmError ? '#e53e3e' : isConfirmFocused ? '#ef4444' : '#a0aec0'}
                        style={styles.fieldIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Repeat your password"
                        placeholderTextColor="#a0aec0"
                        value={confirmPassword}
                        onChangeText={(v) => { setConfirmPassword(v); if (confirmError) setConfirmError(null); }}
                        onFocus={() => setIsConfirmFocused(true)}
                        onBlur={() => setIsConfirmFocused(false)}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        style={styles.eyeToggle}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        activeOpacity={0.6}
                      >
                        <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={18} color="#a0aec0" />
                      </TouchableOpacity>
                    </View>
                    {confirmError && <Text style={styles.errorText}>{confirmError}</Text>}
                  </View>

                  {/* Submit */}
                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>Create Account</Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Navigate back to Login */}
                <View style={styles.loginRow}>
                  <Text style={styles.loginPrompt}>Already have an account? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.7}
                  >
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
  headerContainer: { alignItems: 'center', marginBottom: 28 },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  title: { color: '#ffffff', fontSize: 26, fontFamily: 'Inter-ExtraBold', textAlign: 'center', marginVertical: 4 },
  subtitle: { color: '#ffd2d9', fontSize: 14, textAlign: 'center', fontFamily: 'Inter-Medium' },
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
  buttonText: { color: '#ffffff', fontFamily: 'Inter-Bold', fontSize: 16, letterSpacing: 0.5 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginPrompt: { color: '#718096', fontSize: 13, fontFamily: 'Inter-Medium' },
  loginLink: { color: '#ef4444', fontSize: 13, fontFamily: 'Inter-Bold' },
  emergencyFooter: { color: '#ffd2d9', fontSize: 13, textAlign: 'center', marginTop: 28, fontFamily: 'Inter-Medium' },
  boldFooter: { color: '#ffffff', fontFamily: 'Inter-Bold' },
});
