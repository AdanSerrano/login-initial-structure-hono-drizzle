'use client';

import { useState, useCallback } from 'react';
import { emailChangeApi } from '../api/email-change.api';
import type { RequestEmailChangeInput } from '../validations/schema/email-change.schema';

interface PendingRequest {
  hasPending: boolean;
  newEmail?: string;
  expiresAt?: Date;
}

export function useEmailChange() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingRequest, setPendingRequest] = useState<PendingRequest | null>(null);

  const fetchPending = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await emailChangeApi.getPending();
      setPendingRequest({
        hasPending: response.hasPending,
        newEmail: response.newEmail,
        expiresAt: response.expiresAt ? new Date(response.expiresAt) : undefined,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener solicitud pendiente';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestChange = useCallback(async (data: RequestEmailChangeInput) => {
    setIsPending(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await emailChangeApi.requestChange(data);
      setSuccess(response.message);
      // Refresh pending status
      await fetchPending();
      return { success: true };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const message = error?.response?.data?.error || 'Error al solicitar cambio de email';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsPending(false);
    }
  }, [fetchPending]);

  const cancelPending = useCallback(async () => {
    setIsPending(true);
    setError(null);
    try {
      await emailChangeApi.cancelPending();
      setPendingRequest({ hasPending: false });
      setSuccess('Solicitud cancelada');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cancelar solicitud';
      setError(message);
    } finally {
      setIsPending(false);
    }
  }, []);

  const verifyChange = useCallback(async (token: string) => {
    setIsPending(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await emailChangeApi.verifyChange(token);
      setSuccess(response.message);
      return { success: true, newEmail: response.newEmail };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const message = error?.response?.data?.error || 'Error al verificar cambio de email';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsPending(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    isLoading,
    isPending,
    error,
    success,
    pendingRequest,
    fetchPending,
    requestChange,
    cancelPending,
    verifyChange,
    clearMessages,
  };
}
