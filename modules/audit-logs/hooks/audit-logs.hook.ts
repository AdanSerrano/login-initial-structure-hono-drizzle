'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { auditLogsApi } from '../api/audit-logs.api';
import type { AuditLogEntry } from '../types/audit-logs.types';
import type { PaginationInfo } from '@/types/pagination.types';

export function useActivityLog(initialLimit = 10) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentPageRef = useRef(1);

  const fetchLogs = useCallback(async (page = 1, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await auditLogsApi.getMyActivity(page, initialLimit);

      if (append) {
        setLogs((prev) => [...prev, ...response.data]);
      } else {
        setLogs(response.data);
      }

      setPagination(response.pagination);
      currentPageRef.current = response.pagination.page;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar la actividad';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [initialLimit]);

  const loadMore = useCallback(async () => {
    if (!pagination?.hasNextPage || isLoadingMore) return;
    await fetchLogs(currentPageRef.current + 1, true);
  }, [fetchLogs, pagination?.hasNextPage, isLoadingMore]);

  const refresh = useCallback(async () => {
    currentPageRef.current = 1;
    await fetchLogs(1, false);
  }, [fetchLogs]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    pagination,
    hasMore: pagination?.hasNextPage ?? false,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    refresh,
  };
}
