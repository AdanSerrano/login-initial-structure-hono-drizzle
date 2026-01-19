'use client';

import { useState } from 'react';
import { useTwoFactorSetupViewModel } from '../view-model/two-factor.view-model';
import { TwoFactorForm } from '../components/form/two-factor.form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { TwoFactorSetupResponse } from '../types/two-factor.types';

export function TwoFactorSetupView() {
  const {
    setupAuthenticator,
    setupEmail,
    verifyAuthenticator,
    verifyEmail,
    isPending,
    error,
    setupData,
    selectedMethod,
    isTwoFactorEnabled,
    twoFactorMethod,
    resendEmailCode,
    cancelSetup,
  } = useTwoFactorSetupViewModel();

  if (isTwoFactorEnabled) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">2FA Habilitado</h2>
          <p className="text-gray-600 mt-2">
            La autenticación de dos factores está activa usando {twoFactorMethod === 'AUTHENTICATOR' ? 'Google Authenticator' : 'correo electrónico'}.
          </p>
        </div>
      </div>
    );
  }

  // Show method selection if not setting up
  if (!setupData && !selectedMethod) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">Configurar 2FA</h2>
          <p className="text-gray-600 mt-2">
            Elige un método de autenticación de dos factores
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={setupAuthenticator}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-medium">Google Authenticator</h3>
                <p className="text-xs text-muted-foreground">
                  Usa una app como Google Authenticator o Authy
                </p>
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={setupEmail}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-medium">Correo electrónico</h3>
                <p className="text-xs text-muted-foreground">
                  Recibe un código de verificación por correo
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show authenticator setup
  if (selectedMethod === 'AUTHENTICATOR' && setupData && 'qrCode' in setupData) {
    const authSetupData = setupData as TwoFactorSetupResponse;
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">Configurar Google Authenticator</h2>
          <p className="text-gray-600 mt-2">
            Escanea el código QR con tu aplicación autenticadora
          </p>
        </div>

        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg border">
            <img
              src={authSetupData.qrCode}
              alt="QR Code"
              width={200}
              height={200}
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">O ingresa este código manualmente:</p>
          <code className="block p-2 bg-gray-100 rounded text-sm font-mono break-all">
            {authSetupData.secret}
          </code>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600 mb-4">
            Ingresa el código de 6 dígitos de tu aplicación para completar la configuración:
          </p>
          <TwoFactorForm
            onSubmit={verifyAuthenticator}
            isPending={isPending}
            error={error}
            submitText="Habilitar 2FA"
          />
          <Button variant="link" onClick={cancelSetup} className="w-full mt-2">
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  // Show email setup
  if (selectedMethod === 'EMAIL') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">Verificar correo electrónico</h2>
          <p className="text-gray-600 mt-2">
            Ingresa el código de 6 dígitos que enviamos a tu correo
          </p>
        </div>

        <TwoFactorForm
          onSubmit={verifyEmail}
          isPending={isPending}
          error={error}
          submitText="Habilitar 2FA"
        />

        <div className="flex justify-center gap-4">
          <Button variant="link" onClick={resendEmailCode} disabled={isPending}>
            Reenviar código
          </Button>
          <Button variant="link" onClick={cancelSetup}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <p className="text-gray-600">Configurando autenticación de dos factores...</p>
    </div>
  );
}
