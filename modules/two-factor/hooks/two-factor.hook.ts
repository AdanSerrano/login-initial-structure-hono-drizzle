'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { twoFactorApi } from '../api/two-factor.api';
import { useUserStore } from '@/modules/user/state/user.state';
import type { VerifyTwoFactorInput, VerifyTwoFactorLoginInput } from '../validations/schema/two-factor.schema';
import type { TwoFactorSetupResponse, TwoFactorMethod, TwoFactorEmailSetupResponse } from '../types/two-factor.types';

type SetupData = TwoFactorSetupResponse | TwoFactorEmailSetupResponse | null;

export const useTwoFactorSetup = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [setupData, setSetupData] = useState<SetupData>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod | null>(null);
  const { user, updateUser } = useUserStore();

  const setupAuthenticator = async () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await twoFactorApi.setupAuthenticator();
        setSetupData(data);
        setSelectedMethod('AUTHENTICATOR');
        setIsSettingUp(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al configurar 2FA';
        setError(message);
        toast.error(message);
      }
    });
  };

  const setupEmail = async () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await twoFactorApi.setupEmail();
        setSetupData(data);
        setSelectedMethod('EMAIL');
        setIsSettingUp(true);
        toast.success(data.message);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al configurar 2FA';
        setError(message);
        toast.error(message);
      }
    });
  };

  const verifyAuthenticator = async (values: VerifyTwoFactorInput) => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await twoFactorApi.verifyAuthenticator(values);
        updateUser({ isTwoFactorEnabled: true, twoFactorMethod: 'AUTHENTICATOR' });
        setSetupData(null);
        setIsSettingUp(false);
        setSelectedMethod(null);
        toast.success(data.message);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Código inválido';
        setError(message);
        toast.error(message);
      }
    });
  };

  const verifyEmail = async (values: VerifyTwoFactorInput) => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await twoFactorApi.verifyEmail(values);
        updateUser({ isTwoFactorEnabled: true, twoFactorMethod: 'EMAIL' });
        setSetupData(null);
        setIsSettingUp(false);
        setSelectedMethod(null);
        toast.success(data.message);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Código inválido';
        setError(message);
        toast.error(message);
      }
    });
  };

  const resendEmailCode = async () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await twoFactorApi.setupEmail();
        toast.success(data.message);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al reenviar código';
        setError(message);
        toast.error(message);
      }
    });
  };

  const sendDisableCode = async () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await twoFactorApi.sendDisableCode();
        toast.success(data.message);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al enviar código';
        setError(message);
        toast.error(message);
      }
    });
  };

  const disable = async (values: VerifyTwoFactorInput) => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await twoFactorApi.disable(values);
        updateUser({ isTwoFactorEnabled: false, twoFactorMethod: null });
        setSetupData(null);
        toast.success(data.message);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al deshabilitar 2FA';
        setError(message);
        toast.error(message);
      }
    });
  };

  const cancelSetup = () => {
    setSetupData(null);
    setIsSettingUp(false);
    setSelectedMethod(null);
    setError(null);
  };

  return {
    isPending,
    error,
    setupData,
    isSettingUp,
    selectedMethod,
    isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
    twoFactorMethod: user?.twoFactorMethod ?? null,
    setupAuthenticator,
    setupEmail,
    verifyAuthenticator,
    verifyEmail,
    resendEmailCode,
    sendDisableCode,
    disable,
    cancelSetup,
  };
};

export const useTwoFactorLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const { setUser } = useUserStore();

  const sendCode = async (userId: string) => {
    setError(null);
    startTransition(async () => {
      try {
        await twoFactorApi.sendLoginCode(userId);
        setCodeSent(true);
        toast.success('Código enviado a tu correo');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al enviar código';
        setError(message);
        toast.error(message);
      }
    });
  };

  const verifyLogin = async (values: VerifyTwoFactorLoginInput & { trustDevice?: boolean }) => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await twoFactorApi.verifyLogin(values);
        setUser(data.user);
        toast.success(`Bienvenido, ${data.user.name}`);
        router.push(callbackUrl);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Código inválido';
        setError(message);
        toast.error(message);
      }
    });
  };

  const verifyWithBackupCode = async (userId: string, code: string, trustDevice?: boolean) => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await twoFactorApi.verifyLoginWithBackupCode({ userId, code, trustDevice });
        setUser(data.user);
        if (data.remainingCodes <= 2) {
          toast.warning(`Te quedan solo ${data.remainingCodes} códigos de respaldo. Considera regenerarlos.`);
        }
        toast.success(`Bienvenido, ${data.user.name}`);
        router.push(callbackUrl);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Código de respaldo inválido';
        setError(message);
        toast.error(message);
      }
    });
  };

  const toggleBackupCodeMode = () => {
    setUseBackupCode(!useBackupCode);
    setError(null);
  };

  return {
    isPending,
    error,
    codeSent,
    useBackupCode,
    sendCode,
    verifyLogin,
    verifyWithBackupCode,
    toggleBackupCodeMode,
  };
};

export const useBackupCodes = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [codes, setCodes] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [remainingCodes, setRemainingCodes] = useState<number>(0);

  const generateCodes = async () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await twoFactorApi.generateBackupCodes();
        setCodes(data.codes);
        setShowDialog(true);
        setRemainingCodes(data.codes.length);
        toast.success('Códigos de respaldo generados');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al generar códigos';
        setError(message);
        toast.error(message);
      }
    });
  };

  const fetchRemainingCodes = async () => {
    try {
      const data = await twoFactorApi.getBackupCodesCount();
      setRemainingCodes(data.remainingCodes);
    } catch {
      // Silently fail
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setCodes([]);
  };

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
