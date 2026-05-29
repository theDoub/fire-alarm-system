/**
 * screens/DeviceInfo/DeviceInfoScreen.tsx
 * Mockup: devices-info-page.png
 * Detail panel for a single ESP32 node + Cooking Mode mute duration toggle.
 * API: GET /api/devices/:id | PATCH /api/devices/:id/cooking-mode | POST /api/suppressions
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deviceService } from '@/api/deviceService';
import type { Device } from '@/types/device';
import type { RootStackParamList } from '@/types/navigation';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DisableAlertModal from './DisableAlertModal';

type Route = RouteProp<RootStackParamList, 'DeviceInfo'>;

export function DeviceInfoScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);

  // Countdown timer state (seconds left)
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDevice = async () => {
    try {
      const data = await deviceService.getDevice(params.deviceId);
      setDevice(data);
    } catch (e: any) {
      Alert.alert('Error', 'Failed to retrieve hardware node telemetry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevice();
  }, [params.deviceId]);

  // Implement the Automatic Countdown Timer (Core Cooking Logic)
  useEffect(() => {
    if (device?.isMuted && device?.muteUntil) {
      const targetTime = new Date(device.muteUntil).getTime();

      const updateTimer = () => {
        const remaining = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleCountdownExpiry();
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    } else {
      setTimeLeft(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [device?.isMuted, device?.muteUntil]);

  const handleCountdownExpiry = async () => {
    if (!device) return;
    try {
      const updated = await deviceService.toggleCookingMode(device.id, { enabled: false });
      setDevice(updated);
      Alert.alert(
        'Safety Restored',
        'Cooking Mode has expired. Real-time fire and smoke safety monitoring is now active on this node.'
      );
    } catch (e) {
      console.error('Failed to auto-reset cooking mode:', e);
    }
  };

  const handleDeactivateCookingMode = async () => {
    if (!device) return;
    try {
      setIsLoading(true);
      const updated = await deviceService.toggleCookingMode(device.id, { enabled: false });
      setDevice(updated);
      Alert.alert('Success', 'Safety monitoring restored. Real-time alerts are active.');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to restore alerts.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDisable = async (durationMinutes: number) => {
    if (!device) return;
    try {
      setIsLoading(true);
      const muteUntil = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
      const updated = await deviceService.toggleCookingMode(device.id, {
        enabled: true,
        muteUntil,
      });
      setDevice(updated);
      Alert.alert(
        'Cooking Mode Enabled',
        `Alerts muted for this device for the next ${durationMinutes} minutes.`
      );
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to activate Cooking Mode.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePower = async () => {
    if (!device) return;
    try {
      setIsLoading(true);
      const nextStatus = device.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
      const updated = await deviceService.updateDevice(device.id, {
        status: nextStatus,
      } as any);
      setDevice(updated);
      Alert.alert(
        'Power Status Updated',
        `Device is now ${nextStatus === 'ONLINE' ? 'switched ON' : 'switched OFF'}.`
      );
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to toggle power.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDevice = () => {
    if (!device) return;
    Alert.alert(
      'Remove Device',
      `Are you sure you want to permanently remove "${device.name}" from your network? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deviceService.deleteDevice(device.id);
              navigation.goBack();
            } catch (e: any) {
              Alert.alert('Error', e?.message ?? 'Failed to remove device.');
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatTimeLeft = (secCount: number) => {
    const mins = Math.floor(secCount / 60);
    const secs = secCount % 60;
    if (mins > 0) {
      return `${mins} min${mins > 1 ? 's' : ''}${secs > 0 ? ` and ${secs} sec${secs > 1 ? 's' : ''}` : ''}`;
    }
    return `${secs} sec${secs > 1 ? 's' : ''}`;
  };

  if (isLoading && !device) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loaderText}>Syncing device metadata...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Device telemetry not found.</Text>
        <TouchableOpacity style={styles.backBtnText} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#ef4444', fontFamily: 'Inter-Bold' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOnline = device.status === 'ONLINE';

  return (
    <View style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Gradient Block */}
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          style={[styles.headerGradient, { paddingTop: insets.top > 0 ? insets.top + 12 : 24 }]}
        >
          {/* Circular Navigation Back Arrow */}
          <TouchableOpacity
            style={styles.backButtonCircle}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={18} color="#ffffff" />
          </TouchableOpacity>

          {/* Centered Logo and Metadata */}
          <View style={styles.logoAndTitle}>
            <View style={styles.logoIconBg}>
              <Feather name="box" size={36} color="#3b82f6" />
            </View>
            <Text style={styles.deviceName}>{device.name}</Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={12} color="#dbeafe" style={{ marginRight: 4 }} />
              <Text style={styles.deviceLocation}>{device.location}</Text>
            </View>
          </View>

          {/* Dual Network & Power Badges Grid */}
          <View style={styles.badgesGrid}>
            <View style={styles.badgeCard}>
              {isOnline ? (
                <>
                  <Feather name="wifi" size={18} color="#22c55e" style={styles.badgeIcon} />
                  <Text style={styles.badgeTitle}>Online</Text>
                </>
              ) : (
                <>
                  <Feather name="wifi-off" size={18} color="#9ca3af" style={styles.badgeIcon} />
                  <Text style={styles.badgeTitle}>Offline</Text>
                </>
              )}
            </View>
            <View style={styles.badgeCard}>
              <Feather name="power" size={18} color={isOnline ? '#22c55e' : '#9ca3af'} style={styles.badgeIcon} />
              <Text style={styles.badgeTitle}>{isOnline ? 'Active' : 'Standby'}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.bodyContent}>
          {/* Prominent Yellow Warning Notice for Cooking Mode */}
          {device.isMuted && (
            <View style={styles.noticeBanner}>
              <View style={styles.noticeIconBg}>
                <Feather name="bell-off" size={18} color="#ea580c" />
              </View>
              <View style={styles.noticeInfo}>
                <Text style={styles.noticeTitle}>Cooking Mode Active</Text>
                <Text style={styles.noticeText}>
                  Alerts Muted for the next <Text style={styles.noticeTimer}>{formatTimeLeft(timeLeft)}</Text>
                </Text>
              </View>
            </View>
          )}

          {/* Sensor Readings Card */}
          <View style={styles.infoCard}>
            <Text style={styles.cardHeaderTitle}>SENSOR READINGS</Text>
            <View style={styles.sensorGrid}>
              <View style={styles.sensorItem}>
                <View style={[styles.sensorIconBg, { backgroundColor: '#fff7ed' }]}>
                  <Feather name="wind" size={16} color="#ea580c" />
                </View>
                <View>
                  <Text style={styles.sensorLabel}>Smoke</Text>
                  <Text style={styles.sensorValue}>{isOnline ? 'Normal' : '—'}</Text>
                </View>
              </View>

              <View style={styles.sensorItem}>
                <View style={[styles.sensorIconBg, { backgroundColor: '#eff6ff' }]}>
                  <Feather name="cloud" size={16} color="#3b82f6" />
                </View>
                <View>
                  <Text style={styles.sensorLabel}>Gas</Text>
                  <Text style={styles.sensorValue}>{isOnline ? 'Normal' : '—'}</Text>
                </View>
              </View>

              <View style={styles.sensorItem}>
                <View style={[styles.sensorIconBg, { backgroundColor: '#fef2f2' }]}>
                  <Feather name="thermometer" size={16} color="#ef4444" />
                </View>
                <View>
                  <Text style={styles.sensorLabel}>Temp</Text>
                  <Text style={styles.sensorValue}>{isOnline ? '22 °C' : '—'}</Text>
                </View>
              </View>

              <View style={styles.sensorItem}>
                <View style={[styles.sensorIconBg, { backgroundColor: '#faf5ff' }]}>
                  <Feather name="volume-2" size={16} color="#a855f7" />
                </View>
                <View>
                  <Text style={styles.sensorLabel}>Sound</Text>
                  <Text style={styles.sensorValue}>{isOnline ? '45 dB' : '—'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Device Specifications Card */}
          <View style={styles.infoCard}>
            <Text style={styles.cardHeaderTitle}>DEVICE INFORMATION</Text>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Device ID</Text>
              <Text style={styles.specValue} numberOfLines={1} ellipsizeMode="middle">
                {device.id}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>MAC Address</Text>
              <Text style={styles.specValue}>{device.macAddress}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Last Telemetry Check</Text>
              <Text style={styles.specValue}>
                {new Date(device.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={[styles.specRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <Text style={styles.specLabel}>Alerts Disabled</Text>
              <Text style={[styles.specValue, device.isMuted && { color: '#ea580c', fontFamily: 'Inter-Bold' }]}>
                {device.isMuted ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>

          {/* Action Trigger Buttons */}
          <View style={styles.actionsContainer}>
            {/* Standard Power Toggle Button cleanly reflecting the safety boundary */}
            <TouchableOpacity
              style={[
                styles.primaryActionBtn,
                isOnline ? styles.powerOffBtn : styles.powerOnBtn,
              ]}
              onPress={handleTogglePower}
              activeOpacity={0.85}
            >
              <Feather name="power" size={16} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryActionText}>
                {isOnline
                  ? device.isMuted
                    ? 'Turn Off Device (Safety Mute Active)'
                    : 'Turn Off Device'
                  : 'Turn On Device'}
              </Text>
            </TouchableOpacity>

            {/* Temporarily Disable Alerts or Cancel Mute */}
            {device.isMuted ? (
              <TouchableOpacity
                style={[styles.secondaryActionBtn, styles.deactivateMuteBtn]}
                onPress={handleDeactivateCookingMode}
                activeOpacity={0.8}
              >
                <Feather name="bell" size={16} color="#374151" style={{ marginRight: 8 }} />
                <Text style={styles.deactivateMuteText}>Enable Alerts / End Cooking Mode</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.secondaryActionBtn,
                  styles.activateMuteBtn,
                  !isOnline && styles.btnDisabled,
                ]}
                onPress={() => setShowDisableModal(true)}
                disabled={!isOnline}
                activeOpacity={0.8}
              >
                <Feather name="bell-off" size={16} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.activateMuteText}>Temporarily Disable Alerts</Text>
              </TouchableOpacity>
            )}

            {/* ── Danger Zone: Delete ── */}
            <View style={styles.dangerDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dangerLabel}>DANGER ZONE</Text>
              <View style={styles.dividerLine} />
            </View>
            <TouchableOpacity
              style={[styles.deleteBtn, isDeleting && styles.btnDisabled]}
              onPress={handleDeleteDevice}
              disabled={isDeleting}
              activeOpacity={0.8}
            >
              {isDeleting ? (
                <ActivityIndicator color="#ef4444" size="small" />
              ) : (
                <>
                  <Feather name="trash-2" size={16} color="#ef4444" style={{ marginRight: 8 }} />
                  <Text style={styles.deleteBtnText}>Remove Device from Network</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* DisableAlertModal */}
      <DisableAlertModal
        visible={showDisableModal}
        deviceId={device.id}
        deviceName={device.name}
        onClose={() => setShowDisableModal(false)}
        onConfirm={handleConfirmDisable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: '#6b7280',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#ef4444',
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    marginBottom: 16,
  },
  backBtnText: {
    padding: 10,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 4,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  backButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoAndTitle: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  deviceName: {
    fontSize: 20,
    fontFamily: 'Inter-ExtraBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceLocation: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#dbeafe',
  },
  badgesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  badgeIcon: {
    marginRight: 6,
  },
  badgeTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },
  bodyContent: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  noticeBanner: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    borderWidth: 1.5,
    borderColor: '#fde68a',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  noticeIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  noticeInfo: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#b45309',
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#d97706',
  },
  noticeTimer: {
    fontFamily: 'Inter-ExtraBold',
    color: '#b45309',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderTitle: {
    fontSize: 10,
    fontFamily: 'Inter-ExtraBold',
    color: '#3b82f6',
    letterSpacing: 1.2,
    marginBottom: 16,
    paddingLeft: 2,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  sensorItem: {
    width: '47%',
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    padding: 12,
    alignItems: 'center',
  },
  sensorIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sensorLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
    marginBottom: 2,
  },
  sensorValue: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  specLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  specValue: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    maxWidth: '55%',
  },
  actionsContainer: {
    marginTop: 8,
    gap: 12,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  powerOffBtn: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  powerOnBtn: {
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
  },
  primaryActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  activateMuteBtn: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  deactivateMuteBtn: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  activateMuteText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  deactivateMuteText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  dangerDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#fecaca',
  },
  dangerLabel: {
    color: '#ef4444',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1.5,
    marginHorizontal: 10,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    backgroundColor: '#fff5f5',
  },
  deleteBtnText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ef4444',
  },
});
