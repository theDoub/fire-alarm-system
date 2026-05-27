/**
 * hooks/useAlerts.ts
 * Data-fetching hook for live alerts list with severity filtering.
 * Wraps alertService — React Query integration point.
 */
import { useState, useEffect, useCallback } from 'react';
import { alertService, type AlertsFilter } from '@/api/alertService';
import type { Alert, AlertSeverity } from '@/types/alert';

interface UseAlertsResult {
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  setFilter: (severity: AlertSeverity | undefined) => void;
}

export function useAlerts(initialSeverity?: AlertSeverity): UseAlertsResult {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AlertsFilter>({ severity: initialSeverity });

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alertService.getAlerts(filter);
      setAlerts(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch alerts');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetch(); }, [fetch]);

  const setFilterSeverity = (severity: AlertSeverity | undefined) =>
    setFilter((prev) => ({ ...prev, severity }));

  return { alerts, isLoading, error, refetch: fetch, setFilter: setFilterSeverity };
}
