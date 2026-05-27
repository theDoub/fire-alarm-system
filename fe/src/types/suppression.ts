/**
 * types/suppression.ts — AlertSuppression (Cooking Mode) domain types
 */

export interface Suppression {
  id: string;
  deviceId: string;
  deviceName: string;
  /** Whether the mute timer is currently active */
  isMuted: boolean;
  /** ISO-8601 datetime when the mute expires */
  muteUntil: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSuppressionPayload {
  device_id: string;
  /** ISO-8601 datetime */
  mute_until: string;
}

export interface UpdateSuppressionPayload {
  mute_until: string;
}

/** Duration options for the UI toggle picker (in minutes) */
export const MUTE_DURATION_OPTIONS = [15, 30, 60, 120] as const;
export type MuteDuration = (typeof MUTE_DURATION_OPTIONS)[number];
