/**
 * components/common/DeviceStatusChip.tsx
 * Reusable online/offline status indicator for ESP32 nodes.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DeviceStatus } from '@/types/device';

interface Props {
  status: DeviceStatus;
}

const STATUS_COLOR: Record<DeviceStatus, string> = {
  ONLINE: '#4caf50',
  OFFLINE: '#888',
  ERROR: '#e94560',
};

export function DeviceStatusChip({ status }: Props) {
  const color = STATUS_COLOR[status];
  return (
    <View style={[styles.chip, { borderColor: color, backgroundColor: color + '22' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4 },
  dot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 5 },
  text: { fontSize: 11, fontWeight: '700' },
});
