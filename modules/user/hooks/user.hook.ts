'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { userApi } from '../api/user.api';
import { useUserStore } from '../state/user.state';
import type { UpdateUserInput } from '../types/user.types';

export const useUser = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, isHydrated, setUser, updateUser: storeUpdateUser, clearUser } = useUserStore();

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userData = await userApi.getMe();
      setUser(userData);
      return userData;
    } catch {
      clearUser();
      return null;
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

  // No automatic fetch - SessionProvider handles initial hydration
  // fetchUser() can be called manually when needed (e.g., after login)

  return {
    user,
    isAuthenticated,
    isHydrated,
    isLoading,
    isPending,
    error,
    fetchUser,
    updateUser,
    deleteAccount,
  };
};
