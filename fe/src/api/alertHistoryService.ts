/**
 * api/alertHistoryService.ts
 * Interfaces with AlertHistoryController (/api/alerts/history)
 * Chronological audit logs with pagination and filtering.
 */
import client from './client';
import { ALERT_HISTORY } from './endpoints';
import type { AlertHistoryEntry, PaginatedResponse } from '@/types/alert';

export type HistoryFilter = {
  deviceId?: string;
  severity?: string;
  startDate?: string; // ISO-8601
  endDate?: string;   // ISO-8601
  page?: number;
  size?: number;
};

export const alertHistoryService = {
  async getHistory(filter?: HistoryFilter): Promise<PaginatedResponse<AlertHistoryEntry>> {
    const { data } = await client.get<PaginatedResponse<AlertHistoryEntry>>(
      ALERT_HISTORY.LIST,
      { params: filter },
    );
    return data;
  },

  async getHistoryEntry(id: string): Promise<AlertHistoryEntry> {
    const { data } = await client.get<AlertHistoryEntry>(ALERT_HISTORY.DETAIL(id));
    return data;
  },
};
