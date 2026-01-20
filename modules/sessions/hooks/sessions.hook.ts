'use client';

import { useState, useTransition, useCallback } from 'react';
import { toast } from 'sonner';
import { sessionsApi } from '../api/sessions.api';
import type { Session } from '../types/sessions.types';

export const useSessions = () => {
  const [isPending, startTransition] = useTransition();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await sessionsApi.getSessions();
      setSessions(data.sessions);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar sesiones';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const revokeSession = async (sessionId: string) => {
    startTransition(async () => {
      try {
        await sessionsApi.revokeSession(sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        toast.success('Sesión cerrada correctamente');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cerrar sesión';
        toast.error(message);
      }
    });
  };

  const revokeAllOtherSessions = async () => {
    startTransition(async () => {
      try {
        const result = await sessionsApi.revokeAllOtherSessions();
        setSessions((prev) => prev.filter((s) => s.isCurrent));
        toast.success(result.message);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cerrar sesiones';
        toast.error(message);
      }
    });
  };

  return {
    sessions,
    isLoading,
    isPending,
    error,
    fetchSessions,
    revokeSession,
    revokeAllOtherSessions,
  };
};
