/**
 * utils/alertHelpers.ts
 * Pure utility functions for the multi-tier alert system.
 */
import type { AlertSeverity } from '@/types/alert';

/** Maps AlertSeverity enum to human-readable level names */
export const SEVERITY_LEVEL_MAP: Record<AlertSeverity, string> = {
  LOW: 'Level 1 — Safe',
  MEDIUM: 'Level 2 — Warning',
  HIGH: 'Level 3 — Danger',
};

export const SEVERITY_COLOR_MAP: Record<AlertSeverity, string> = {
  LOW: '#4caf50',
  MEDIUM: '#ffc107',
  HIGH: '#e94560',
};

/** Returns overall system safety level from active alert array */
export function computeSystemSafetyLevel(severities: AlertSeverity[]): 1 | 2 | 3 {
  if (severities.includes('HIGH')) return 3;
  if (severities.includes('MEDIUM')) return 2;
  return 1;
}

/** Formats a mute expiry timestamp to a user-friendly countdown string */
export function formatMuteCountdown(muteUntil: string): string {
  const remaining = new Date(muteUntil).getTime() - Date.now();
  if (remaining <= 0) return 'Expired';
  const minutes = Math.ceil(remaining / 60_000);
  return `${minutes} min remaining`;
}
