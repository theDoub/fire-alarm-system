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

export function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Field focus states for figma style borders
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Validation & Server Error states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Figma/RFC Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
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
      // Upon successful login, navigation guard automatically transitions to AppStack
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Invalid email or password. Please try again.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#ef4444', '#ea580c']}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor="#ef4444" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingTop: insets.top > 0 ? insets.top + 20 : 40, paddingBottom: insets.bottom + 24 }
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentWrapper}>
              {/* Figma Style Header Badge & Logo */}
              <View style={styles.headerContainer}>
                <View style={styles.logoBadge}>
                  <Feather name="shield" size={44} color="#ef4444" />
                </View>
                <Text style={styles.title}>Smart Fire Alert</Text>
                <Text style={styles.subtitle}>Stay safe, stay protected</Text>
              </View>

              {/* Figma Style White Form Card Container */}
              <View style={styles.formCard}>
                {serverError && (
                  <View style={styles.serverErrorBanner}>
                    <Feather name="alert-triangle" size={18} color="#e53e3e" style={styles.bannerIcon} />
                    <Text style={styles.serverErrorText}>{serverError}</Text>
                  </View>
                )}

                <View style={styles.form}>
                  {/* Email Address Group */}
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

                  {/* Password Group */}
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
                        placeholder="••••••••"
                        placeholderTextColor="#a0aec0"
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
                        <Feather
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={18}
                          color="#a0aec0"
                        />
                      </TouchableOpacity>
                    </View>
                    {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                  </View>

                  {/* Submit Action Button */}
                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>Login</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7} onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {/* Create Account */}
              <View style={styles.registerRow}>
                <Text style={styles.registerPrompt}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
                  <Text style={styles.registerLink}>Create Account</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Support Footer */}
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
  gradientContainer: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 4,
  },
  subtitle: {
    color: '#ffd2d9',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 36,
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
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerIcon: {
    marginRight: 10,
  },
  serverErrorText: {
    color: '#c53030',
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
    color: '#4a5568',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
    paddingLeft: 2,
  },
  inputWrapper: {
    backgroundColor: '#f7fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: '#e53e3e',
    backgroundColor: '#ffffff',
  },
  inputWrapperError: {
    borderColor: '#e53e3e',
    backgroundColor: '#fff5f5',
  },
  fieldIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#1a202c',
    fontSize: 15,
    fontWeight: '500',
    height: '100%',
  },
  eyeToggle: {
    padding: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    paddingLeft: 4,
  },
  button: {
    backgroundColor: '#ef4444',
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  forgotBtn: {
    marginTop: 20,
    alignSelf: 'center',
  },
  forgotText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  emergencyFooter: {
    color: '#ffd2d9',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 32,
  },
  boldFooter: {
    color: '#ffffff',
    fontWeight: '800',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerPrompt: {
    color: '#ffd2d9',
    fontSize: 13,
    fontWeight: '500',
  },
  registerLink: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});
