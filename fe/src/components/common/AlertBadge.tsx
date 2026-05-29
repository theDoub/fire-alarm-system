/**
 * components/common/AlertBadge.tsx
 * Reusable colored badge for alert severity levels.
 * Level 1 (LOW) = green | Level 2 (MEDIUM) = amber | Level 3 (HIGH) = red
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { AlertSeverity } from '@/types/alert';

interface Props {
  severity: AlertSeverity;
  size?: 'sm' | 'md';
}

const COLORS: Record<AlertSeverity, string> = {
  LOW: '#4caf50',
  MEDIUM: '#ffc107',
  HIGH: '#e94560',
};

const LABELS: Record<AlertSeverity, string> = {
  LOW: 'Level 1 — Safe',
  MEDIUM: 'Level 2 — Warning',
  HIGH: 'Level 3 — Danger',
};

export function AlertBadge({ severity, size = 'md' }: Props) {
  const color = COLORS[severity];
  const small = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }, small && styles.small]}>
      <View style={[styles.dot, { backgroundColor: color }, small && styles.dotSmall]} />
      <Text style={[styles.label, { color }, small && styles.labelSmall]}>
        {small ? severity : LABELS[severity]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },
  small: { paddingHorizontal: 7, paddingVertical: 3 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  dotSmall: { width: 6, height: 6, marginRight: 4 },
  label: { fontWeight: '700', fontSize: 12 },
  labelSmall: { fontSize: 10 },
});
