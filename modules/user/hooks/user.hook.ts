'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { userApi } from '../api/user.api';
import { useUserStore } from '../state/user.state';
import type { UpdateUserInput } from '../types/user.types';

export const useUser = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, setUser, updateUser: storeUpdateUser, clearUser } = useUserStore();
  const hasHydrated = useRef(false);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userData = await userApi.getMe();
      setUser(userData);
    } catch {
      clearUser();
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: UpdateUserInput) => {
    setError(null);
    startTransition(async () => {
      try {
        const updatedUser = await userApi.updateMe(data);
        storeUpdateUser(updatedUser);
        toast.success('Perfil actualizado correctamente');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al actualizar perfil';
        setError(message);
        toast.error(message);
      }
    });
  };

  const deleteAccount = async () => {
    setError(null);
    startTransition(async () => {
      try {
        await userApi.deleteMe();
        clearUser();
        toast.success('Cuenta eliminada correctamente');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al eliminar cuenta';
        setError(message);
        toast.error(message);
      }
    });
  };

  useEffect(() => {
    // Skip fetch if already hydrated from server via SessionProvider
    if (hasHydrated.current) {
      setIsLoading(false);
      return;
    }
    hasHydrated.current = true;

    // If user was hydrated from server, no need to fetch
    if (user) {
      setIsLoading(false);
      return;
    }

    // Only fetch if not hydrated (e.g., client-side navigation after login)
    fetchUser();
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isPending,
    error,
    fetchUser,
    updateUser,
    deleteAccount,
  };
};
