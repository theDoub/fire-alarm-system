/**
 * screens/Alerts/AlertsScreen.tsx
 * Mockup: alerts-page-all / alerts-page-low / alerts-page-medium / alerts-page-high
 * Multi-tier incident center with 4 severity tabs.
 * API: GET /api/alerts?severity= → alertService.getAlerts()
 */
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAlerts } from '@/hooks/useAlerts';
import type { AlertSeverity, Alert } from '@/types/alert';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS: Array<{ label: string; severity?: AlertSeverity }> = [
  { label: 'All' },
  { label: 'Low', severity: 'LOW' },
  { label: 'Medium', severity: 'MEDIUM' },
  { label: 'High', severity: 'HIGH' },
];

const SEVERITY_COLOR: Record<AlertSeverity, string> = {
  LOW: '#4caf50',
  MEDIUM: '#ffc107',
  HIGH: '#e94560',
};

export function AlertsScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState(0);
  const { alerts, isLoading, setFilter } = useAlerts();

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setFilter(TABS[index].severity);
  };

  const renderAlert = ({ item }: { item: Alert }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AlertInfo', { alertId: item.id })}
    >
      <View style={[styles.severityBar, { backgroundColor: SEVERITY_COLOR[item.severity] }]} />
      <View style={styles.cardContent}>
        <Text style={styles.deviceName}>{item.deviceName}</Text>
        <Text style={styles.location}>{item.deviceLocation}</Text>
        <Text style={styles.time}>{new Date(item.triggeredAt).toLocaleString()}</Text>
      </View>
      <Text style={[styles.badge, { color: SEVERITY_COLOR[item.severity] }]}>{item.severity}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* TODO: Implement full tab UI from alerts-page-*.png mockups */}
      <View style={styles.tabBar}>
        {TABS.map((tab, i) => (
          <TouchableOpacity key={tab.label} style={[styles.tab, activeTab === i && styles.tabActive]} onPress={() => handleTabChange(i)}>
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading ? <ActivityIndicator color="#e94560" style={{ marginTop: 40 }} /> : (
        <FlatList data={alerts} keyExtractor={(a) => a.id} renderItem={renderAlert} contentContainerStyle={{ padding: 16 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  tabBar: { flexDirection: 'row', backgroundColor: '#1a1a2e', paddingHorizontal: 16, paddingTop: 8 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#e94560' },
  tabText: { color: '#555', fontWeight: '600' },
  tabTextActive: { color: '#e94560' },
  card: { backgroundColor: '#1a1a2e', borderRadius: 12, marginBottom: 10, flexDirection: 'row', overflow: 'hidden' },
  severityBar: { width: 4 },
  cardContent: { flex: 1, padding: 14 },
  deviceName: { color: '#fff', fontWeight: '600', fontSize: 15 },
  location: { color: '#888', fontSize: 13, marginTop: 2 },
  time: { color: '#555', fontSize: 11, marginTop: 4 },
  badge: { padding: 14, fontWeight: '700', fontSize: 11 },
});
