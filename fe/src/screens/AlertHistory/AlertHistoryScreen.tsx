import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlertTriangle, Clock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '@/components/common/Header';
import { Screen } from '@/components/common/Screen';
import { mockHistory } from '@/data/mockData';
import { colors, radius } from '@/theme/colors';
import type { RootStackParamList } from '@/types/navigation';
import { formatDateTime, severityColor, severitySoftColor } from '@/utils/formatters';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function AlertHistoryScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <Screen>
      <Header title="Alert History" subtitle="Audit trail for sensor activity" />
      <View style={styles.timeline}>
        <View style={styles.line} />
        {mockHistory.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={styles.timelineItem}
            onPress={() => navigation.navigate('AlertInfo', { alertId: entry.alertId })}
            activeOpacity={0.82}
          >
            <View style={[styles.dot, { backgroundColor: severityColor(entry.severity) }]}>
              <AlertTriangle size={18} color={colors.white} />
            </View>
            <View style={styles.card}>
              <View style={styles.badgeRow}>
                <Text style={[styles.severityBadge, { backgroundColor: severitySoftColor(entry.severity), color: severityColor(entry.severity) }]}>
                  {entry.severity}
                </Text>
                <Text style={styles.eventBadge}>{entry.eventType}</Text>
              </View>
              <Text style={styles.deviceName}>{entry.deviceName}</Text>
              <View style={styles.timeRow}>
                <Clock size={14} color={colors.textMuted} />
                <Text style={styles.time}>{formatDateTime(entry.createdAt)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  timeline: {
    position: 'relative',
  },
  line: {
    backgroundColor: colors.border,
    bottom: 0,
    left: 19,
    position: 'absolute',
    top: 0,
    width: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  dot: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
    zIndex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flex: 1,
    padding: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  severityBadge: {
    borderRadius: radius.pill,
    fontSize: 11,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  eventBadge: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    color: colors.slate,
    fontSize: 11,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  deviceName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  timeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 7,
  },
  time: {
    color: colors.textMuted,
    fontSize: 12,
  },
});

