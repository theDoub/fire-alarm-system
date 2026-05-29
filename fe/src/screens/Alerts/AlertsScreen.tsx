import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '@/components/common/Header';
import { Screen } from '@/components/common/Screen';
import { mockAlerts } from '@/data/mockData';
import { colors, radius } from '@/theme/colors';
import type { AlertSeverity } from '@/types/alert';
import type { RootStackParamList } from '@/types/navigation';
import { formatDateTime, severityColor, severitySoftColor, statusLabel } from '@/utils/formatters';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Filter = 'ALL' | AlertSeverity;

const FILTERS: Array<{ label: string; value: Filter }> = [
  { label: 'All', value: 'ALL' },
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
];

export function AlertsScreen() {
  const navigation = useNavigation<Nav>();
  const [filter, setFilter] = useState<Filter>('ALL');
  const alerts = useMemo(
    () => (filter === 'ALL' ? mockAlerts : mockAlerts.filter((alert) => alert.severity === filter)),
    [filter],
  );

  return (
    <Screen>
      <Header title="Alerts" subtitle="Review active and past fire events" />
      <View style={styles.filterRow}>
        {FILTERS.map((item) => {
          const active = filter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.filterChip,
                active && styles.filterChipActive,
                active && item.value !== 'ALL' ? { backgroundColor: severityColor(item.value) } : null,
              ]}
              onPress={() => setFilter(item.value)}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {alerts.length === 0 ? (
        <View style={styles.emptyState}>
          <AlertTriangle size={34} color="#94a3b8" />
          <Text style={styles.emptyText}>No alerts found</Text>
        </View>
      ) : (
        alerts.map((alert) => (
          <TouchableOpacity
            key={alert.id}
            style={[styles.card, { borderLeftColor: severityColor(alert.severity) }]}
            onPress={() => navigation.navigate('AlertInfo', { alertId: alert.id })}
            activeOpacity={0.82}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardCopy}>
                <View style={styles.badgeRow}>
                  <Text style={[styles.severityBadge, { backgroundColor: severitySoftColor(alert.severity), color: severityColor(alert.severity) }]}>
                    {alert.severity}
                  </Text>
                  <Text style={[styles.statusBadge, alert.status === 'ACTIVE' && styles.statusActive]}>
                    {statusLabel(alert.status)}
                  </Text>
                </View>
                <Text style={styles.deviceName}>{alert.deviceName}</Text>
                <Text style={styles.location}>{alert.deviceLocation}</Text>
                <Text style={styles.time}>{formatDateTime(alert.triggeredAt)}</Text>
              </View>
              <AlertTriangle size={26} color={severityColor(alert.severity)} />
            </View>
          </TouchableOpacity>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: colors.slateDark,
  },
  filterText: {
    color: colors.slate,
    fontSize: 13,
    fontWeight: '800',
  },
  filterTextActive: {
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    color: colors.textMuted,
    marginTop: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderRadius: radius.lg,
    marginBottom: 12,
    padding: 15,
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  cardCopy: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 9,
  },
  severityBadge: {
    borderRadius: radius.pill,
    fontSize: 11,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadge: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    color: colors.slate,
    fontSize: 11,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusActive: {
    backgroundColor: colors.dangerSoft,
    color: colors.dangerDark,
  },
  deviceName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  location: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 3,
  },
  time: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 6,
  },
});

