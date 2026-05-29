/**
 * screens/Login/LoginScreen.tsx
 * Mockup: login-page.png
 * Premium UI/UX Login Screen with form validations and modern styling.
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
import { useAuth } from '@/contexts/AuthContext';
import Icon from 'react-native-vector-icons/Feather';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Field focus states for dynamic border highlights
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Error states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address (e.g. user@example.com)');
      isValid = false;
    } else {
      setEmailError(null);
    }

    // Password validation (min 6 characters)
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError(null);
    }

    return isValid;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      // RootNavigator automatically switches to AppStack upon successful auth
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Invalid email or password. Please try again.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardContainer}>
            {/* Branded Logo & Headers */}
            <View style={styles.headerContainer}>
              <View style={styles.logoBadge}>
                <Icon name="shield" size={40} color="#e94560" />
              </View>
              <Text style={styles.title}>Smart Fire Alarm</Text>
              <Text style={styles.subtitle}>Secure real-time home monitoring & alerts</Text>
            </View>

            {/* Server Error Banner */}
            {serverError && (
              <View style={styles.serverErrorBanner}>
                <Icon name="alert-triangle" size={20} color="#ff6b6b" style={styles.bannerIcon} />
                <Text style={styles.serverErrorText}>{serverError}</Text>
              </View>
            )}

            {/* Form Fields */}
            <View style={styles.form}>
              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    isEmailFocused && styles.inputWrapperFocused,
                    emailError ? styles.inputWrapperError : null,
                  ]}
                >
                  <Icon
                    name="mail"
                    size={18}
                    color={emailError ? '#ff6b6b' : isEmailFocused ? '#e94560' : '#646e82'}
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#646e82"
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (emailError) setEmailError(null);
                    }}
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

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    isPasswordFocused && styles.inputWrapperFocused,
                    passwordError ? styles.inputWrapperError : null,
                  ]}
                >
                  <Icon
                    name="lock"
                    size={18}
                    color={passwordError ? '#ff6b6b' : isPasswordFocused ? '#e94560' : '#646e82'}
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#646e82"
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      if (passwordError) setPasswordError(null);
                    }}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.eyeToggle}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.6}
                  >
                    <Icon
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color="#646e82"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <View style={styles.btnContent}>
                    <Text style={styles.buttonText}>Sign In to Dashboard</Text>
                    <Icon name="arrow-right" size={18} color="#ffffff" style={styles.btnArrow} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  cardContainer: {
    backgroundColor: '#16162a',
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#242445',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#261b2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9456033',
  },
  title: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#8f94a5',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  serverErrorBanner: {
    backgroundColor: '#301525',
    borderColor: '#ff6b6b55',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  bannerIcon: {
    marginRight: 12,
  },
  serverErrorText: {
    color: '#ff8b8b',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#e94560',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingLeft: 2,
  },
  inputWrapper: {
    backgroundColor: '#0f0f24',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#242445',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: '#e94560',
    backgroundColor: '#0f0f24',
  },
  inputWrapperError: {
    borderColor: '#ff6b6b',
    backgroundColor: '#1b0e14',
  },
  fieldIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    height: '100%',
  },
  eyeToggle: {
    padding: 4,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    paddingLeft: 4,
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    elevation: 4,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  btnArrow: {
    marginLeft: 8,
  },
});
