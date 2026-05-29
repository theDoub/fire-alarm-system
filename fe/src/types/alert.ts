/**
 * types/alert.ts — Alert domain types (Level 1 / 2 / 3 multi-tier system)
 */

/** Maps to backend severity: LOW=Level 1, MEDIUM=Level 2, HIGH=Level 3 */
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceLocation: string;
  severity: AlertSeverity;
  status: AlertStatus;
  /** Sensor readings snapshot at alert time */
  sensorData: {
    smokeLevel?: number;
    temperature?: number;
    co2Level?: number;
  };
  triggeredAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

/** Immutable log entry from AlertHistoryController */
export interface AlertHistoryEntry {
  id: string;
  alertId: string;
  deviceId: string;
  deviceName: string;
  severity: AlertSeverity;
  eventType: 'TRIGGERED' | 'ACKNOWLEDGED' | 'RESOLVED' | 'SUPPRESSED';
  sensorData: Alert['sensorData'];
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
