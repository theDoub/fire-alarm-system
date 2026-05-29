/**
 * api/alertService.ts
 * Interfaces with original AlertController mappings.
 * Bypasses lack of global alerts endpoint by querying device-scoped alerts in parallel.
 * Maps acknowledgment to Khang's original PATCH /alerts/{id}/status contract.
 */
import client from './client';
import type { Alert, AlertSeverity } from '@/types/alert';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AlertsFilter = {
  severity?: AlertSeverity;
  deviceId?: string;
};

export const alertService = {
  /**
   * Fetches active/historic alerts.
   * Intercepts mock session locally to bypass 403.
   */
  async getAlerts(filter?: AlertsFilter): Promise<Alert[]> {
    const token = await AsyncStorage.getItem('access_token');
    if (token === 'mock_access_token') {
      const mockHistoricalAlerts: Alert[] = [
        {
          id: 'mock-high',
          deviceId: 'dev-high',
          deviceName: 'Kitchen Smoke Detector',
          deviceLocation: 'First Floor Kitchen',
          severity: 'HIGH',
          status: 'RESOLVED',
          sensorData: { smokeLevel: 92, temperature: 78 },
          triggeredAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 'mock-medium',
          deviceId: 'dev-med',
          deviceName: 'Living Room Sensor',
          deviceLocation: 'Ground Floor Living Room',
          severity: 'MEDIUM',
          status: 'RESOLVED',
          sensorData: { temperature: 54 },
          triggeredAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
        {
          id: 'mock-low',
          deviceId: 'dev-low',
          deviceName: 'Bedroom Co2 Monitor',
          deviceLocation: 'Second Floor Master Bedroom',
          severity: 'LOW',
          status: 'RESOLVED',
          sensorData: { co2Level: 420 },
          triggeredAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        },
      ];
      if (filter?.severity) {
        return mockHistoricalAlerts.filter(a => a.severity === filter.severity);
      }
      return mockHistoricalAlerts;
    }

    if (filter?.deviceId) {
      const { data } = await client.get<Alert[]>(`/devices/${filter.deviceId}/alerts`);
      if (filter.severity) {
        return data.filter(a => a.severity === filter.severity);
      }
      return data;
    }

    try {
      const { data: devices } = await client.get<any[]>('/devices');
      if (!devices || devices.length === 0) return [];

      const alertsPromises = devices.map(device =>
        client.get<Alert[]>(`/devices/${device.id}/alerts`)
          .then(res => res.data)
          .catch(() => [] as Alert[])
      );

      const allAlertsArrays = await Promise.all(alertsPromises);
      let mergedAlerts = allAlertsArrays.flat();

      if (filter?.severity) {
        mergedAlerts = mergedAlerts.filter(a => a.severity === filter.severity);
      }

      mergedAlerts.sort((a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime());
      return mergedAlerts;
    } catch (e) {
      return [];
    }
  },

  /**
   * Fetches the details of a single alert by ID.
   */
  async getAlert(id: string): Promise<Alert> {
    const token = await AsyncStorage.getItem('access_token');
    if (token === 'mock_access_token') {
      const mockHistoricalAlerts: Alert[] = [
        {
          id: 'mock-high',
          deviceId: 'dev-high',
          deviceName: 'Kitchen Smoke Detector',
          deviceLocation: 'First Floor Kitchen',
          severity: 'HIGH',
          status: 'RESOLVED',
          sensorData: { smokeLevel: 92, temperature: 78 },
          triggeredAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 'mock-medium',
          deviceId: 'dev-med',
          deviceName: 'Living Room Sensor',
          deviceLocation: 'Ground Floor Living Room',
          severity: 'MEDIUM',
          status: 'RESOLVED',
          sensorData: { temperature: 54 },
          triggeredAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
        {
          id: 'mock-low',
          deviceId: 'dev-low',
          deviceName: 'Bedroom Co2 Monitor',
          deviceLocation: 'Second Floor Master Bedroom',
          severity: 'LOW',
          status: 'RESOLVED',
          sensorData: { co2Level: 420 },
          triggeredAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        },
      ];
      const alert = mockHistoricalAlerts.find(a => a.id === id);
      if (alert) return alert;
      throw new Error('Mock Alert not found.');
    }

    const { data } = await client.get<Alert>(`/alerts/${id}`);
    return data;
  },

  /**
   * Acknowledges a single alert by calling POST /api/alerts/{alertId}/acknowledge.
   */
  async acknowledgeAlert(id: string | number): Promise<void> {
    const token = await AsyncStorage.getItem('access_token');
    if (token === 'mock_access_token') {
      return Promise.resolve();
    }
    await client.post(`/alerts/${id}/acknowledge`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
};
