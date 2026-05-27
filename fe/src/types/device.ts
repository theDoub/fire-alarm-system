/**
 * types/device.ts — ESP32 Device domain types
 */

export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'ERROR';

export interface Device {
  id: string;
  name: string;
  location: string;
  macAddress: string;
  status: DeviceStatus;
  /** True when Cooking Mode / Smart Mute is active */
  isMuted: boolean;
  muteUntil?: string; // ISO-8601
  lastSeenAt: string;
  createdAt: string;
}

export interface CreateDevicePayload {
  name: string;
  location: string;
  macAddress: string;
}

export interface UpdateDevicePayload {
  name?: string;
  location?: string;
}

export interface CookingModePayload {
  enabled: boolean;
  /** Required when enabled=true; ISO-8601 datetime */
  muteUntil?: string;
}
