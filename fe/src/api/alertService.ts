/**
 * api/alertService.ts
 * Interfaces with AlertController (/api/alerts)
 * Fetches live/active hazard instances (Level 1/2/3).
 */
import client from './client';
import { ALERTS } from './endpoints';
import type { Alert, AlertSeverity } from '@/types/alert';

export type AlertsFilter = {
  severity?: AlertSeverity;
  deviceId?: string;
  page?: number;
  size?: number;
};

export const alertService = {
  async getAlerts(filter?: AlertsFilter): Promise<Alert[]> {
    const { data } = await client.get<Alert[]>(ALERTS.LIVE, { params: filter });
    return data;
  },

  async getAlert(id: string): Promise<Alert> {
    const { data } = await client.get<Alert>(ALERTS.DETAIL(id));
    return data;
  },

  async acknowledgeAlert(id: string): Promise<void> {
    await client.post(ALERTS.ACKNOWLEDGE(id));
  },
};
