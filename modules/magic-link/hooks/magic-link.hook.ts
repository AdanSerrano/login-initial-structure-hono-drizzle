'use client';

import { useState } from 'react';
import { magicLinkApi } from '../api/magic-link.api';
import { userApi } from '@/modules/user/api/user.api';
import { useUserStore } from '@/modules/user/state/user.state';

interface UseSendMagicLinkReturn {
  sendMagicLink: (email: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

interface UseVerifyMagicLinkReturn {
  verifyMagicLink: (token: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  isNewUser: boolean;
}

export function useSendMagicLink(): UseSendMagicLinkReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendMagicLink = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await magicLinkApi.sendMagicLink(email);
      setSuccess(true);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar el enlace';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMagicLink,
    isLoading,
    error,
    success,
  };
}

export function useVerifyMagicLink(): UseVerifyMagicLinkReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const { setUser } = useUserStore();

  const verifyMagicLink = async (token: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await magicLinkApi.verifyMagicLink(token);
      if (result.isNewUser) {
        setIsNewUser(true);
      }

      // Fetch full user data and update store
      const userData = await userApi.getMe();
      setUser(userData);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Enlace inválido o expirado';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyMagicLink,
    isLoading,
    error,
    isNewUser,
  };
}
