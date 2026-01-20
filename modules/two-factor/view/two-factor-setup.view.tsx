'use client';

import { useTwoFactorSetupViewModel } from '../view-model/two-factor.view-model';
import { TwoFactorForm } from '../components/form/two-factor.form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Smartphone, Mail, Loader2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
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

  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isTwoFactorEnabled) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground">2FA Habilitado</h2>
          <p className="text-muted-foreground mt-2">
            La autenticación de dos factores está activa usando {twoFactorMethod === 'AUTHENTICATOR' ? 'Google Authenticator' : 'correo electrónico'}.
          </p>
        </div>
      </div>
    );
  }

  if (!setupData && !selectedMethod) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Configurar 2FA</h2>
          <p className="text-muted-foreground mt-2">
            Elige un método de autenticación de dos factores
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card
            className="cursor-pointer hover:border-primary hover:shadow-md transition-all group"
            onClick={setupAuthenticator}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-foreground">Google Authenticator</h3>
                <p className="text-sm text-muted-foreground">
                  Usa una app como Google Authenticator o Authy
                </p>
                <span className="text-xs text-primary font-medium">Recomendado</span>
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:border-primary hover:shadow-md transition-all group"
            onClick={setupEmail}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 group-hover:scale-110 transition-transform">
                  <Mail className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-foreground">Correo electrónico</h3>
                <p className="text-sm text-muted-foreground">
                  Recibe un código de verificación por correo
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedMethod === 'AUTHENTICATOR' && setupData && 'qrCode' in setupData) {
    const authSetupData = setupData as TwoFactorSetupResponse;
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Configurar Google Authenticator</h2>
          <p className="text-muted-foreground mt-2">
            Escanea el código QR con tu aplicación autenticadora
          </p>
        </div>

        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-muted">
            <img
              src={authSetupData.qrCode}
              alt="QR Code"
              width={180}
              height={180}
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">O ingresa este código manualmente:</p>
          <div className="flex items-center justify-center gap-2">
            <code className="px-4 py-2 bg-secondary rounded-lg text-sm font-mono tracking-wide">
              {authSetupData.secret}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(authSetupData.secret)}
              className="h-9 w-9"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Ingresa el código de 6 dígitos de tu aplicación para completar la configuración:
          </p>
          <TwoFactorForm
            onSubmit={verifyAuthenticator}
            isPending={isPending}
            error={error}
            submitText="Habilitar 2FA"
          />
          <Button
            variant="ghost"
            onClick={cancelSetup}
            className="w-full text-muted-foreground"
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  if (selectedMethod === 'EMAIL') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-cyan-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Verificar correo electrónico</h2>
          <p className="text-muted-foreground mt-2">
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
          <Button
            variant="ghost"
            onClick={resendEmailCode}
            disabled={isPending}
            className="text-primary"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Reenviando...
              </>
            ) : (
              'Reenviar código'
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={cancelSetup}
            className="text-muted-foreground"
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
      <p className="text-muted-foreground">Configurando autenticación de dos factores...</p>
    </div>
  );
}
