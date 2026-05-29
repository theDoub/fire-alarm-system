/**
 * types/navigation.ts — React Navigation param list types
 * All screen routes and their params in one place.
 */
import type { Alert, AlertHistoryEntry } from './alert';

// ── Auth Stack ─────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// ── App (Authenticated) Root Stack ────────────────────────────────────────
export type RootStackParamList = {
  MainTabs: undefined;
  /** Full-screen danger modal — alert-info-page.png */
  AlertInfo: { alertId: string };
  /** Device detail & mute toggle — devices-info-page.png */
  DeviceInfo: { deviceId: string };
  /** Single history entry detail */
  AlertHistoryDetail: { entry: AlertHistoryEntry };
};

// ── Bottom Tab Navigator ───────────────────────────────────────────────────
export type MainTabParamList = {
  Home: undefined;
  Alerts: undefined;
  Devices: undefined;
  History: undefined;
  Profile: undefined;
};

// ── Alerts nested stack (tabs inside Alerts screen) ───────────────────────
export type AlertsStackParamList = {
  AlertsOverview: undefined;          // alerts-page-all.png
  AlertsHistory: { deviceId?: string }; // alert-history-page.png
};
