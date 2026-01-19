'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginApi } from '../api/login.api';
import { emailVerificationApi } from '@/modules/email-verification/api/email-verification.api';
import { useUserStore } from '@/modules/user/state/user.state';
import type { LoginInput } from '../validations/schema/login.schema';

export const useLogin = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [requiresEmailVerification, setRequiresEmailVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const { setUser } = useUserStore();

  const login = async (values: LoginInput) => {
    setError(null);
    setRequiresTwoFactor(false);
    setRequiresEmailVerification(false);
    setUnverifiedEmail(null);

    startTransition(async () => {
      try {
        const data = await loginApi.login(values);

        // Check if email verification is required
        if ('requiresEmailVerification' in data && data.requiresEmailVerification) {
          setRequiresEmailVerification(true);
          setUnverifiedEmail(data.email);
          return;
        }

        // Check if 2FA is required
        if ('requiresTwoFactor' in data && data.requiresTwoFactor) {
          setRequiresTwoFactor(true);
          setPendingUserId(data.userId);
          toast.info('Se requiere verificación de dos factores');
          return;
        }

        // Normal login success
        if ('user' in data) {
          setUser(data.user);
          toast.success(`Bienvenido, ${data.user.name}`);
          router.push('/');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
        setError(message);
        toast.error(message);
      }
    });
  };

  const resendVerificationEmail = async () => {
    if (!unverifiedEmail) return;

    setIsResendingVerification(true);
    try {
      await emailVerificationApi.resend({ email: unverifiedEmail });
      toast.success('Correo de verificación enviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al reenviar el correo';
      toast.error(message);
    } finally {
      setIsResendingVerification(false);
    }
  };

  const cancelEmailVerification = () => {
    setRequiresEmailVerification(false);
    setUnverifiedEmail(null);
  };

  const cancelTwoFactor = () => {
    setRequiresTwoFactor(false);
    setPendingUserId(null);
  };

  return {
    isPending,
    error,
    requiresTwoFactor,
    pendingUserId,
    requiresEmailVerification,
    unverifiedEmail,
    isResendingVerification,
    login,
    cancelTwoFactor,
    resendVerificationEmail,
    cancelEmailVerification,
  };
};
