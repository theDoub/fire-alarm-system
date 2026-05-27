/**
 * screens/DeviceInfo/DeviceInfoScreen.tsx
 * Mockup: devices-info-page.png
 * Detail panel for a single ESP32 node + Cooking Mode mute duration toggle.
 * API: GET /api/devices/:id | PATCH /api/devices/:id/cooking-mode | POST /api/suppressions
 */
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { deviceService } from '@/api/deviceService';
import { useSuppression } from '@/hooks/useSuppression';
import type { Device } from '@/types/device';
import type { RootStackParamList } from '@/types/navigation';
import type { MuteDuration } from '@/types/suppression';
import { MUTE_DURATION_OPTIONS } from '@/types/suppression';

type Route = RouteProp<RootStackParamList, 'DeviceInfo'>;

export function DeviceInfoScreen() {
  const { params } = useRoute<Route>();
  const { activateCookingMode, deactivateCookingMode, isLoading: mutating } = useSuppression();
  const [device, setDevice] = useState<Device | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<MuteDuration>(30);

  useEffect(() => {
    deviceService.getDevice(params.deviceId).then(setDevice);
  }, [params.deviceId]);

  if (!device) return <ActivityIndicator style={{ flex: 1 }} color="#e94560" />;

  const handleCookingModeToggle = async (enabled: boolean) => {
    if (enabled) {
      await activateCookingMode(device.id, selectedDuration);
    }
    // If disabling, find and delete the active suppression
    // TODO: fetch active suppression ID and call deactivateCookingMode(id)
    setDevice((prev) => prev ? { ...prev, isMuted: enabled } : prev);
  };

  return (
    <View style={styles.container}>
      {/* TODO: Implement full UI from devices-info-page.png mockup */}
      <Text style={styles.title}>{device.name}</Text>
      <Text style={styles.subtitle}>{device.location} • {device.macAddress}</Text>

      {/* Cooking Mode Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🍳 Cooking Mode</Text>
        <Switch
          value={device.isMuted}
          onValueChange={handleCookingModeToggle}
          trackColor={{ true: '#ffc107', false: '#333' }}
        />
        <Text style={styles.label}>Mute Duration</Text>
        <View style={styles.durationRow}>
          {MUTE_DURATION_OPTIONS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.durationChip, selectedDuration === d && styles.durationChipActive]}
              onPress={() => setSelectedDuration(d)}
            >
              <Text style={styles.durationText}>{d} min</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 24 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 13, marginBottom: 24 },
  section: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16 },
  sectionTitle: { color: '#ffc107', fontWeight: '700', fontSize: 16, marginBottom: 12 },
  label: { color: '#aaa', fontSize: 13, marginTop: 16, marginBottom: 8 },
  durationRow: { flexDirection: 'row', gap: 8 },
  durationChip: { backgroundColor: '#0f0f2e', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  durationChipActive: { backgroundColor: '#ffc107' },
  durationText: { color: '#fff', fontWeight: '600' },
});
