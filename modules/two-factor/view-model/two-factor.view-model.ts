'use client';

import { useTwoFactorSetup, useTwoFactorLogin, useBackupCodes } from '../hooks/two-factor.hook';

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
  const {
    verifyLogin,
    sendCode,
    isPending,
    error,
    codeSent,
    useBackupCode,
    verifyWithBackupCode,
    toggleBackupCodeMode,
  } = useTwoFactorLogin();

  return {
    verifyLogin,
    sendCode,
    isPending,
    error,
    codeSent,
    useBackupCode,
    verifyWithBackupCode,
    toggleBackupCodeMode,
  };
};

export const useBackupCodesViewModel = () => {
  const {
    isPending,
    error,
    codes,
    showDialog,
    remainingCodes,
    generateCodes,
    fetchRemainingCodes,
    closeDialog,
    setShowDialog,
  } = useBackupCodes();

  return {
    isPending,
    error,
    codes,
    showDialog,
    remainingCodes,
    generateCodes,
    fetchRemainingCodes,
    closeDialog,
    setShowDialog,
  };
};
