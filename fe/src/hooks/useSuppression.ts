/**
 * hooks/useSuppression.ts
 * Manages Cooking Mode mute timers via AlertSuppressionController.
 */
import { useState, useCallback } from 'react';
import { suppressionService } from '@/api/suppressionService';
import type { CreateSuppressionPayload, MuteDuration } from '@/types/suppression';

export function useSuppression() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Activates Cooking Mode for a device for a given duration in minutes.
   * Constructs mute_until timestamp and posts to /api/suppressions.
   */
  const activateCookingMode = useCallback(
    async (deviceId: string, durationMinutes: MuteDuration) => {
      setIsLoading(true);
      setError(null);
      try {
        const muteUntil = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
        const payload: CreateSuppressionPayload = { device_id: deviceId, mute_until: muteUntil };
        return await suppressionService.createSuppression(payload);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to activate cooking mode');
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const deactivateCookingMode = useCallback(async (suppressionId: string) => {
    setIsLoading(true);
    try {
      await suppressionService.deleteSuppression(suppressionId);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to deactivate cooking mode');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { activateCookingMode, deactivateCookingMode, isLoading, error };
}
