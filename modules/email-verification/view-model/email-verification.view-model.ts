'use client';

import { useEmailVerification, useResendVerification } from '../hooks/email-verification.hook';

export const useEmailVerificationViewModel = (token: string) => {
  const { isVerifying, isVerified, error } = useEmailVerification(token);

  return {
    isVerifying,
    isVerified,
    error,
  };
};

export const useResendVerificationViewModel = () => {
  const { resend, isPending, error, success } = useResendVerification();

  return {
    resend,
    isPending,
    error,
    success,
  };
};
