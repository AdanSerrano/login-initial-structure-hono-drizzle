'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { logoutApi } from '../api/logout.api';
import { useUserStore } from '@/modules/user/state/user.state';

export const useLogout = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { clearUser } = useUserStore();

  const logout = async () => {
    startTransition(async () => {
      try {
        await logoutApi.logout();
      } catch {
        // Continuar con el logout local aunque falle el servidor
      }

      clearUser();
      toast.success('Sesión cerrada correctamente');
      router.push('/login');
    });
  };

  return {
    logout,
    isPending,
  };
};
