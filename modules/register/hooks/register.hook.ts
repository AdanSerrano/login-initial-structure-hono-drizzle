'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerApi } from '../api/register.api';
import type { RegisterInput } from '../validations/schema/register.schema';

export const useRegister = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const register = async (values: RegisterInput) => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await registerApi.register(values);
        toast.success(data.message);
        router.push('/login');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al registrar';
        setError(message);
        toast.error(message);
      }
    });
  };

  return {
    isPending,
    error,
    register,
  };
};
