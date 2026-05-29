/**
 * screens/AlertHistory/AlertHistoryDetailScreen.tsx
 * Detail view for a single historical alert log entry.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';

type Route = RouteProp<RootStackParamList, 'AlertHistoryDetail'>;

export function AlertHistoryDetailScreen() {
  const { params } = useRoute<Route>();
  const { entry } = params;

  return (
    <ScrollView style={styles.container}>
      {/* TODO: Implement detailed history entry layout */}
      <Text style={styles.title}>{entry.deviceName}</Text>
      <Text style={styles.label}>Event Type</Text>
      <Text style={styles.value}>{entry.eventType}</Text>
      <Text style={styles.label}>Severity</Text>
      <Text style={styles.value}>{entry.severity}</Text>
      <Text style={styles.label}>Timestamp</Text>
      <Text style={styles.value}>{new Date(entry.createdAt).toLocaleString()}</Text>
      {entry.sensorData && (
        <>
          <Text style={styles.label}>Sensor Snapshot</Text>
          <Text style={styles.value}>{JSON.stringify(entry.sensorData, null, 2)}</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 24 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 20 },
  label: { color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, marginTop: 16 },
  value: { color: '#fff', fontSize: 15 },
});
