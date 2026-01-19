'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { emailVerificationApi } from '../api/email-verification.api';
import type { ResendVerificationInput } from '../validations/schema/email-verification.schema';

export const useEmailVerification = (token: string) => {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('Token no proporcionado');
        setIsVerifying(false);
        return;
      }

      try {
        const data = await emailVerificationApi.verifyFromToken(token);
        setIsVerified(true);
        toast.success(data.message);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al verificar el correo';
        setError(message);
        toast.error(message);
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [token, router]);

  return {
    isVerifying,
    isVerified,
    error,
  };
};

export const useResendVerification = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resend = async (values: ResendVerificationInput) => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        const data = await emailVerificationApi.resend(values);
        setSuccess(true);
        toast.success(data.message);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al reenviar el correo';
        setError(message);
        toast.error(message);
      }
    });
  };

  return {
    isPending,
    error,
    success,
    resend,
  };
};
