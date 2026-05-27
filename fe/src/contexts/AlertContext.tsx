/**
 * contexts/AlertContext.tsx
 * Real-time alert state driven by FCM push notifications.
 * When a HIGH severity alert arrives, the app navigates to AlertInfo screen.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Alert } from '@/types/alert';

// Firebase Messaging import — install @react-native-firebase/messaging
// import messaging from '@react-native-firebase/messaging';

interface AlertContextValue {
  activeAlerts: Alert[];
  /** The incoming danger alert (Level 3) that triggers the full-screen modal */
  incomingDangerAlert: Alert | null;
  dismissDangerAlert: () => void;
  pushActiveAlert: (alert: Alert) => void;
  removeAlert: (alertId: string) => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [incomingDangerAlert, setIncomingDangerAlert] = useState<Alert | null>(null);

  /**
   * TODO: Wire up FCM foreground handler here.
   * When a HIGH severity FCM message arrives, call pushActiveAlert().
   *
   * useEffect(() => {
   *   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
   *     const alert = mapFcmToAlert(remoteMessage.data);
   *     pushActiveAlert(alert);
   *   });
   *   return unsubscribe;
   * }, []);
   */

  const pushActiveAlert = useCallback((alert: Alert) => {
    setActiveAlerts((prev) => [alert, ...prev.filter((a) => a.id !== alert.id)]);
    if (alert.severity === 'HIGH') {
      setIncomingDangerAlert(alert);
    }
  }, []);

  const removeAlert = useCallback((alertId: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  const dismissDangerAlert = useCallback(() => setIncomingDangerAlert(null), []);

  return (
    <AlertContext.Provider
      value={{ activeAlerts, incomingDangerAlert, dismissDangerAlert, pushActiveAlert, removeAlert }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlertContext(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlertContext must be used within AlertProvider');
  return ctx;
}
