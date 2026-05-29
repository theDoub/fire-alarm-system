import type { AlertSeverity, AlertStatus } from '@/types/alert';
import { colors } from '@/theme/colors';

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function severityColor(severity: AlertSeverity) {
  if (severity === 'HIGH') return colors.danger;
  if (severity === 'MEDIUM') return colors.warning;
  return colors.success;
}

export function severitySoftColor(severity: AlertSeverity) {
  if (severity === 'HIGH') return colors.dangerSoft;
  if (severity === 'MEDIUM') return colors.warningSoft;
  return colors.successSoft;
}

export function statusLabel(status: AlertStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

