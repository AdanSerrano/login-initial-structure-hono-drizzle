'use client';

import { useTwoFactorSetup, useTwoFactorLogin } from '../hooks/two-factor.hook';

export const useTwoFactorSetupViewModel = () => {
  const {
    setupAuthenticator,
    setupEmail,
    verifyAuthenticator,
    verifyEmail,
    disable,
    isPending,
    error,
    setupData,
    isSettingUp,
    selectedMethod,
    isTwoFactorEnabled,
    twoFactorMethod,
    resendEmailCode,
    sendDisableCode,
    cancelSetup,
  } = useTwoFactorSetup();

  return {
    setupAuthenticator,
    setupEmail,
    verifyAuthenticator,
    verifyEmail,
    disable,
    isPending,
    error,
    setupData,
    isSettingUp,
    selectedMethod,
    isTwoFactorEnabled,
    twoFactorMethod,
    resendEmailCode,
    sendDisableCode,
    cancelSetup,
  };
};

export const useTwoFactorLoginViewModel = () => {
  const { verifyLogin, sendCode, isPending, error, codeSent } = useTwoFactorLogin();

  return {
    verifyLogin,
    sendCode,
    isPending,
    error,
    codeSent,
  };
};
