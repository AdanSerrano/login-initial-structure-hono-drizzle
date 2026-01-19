import { useLogin } from '../hooks/login.hook';
import type { LoginInput } from '../validations/schema/login.schema';

export function LoginViewModel() {
  const {
    login,
    isPending,
    error,
    requiresTwoFactor,
    pendingUserId,
    cancelTwoFactor,
    requiresEmailVerification,
    unverifiedEmail,
    isResendingVerification,
    resendVerificationEmail,
    cancelEmailVerification,
  } = useLogin();

  const handleLogin = async (values: LoginInput) => {
    await login(values);
  };

  return {
    handleLogin,
    isPending,
    error,
    requiresTwoFactor,
    pendingUserId,
    cancelTwoFactor,
    requiresEmailVerification,
    unverifiedEmail,
    isResendingVerification,
    resendVerificationEmail,
    cancelEmailVerification,
  };
}
