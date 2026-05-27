/**
 * api/suppressionService.ts
 * Interfaces with AlertSuppressionController (/api/suppressions)
 * Manages "Cooking Mode" mute timers using mute_until parameter.
 */
import client from './client';
import { SUPPRESSIONS } from './endpoints';
import type { Suppression, CreateSuppressionPayload, UpdateSuppressionPayload } from '@/types/suppression';

export const suppressionService = {
  async getSuppressions(): Promise<Suppression[]> {
    const { data } = await client.get<Suppression[]>(SUPPRESSIONS.LIST);
    return data;
  },

  /**
   * Create a mute timer for a device.
   * @param payload { device_id: string, mute_until: string (ISO-8601 datetime) }
   */
  async createSuppression(payload: CreateSuppressionPayload): Promise<Suppression> {
    const { data } = await client.post<Suppression>(SUPPRESSIONS.CREATE, payload);
    return data;
  },

  async getSuppression(id: string): Promise<Suppression> {
    const { data } = await client.get<Suppression>(SUPPRESSIONS.DETAIL(id));
    return data;
  },

  async updateSuppression(id: string, payload: UpdateSuppressionPayload): Promise<Suppression> {
    const { data } = await client.put<Suppression>(SUPPRESSIONS.UPDATE(id), payload);
    return data;
  },

  async deleteSuppression(id: string): Promise<void> {
    await client.delete(SUPPRESSIONS.DELETE(id));
  },
};
