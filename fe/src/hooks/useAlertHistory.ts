/**
 * hooks/useAlertHistory.ts
 * Paginated alert history fetching with device and severity filters.
 */
import { useState, useEffect, useCallback } from 'react';
import { alertHistoryService, type HistoryFilter } from '@/api/alertHistoryService';
import type { AlertHistoryEntry, PaginatedResponse } from '@/types/alert';

export function useAlertHistory(initialFilter?: HistoryFilter) {
  const [data, setData] = useState<PaginatedResponse<AlertHistoryEntry> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<HistoryFilter>(initialFilter ?? { page: 0, size: 20 });

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await alertHistoryService.getHistory(filter));
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch history');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetch(); }, [fetch]);

  const loadNextPage = () =>
    setFilter((prev) => ({ ...prev, page: (prev.page ?? 0) + 1 }));

  return { data, isLoading, error, refetch: fetch, setFilter, loadNextPage };
}
