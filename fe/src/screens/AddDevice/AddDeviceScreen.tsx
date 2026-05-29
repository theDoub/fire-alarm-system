/**
 * screens/AddDevice/AddDeviceScreen.tsx
 * Provision a new ESP32 hardware node.
 * Calls deviceService.createDevice() — works in mock mode and with real backend.
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
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { deviceService } from '@/api/deviceService';
import type { RootStackParamList } from '@/types/navigation';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

// MAC address pattern: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
const MAC_REGEX = /^([0-9A-Fa-f]{2}[:\-]){5}([0-9A-Fa-f]{2})$/;

// Auto-format MAC address as user types
function formatMac(raw: string): string {
  const cleaned = raw.replace(/[^0-9A-Fa-f]/g, '').toUpperCase().slice(0, 12);
  return cleaned.match(/.{1,2}/g)?.join(':') ?? cleaned;
}

export function AddDeviceScreen() {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();

  const [deviceName, setDeviceName] = useState('');
  const [location, setLocation] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedDeviceName, setAddedDeviceName] = useState('');

  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [isMacFocused, setIsMacFocused] = useState(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [macError, setMacError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    let valid = true;

    if (!deviceName.trim() || deviceName.trim().length < 2) {
      setNameError('Device name must be at least 2 characters');
      valid = false;
    } else {
      setNameError(null);
    }

    if (!location.trim() || location.trim().length < 2) {
      setLocationError('Location must be at least 2 characters');
      valid = false;
    } else {
      setLocationError(null);
    }

    const normalizedMac = macAddress.replace(/-/g, ':');
    if (!macAddress.trim()) {
      setMacError('MAC address is required');
      valid = false;
    } else if (!MAC_REGEX.test(normalizedMac)) {
      setMacError('Enter a valid MAC address (e.g. AA:BB:CC:DD:EE:FF)');
      valid = false;
    } else {
      setMacError(null);
    }

    return valid;
  };

  const handleAddDevice = async () => {
    Keyboard.dismiss();
    setServerError(null);
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const created = await deviceService.createDevice({
        name: deviceName.trim(),
        location: location.trim(),
        macAddress: macAddress.toUpperCase(),
      });
      setAddedDeviceName(created.name);
      setShowSuccess(true);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Failed to add device. Please try again.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMacChange = (text: string) => {
    const formatted = formatMac(text);
    setMacAddress(formatted);
    if (macError) setMacError(null);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigation.goBack();
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* ── Success Modal ── */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconRing}>
              <Feather name="check" size={40} color="#22c55e" />
            </View>
            <Text style={styles.successTitle}>Device Added!</Text>
            <Text style={styles.successSubtitle}>
              <Text style={styles.successDeviceName}>{addedDeviceName}</Text>
              {' '}has been provisioned and is now online.
            </Text>
            <TouchableOpacity style={styles.successBtn} onPress={handleSuccessClose} activeOpacity={0.85}>
              <Text style={styles.successBtnText}>Go to Devices</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={22} color="#e94560" />
          </TouchableOpacity>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerTitle}>Add New Device</Text>
            <Text style={styles.headerSubtitle}>Provision an ESP32 sensor node</Text>
          </View>
          <View style={styles.headerIconBadge}>
            <Feather name="cpu" size={22} color="#e94560" />
          </View>
        </LinearGradient>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Info Banner */}
              <View style={styles.infoBanner}>
                <Feather name="info" size={16} color="#6366f1" style={{ marginRight: 10, marginTop: 1 }} />
                <Text style={styles.infoText}>
                  Make sure your ESP32 node is powered on and in pairing mode before registering.
                </Text>
              </View>

              {/* Error Banner */}
              {serverError && (
                <View style={styles.errorBanner}>
                  <Feather name="alert-triangle" size={16} color="#e53e3e" style={{ marginRight: 10 }} />
                  <Text style={styles.errorBannerText}>{serverError}</Text>
                </View>
              )}

              {/* Form Card */}
              <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Device Information</Text>
                <Text style={styles.sectionSubtitle}>Enter the details of your new sensor node</Text>

                {/* Device Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>DEVICE NAME</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      isNameFocused && styles.inputWrapperFocused,
                      nameError ? styles.inputWrapperError : null,
                    ]}
                  >
                    <View style={[styles.iconBadge, nameError ? styles.iconBadgeError : isNameFocused ? styles.iconBadgeActive : null]}>
                      <Feather name="tag" size={16} color={nameError ? '#e53e3e' : isNameFocused ? '#e94560' : '#718096'} />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Kitchen Smoke Detector"
                      placeholderTextColor="#4a5568"
                      value={deviceName}
                      onChangeText={(v) => { setDeviceName(v); if (nameError) setNameError(null); }}
                      onFocus={() => setIsNameFocused(true)}
                      onBlur={() => setIsNameFocused(false)}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                  {nameError && <Text style={styles.fieldErrorText}>{nameError}</Text>}
                </View>

                {/* Location */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>LOCATION</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      isLocationFocused && styles.inputWrapperFocused,
                      locationError ? styles.inputWrapperError : null,
                    ]}
                  >
                    <View style={[styles.iconBadge, locationError ? styles.iconBadgeError : isLocationFocused ? styles.iconBadgeActive : null]}>
                      <Feather name="map-pin" size={16} color={locationError ? '#e53e3e' : isLocationFocused ? '#e94560' : '#718096'} />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. First Floor Kitchen"
                      placeholderTextColor="#4a5568"
                      value={location}
                      onChangeText={(v) => { setLocation(v); if (locationError) setLocationError(null); }}
                      onFocus={() => setIsLocationFocused(true)}
                      onBlur={() => setIsLocationFocused(false)}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                  {locationError && <Text style={styles.fieldErrorText}>{locationError}</Text>}
                </View>

                {/* MAC Address */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>MAC ADDRESS</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      isMacFocused && styles.inputWrapperFocused,
                      macError ? styles.inputWrapperError : null,
                    ]}
                  >
                    <View style={[styles.iconBadge, macError ? styles.iconBadgeError : isMacFocused ? styles.iconBadgeActive : null]}>
                      <Feather name="wifi" size={16} color={macError ? '#e53e3e' : isMacFocused ? '#e94560' : '#718096'} />
                    </View>
                    <TextInput
                      style={[styles.input, styles.macInput]}
                      placeholder="AA:BB:CC:DD:EE:FF"
                      placeholderTextColor="#4a5568"
                      value={macAddress}
                      onChangeText={handleMacChange}
                      onFocus={() => setIsMacFocused(true)}
                      onBlur={() => setIsMacFocused(false)}
                      autoCapitalize="characters"
                      autoCorrect={false}
                      keyboardType="default"
                      maxLength={17}
                    />
                  </View>
                  {macError && <Text style={styles.fieldErrorText}>{macError}</Text>}
                  <Text style={styles.macHint}>
                    Find the MAC address printed on your ESP32 hardware label
                  </Text>
                </View>
              </View>

              {/* Feature Preview */}
              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>What happens next?</Text>
                {[
                  { icon: 'zap', text: 'Device connects to the IoT gateway via MQTT' },
                  { icon: 'activity', text: 'Real-time smoke & CO₂ telemetry begins streaming' },
                  { icon: 'bell', text: 'Alerts will fire if thresholds are exceeded' },
                  { icon: 'shield', text: 'Device is covered by TCVN fire-safety compliance' },
                ].map((item, i) => (
                  <View key={i} style={styles.featureRow}>
                    <View style={styles.featureIcon}>
                      <Feather name={item.icon as any} size={14} color="#e94560" />
                    </View>
                    <Text style={styles.featureText}>{item.text}</Text>
                  </View>
                ))}
              </View>

              {/* Submit */}
              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleAddDevice}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#e94560', '#c0392b']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <View style={styles.submitContent}>
                      <Feather name="plus-circle" size={20} color="#fff" style={{ marginRight: 10 }} />
                      <Text style={styles.submitText}>Register Device</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2a3a',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(233,69,96,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  headerTitleBlock: { flex: 1 },
  headerTitle: { color: '#ffffff', fontSize: 18, fontFamily: 'Inter-Bold' },
  headerSubtitle: { color: '#8892a4', fontSize: 12, fontFamily: 'Inter-Medium', marginTop: 2 },
  headerIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(233,69,96,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoid: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },

  infoBanner: {
    backgroundColor: 'rgba(99,102,241,0.12)',
    borderColor: 'rgba(99,102,241,0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoText: { color: '#a5b4fc', fontSize: 13, fontFamily: 'Inter-Medium', flex: 1, lineHeight: 20 },

  errorBanner: {
    backgroundColor: 'rgba(229,62,62,0.1)',
    borderColor: 'rgba(229,62,62,0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorBannerText: { color: '#fc8181', fontSize: 13, fontFamily: 'Inter-Medium', flex: 1, lineHeight: 18 },

  formCard: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e2a3a',
  },
  sectionTitle: { color: '#ffffff', fontSize: 17, fontFamily: 'Inter-Bold', marginBottom: 4 },
  sectionSubtitle: { color: '#8892a4', fontSize: 13, fontFamily: 'Inter-Medium', marginBottom: 20 },

  inputGroup: { marginBottom: 18 },
  inputLabel: {
    color: '#8892a4',
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#0f1923',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e2a3a',
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  inputWrapperFocused: { borderColor: '#e94560', backgroundColor: '#111827' },
  inputWrapperError: { borderColor: '#e53e3e', backgroundColor: '#1a0a0a' },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1e2a3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconBadgeActive: { backgroundColor: 'rgba(233,69,96,0.15)' },
  iconBadgeError: { backgroundColor: 'rgba(229,62,62,0.15)' },
  input: { flex: 1, color: '#e2e8f0', fontSize: 15, fontFamily: 'Inter-Medium', height: '100%' },
  macInput: { letterSpacing: 1, fontFamily: 'Inter-Bold', fontSize: 14 },
  fieldErrorText: { color: '#fc8181', fontSize: 12, fontFamily: 'Inter-Medium', marginTop: 5 },
  macHint: { color: '#4a5568', fontSize: 11, fontFamily: 'Inter-Medium', marginTop: 6 },

  featureCard: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1e2a3a',
  },
  featureTitle: { color: '#ffffff', fontSize: 15, fontFamily: 'Inter-Bold', marginBottom: 14 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(233,69,96,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: { color: '#8892a4', fontSize: 13, fontFamily: 'Inter-Medium', flex: 1, lineHeight: 20 },

  submitButton: { borderRadius: 16, overflow: 'hidden', marginBottom: 8 },
  submitButtonDisabled: { opacity: 0.6 },
  submitGradient: { height: 58, justifyContent: 'center', alignItems: 'center' },
  submitContent: { flexDirection: 'row', alignItems: 'center' },
  submitText: { color: '#ffffff', fontSize: 17, fontFamily: 'Inter-Bold', letterSpacing: 0.4 },

  // Success Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successCard: {
    backgroundColor: '#16213e',
    borderRadius: 28,
    padding: 36,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#22c55e44',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  successIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 2,
    borderColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: { color: '#ffffff', fontSize: 22, fontFamily: 'Inter-ExtraBold', marginBottom: 10 },
  successSubtitle: { color: '#8892a4', fontSize: 14, fontFamily: 'Inter-Medium', textAlign: 'center', lineHeight: 22 },
  successDeviceName: { color: '#22c55e', fontFamily: 'Inter-Bold' },
  successBtn: {
    backgroundColor: '#e94560',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 24,
  },
  successBtnText: { color: '#ffffff', fontSize: 15, fontFamily: 'Inter-Bold' },
});
