/**
 * screens/AlertHistory/AlertHistoryScreen.tsx
 * Mockup: alert-history-page.png
 * Granular log auditing with device ID filter and pagination.
 * API: GET /api/alerts/history?deviceId=&severity=&page= → alertHistoryService.getHistory()
 */
import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import { useAlertHistory } from '@/hooks/useAlertHistory';
import type { AlertHistoryEntry } from '@/types/alert';
import type { AlertsStackParamList } from '@/types/navigation';

type Route = RouteProp<AlertsStackParamList, 'AlertsHistory'>;

export function AlertHistoryScreen() {
  const { params } = useRoute<Route>();
  const { data, isLoading, loadNextPage } = useAlertHistory({ deviceId: params?.deviceId, page: 0, size: 20 });

  const renderEntry = ({ item }: { item: AlertHistoryEntry }) => (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: item.severity === 'HIGH' ? '#e94560' : item.severity === 'MEDIUM' ? '#ffc107' : '#4caf50' }]} />
      <View style={styles.rowContent}>
        <Text style={styles.deviceName}>{item.deviceName}</Text>
        <Text style={styles.event}>{item.eventType}</Text>
        <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      <Text style={styles.severity}>{item.severity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* TODO: Implement full UI from alert-history-page.png mockup */}
      <Text style={styles.header}>Alert History {params?.deviceId ? `• ${params.deviceId}` : ''}</Text>
      {isLoading && !data ? <ActivityIndicator color="#e94560" /> : (
        <FlatList
          data={data?.content ?? []}
          keyExtractor={(e) => e.id}
          renderItem={renderEntry}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.3}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 16 },
  header: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a2e', borderRadius: 10, padding: 12, marginBottom: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  rowContent: { flex: 1 },
  deviceName: { color: '#fff', fontWeight: '600', fontSize: 14 },
  event: { color: '#aaa', fontSize: 12 },
  time: { color: '#555', fontSize: 11 },
  severity: { color: '#888', fontSize: 11, fontWeight: '600' },
});
