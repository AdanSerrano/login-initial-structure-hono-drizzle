'use client';

import { useState, useEffect, useCallback } from 'react';
import { auditLogsApi } from '../api/audit-logs.api';
import type { AuditLogEntry, AuditLogListResponse } from '../types/audit-logs.types';

export function useActivityLog(initialLimit = 10) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (limit = initialLimit, offset = 0, append = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AuditLogListResponse = await auditLogsApi.getMyActivity(limit, offset);

      if (append) {
        setLogs((prev) => [...prev, ...response.logs]);
      } else {
        setLogs(response.logs);
      }

      setTotal(response.total);
      setHasMore(response.hasMore);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar la actividad';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [initialLimit]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await fetchLogs(initialLimit, logs.length, true);
  }, [fetchLogs, hasMore, isLoading, logs.length, initialLimit]);

  const refresh = useCallback(async () => {
    await fetchLogs(initialLimit, 0, false);
  }, [fetchLogs, initialLimit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    total,
    hasMore,
    isLoading,
    error,
    loadMore,
    refresh,
  };
}
