'use client';

import { usePasswordResetRequest } from '../hooks/password-reset.hook';

export const usePasswordResetRequestViewModel = () => {
  const { requestReset, isPending, error, success } = usePasswordResetRequest();

  return {
    requestReset,
    isPending,
    error,
    success,
  };
};
