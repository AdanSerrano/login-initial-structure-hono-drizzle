'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { passwordResetApi } from '../api/password-reset.api';
import type { RequestPasswordResetInput, ResetPasswordFormInput } from '../validations/schema/password-reset.schema';

export const usePasswordResetRequest = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const requestReset = async (values: RequestPasswordResetInput) => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        const data = await passwordResetApi.requestReset(values);
        setSuccess(true);
        toast.success(data.message);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al solicitar el restablecimiento';
        setError(message);
        toast.error(message);
      }
    });
  };

  return {
    isPending,
    error,
    success,
    requestReset,
  };
};

export const usePasswordReset = (token: string) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const data = await passwordResetApi.validateToken(token);
        setIsValidToken(data.valid);
        setEmail(data.email);
      } catch {
        setIsValidToken(false);
      } finally {
        setIsValidating(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsValidating(false);
    }
  }, [token]);

  const resetPassword = async (values: ResetPasswordFormInput) => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await passwordResetApi.resetPassword({ ...values, token });
        toast.success(data.message);
        router.push('/login');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al restablecer la contraseña';
        setError(message);
        toast.error(message);
      }
    });
  };

  return {
    isPending,
    error,
    isValidating,
    isValidToken,
    email,
    resetPassword,
  };
};
