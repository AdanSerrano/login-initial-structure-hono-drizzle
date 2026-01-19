'use client';

import { usePasswordReset } from '../hooks/password-reset.hook';

export const usePasswordResetViewModel = (token: string) => {
  const { resetPassword, isPending, error, isValidating, isValidToken, email } = usePasswordReset(token);

  return {
    resetPassword,
    isPending,
    error,
    isValidating,
    isValidToken,
    email,
  };
};
