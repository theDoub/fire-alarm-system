/**
 * store/alertStore.ts
 * Zustand global store for active alert state.
 * Supplements AlertContext for cross-component access without prop drilling.
 */
import { create } from 'zustand';
import type { Alert } from '@/types/alert';

interface AlertStore {
  activeAlerts: Alert[];
  unreadCount: number;
  setActiveAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  markAllRead: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  activeAlerts: [],
  unreadCount: 0,

  setActiveAlerts: (alerts) =>
    set({ activeAlerts: alerts, unreadCount: alerts.length }),

  addAlert: (alert) =>
    set((state) => ({
      activeAlerts: [alert, ...state.activeAlerts.filter((a) => a.id !== alert.id)],
      unreadCount: state.unreadCount + 1,
    })),

  removeAlert: (id) =>
    set((state) => ({
      activeAlerts: state.activeAlerts.filter((a) => a.id !== id),
    })),

  markAllRead: () => set({ unreadCount: 0 }),
}));
