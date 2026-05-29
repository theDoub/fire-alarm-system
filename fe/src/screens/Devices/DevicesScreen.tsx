/**
 * screens/Devices/DevicesScreen.tsx
 * Mockup: devices-page.png
 * Asset overview list of all registered ESP32 nodes.
 * API: GET /api/devices → deviceService.getDevices()
 */
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDevices } from '@/hooks/useDevices';
import type { Device } from '@/types/device';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// NativeStackNavigationProp is correctly from @react-navigation/native-stack
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function DevicesScreen() {
  const { devices, isLoading, error } = useDevices();
  const navigation = useNavigation<Nav>();

  const renderDevice = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DeviceInfo', { deviceId: item.id })}
    >
      <View style={[styles.statusDot, { backgroundColor: item.status === 'ONLINE' ? '#4caf50' : '#e94560' }]} />
      <View style={styles.cardContent}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceLocation}>{item.location}</Text>
        {item.isMuted && <Text style={styles.cookingBadge}>🍳 Cooking Mode Active</Text>}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} color="#e94560" />;

  return (
    <View style={styles.container}>
      {/* TODO: Implement full UI from devices-page.png mockup — add FAB for CreateDevice */}
      <Text style={styles.header}>Devices ({devices.length})</Text>
      <FlatList data={devices} keyExtractor={(d) => d.id} renderItem={renderDevice} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 16 },
  header: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 16 },
  card: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  cardContent: { flex: 1 },
  deviceName: { color: '#fff', fontWeight: '600', fontSize: 16 },
  deviceLocation: { color: '#888', fontSize: 13, marginTop: 2 },
  cookingBadge: { color: '#ffc107', fontSize: 12, marginTop: 4 },
});
