/**
 * api/endpoints.ts
 * Single source of truth for every Spring Boot route (Khang's controllers).
 * Update here if backend paths change — nothing else needs to change.
 */

// ── AuthController  /api/auth ──────────────────────────────────────────────
export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
} as const;

// ── DeviceController  /api/devices ────────────────────────────────────────
export const DEVICES = {
  LIST: '/devices',
  DETAIL: (id: string) => `/devices/${id}`,
  CREATE: '/devices',
  UPDATE: (id: string) => `/devices/${id}`,
  DELETE: (id: string) => `/devices/${id}`,
  /** Cooking Mode toggle — PATCH /api/devices/:id/cooking-mode */
  TOGGLE_COOKING_MODE: (id: string) => `/devices/${id}/cooking-mode`,
} as const;

// ── AlertController  /api/alerts ──────────────────────────────────────────
export const ALERTS = {
  /** Live / active hazard instances */
  LIVE: '/alerts',
  DETAIL: (id: string) => `/alerts/${id}`,
  /** Acknowledge a single alert */
  ACKNOWLEDGE: (id: string) => `/alerts/${id}/acknowledge`,
} as const;

// ── AlertHistoryController  /api/alerts/history ───────────────────────────
export const ALERT_HISTORY = {
  /** Paginated logs — supports ?deviceId=&severity=&page=&size= */
  LIST: '/alerts/history',
  DETAIL: (id: string) => `/alerts/history/${id}`,
} as const;

// ── AlertSuppressionController  /api/suppressions ─────────────────────────
export const SUPPRESSIONS = {
  LIST: '/suppressions',
  CREATE: '/suppressions',          // body: { device_id, mute_until }
  DETAIL: (id: string) => `/suppressions/${id}`,
  UPDATE: (id: string) => `/suppressions/${id}`,
  DELETE: (id: string) => `/suppressions/${id}`,
} as const;
