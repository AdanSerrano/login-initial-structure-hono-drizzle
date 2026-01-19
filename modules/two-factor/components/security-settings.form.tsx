'use client';

import { useState } from 'react';
import { useTwoFactorSetup } from '../hooks/two-factor.hook';
import { useUser } from '@/modules/user/hooks/user.hook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { TwoFactorSetupResponse } from '../types/two-factor.types';

export function SecuritySettingsForm() {
  const { user, isLoading } = useUser();
  const {
    isPending,
    setupData,
    isSettingUp,
    selectedMethod,
    isTwoFactorEnabled,
    twoFactorMethod,
    setupAuthenticator,
    setupEmail,
    verifyAuthenticator,
    verifyEmail,
    resendEmailCode,
    sendDisableCode,
    disable,
    cancelSetup,
  } = useTwoFactorSetup();

  const [verifyCode, setVerifyCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [showDisableDialog, setShowDisableDialog] = useState(false);

  const handleSelectMethod = (method: 'AUTHENTICATOR' | 'EMAIL') => {
    if (method === 'AUTHENTICATOR') {
      setupAuthenticator();
    } else {
      setupEmail();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod === 'AUTHENTICATOR') {
      await verifyAuthenticator({ code: verifyCode });
    } else {
      await verifyEmail({ code: verifyCode });
    }
    setVerifyCode('');
  };

  const handleDisable = async () => {
    await disable({ code: disableCode });
    setDisableCode('');
    setShowDisableDialog(false);
  };

  const handleOpenDisable = async () => {
    if (twoFactorMethod === 'EMAIL') {
      await sendDisableCode();
    }
    setShowDisableDialog(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Debes iniciar sesión para ver esta página</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">Autenticación de dos factores</CardTitle>
              <CardDescription>
                Añade una capa extra de seguridad a tu cuenta
              </CardDescription>
            </div>
            <Badge variant={isTwoFactorEnabled ? 'default' : 'secondary'}>
              {isTwoFactorEnabled ? 'Activado' : 'Desactivado'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isTwoFactorEnabled ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Elige un método para proteger tu cuenta con autenticación de dos factores.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleSelectMethod('AUTHENTICATOR')}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="p-3 rounded-full bg-primary/10">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-medium">Google Authenticator</h3>
                      <p className="text-xs text-muted-foreground">
                        Usa una app de autenticación como Google Authenticator o Authy
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleSelectMethod('EMAIL')}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="p-3 rounded-full bg-primary/10">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-medium">Correo electrónico</h3>
                      <p className="text-xs text-muted-foreground">
                        Recibe un código de verificación en tu correo electrónico
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">2FA Activado</p>
                    <p className="text-sm text-green-600">
                      {twoFactorMethod === 'AUTHENTICATOR'
                        ? 'Usando Google Authenticator'
                        : 'Usando correo electrónico'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenDisable}
                  disabled={isPending}
                >
                  Desactivar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información de la sesión</CardTitle>
          <CardDescription>Detalles sobre tu sesión actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email verificado</p>
              <p className="font-medium">{user.emailVerified ? 'Sí' : 'No'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Rol</p>
              <p className="font-medium capitalize">{user.role?.toLowerCase()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Última actualización</p>
              <p className="font-medium">
                {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('es-ES') : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Authenticator Dialog */}
      <Dialog open={isSettingUp && selectedMethod === 'AUTHENTICATOR'} onOpenChange={(open) => !open && cancelSetup()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Google Authenticator</DialogTitle>
            <DialogDescription>
              Escanea el código QR con tu aplicación de autenticación
            </DialogDescription>
          </DialogHeader>

          {setupData && 'qrCode' in setupData && (
            <div className="space-y-4">
              {/* QR Code */}
              <div className="flex justify-center p-4 bg-white rounded-lg border">
                <img
                  src={(setupData as TwoFactorSetupResponse).qrCode}
                  alt="QR Code para 2FA"
                  className="w-48 h-48"
                />
              </div>

              {/* Manual Secret */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  O ingresa este código manualmente:
                </Label>
                <code className="block p-2 bg-muted rounded text-center font-mono text-sm break-all">
                  {(setupData as TwoFactorSetupResponse).secret}
                </code>
              </div>

              {/* Verification Form */}
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verify-code">Código de verificación</Label>
                  <Input
                    id="verify-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ingresa el código de 6 dígitos de tu aplicación
                  </p>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={cancelSetup}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isPending || verifyCode.length !== 6}>
                    {isPending ? 'Verificando...' : 'Verificar y activar'}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Setup Email Dialog */}
      <Dialog open={isSettingUp && selectedMethod === 'EMAIL'} onOpenChange={(open) => !open && cancelSetup()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verificar correo electrónico</DialogTitle>
            <DialogDescription>
              Ingresa el código de 6 dígitos que enviamos a tu correo
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-verify-code">Código de verificación</Label>
              <Input
                id="email-verify-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground">
                Revisa tu bandeja de entrada
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={resendEmailCode}
                disabled={isPending}
              >
                Reenviar código
              </Button>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={cancelSetup}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || verifyCode.length !== 6}>
                {isPending ? 'Verificando...' : 'Verificar y activar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Disable 2FA Alert Dialog */}
      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desactivar autenticación de dos factores</AlertDialogTitle>
            <AlertDialogDescription>
              {twoFactorMethod === 'AUTHENTICATOR'
                ? 'Para desactivar 2FA, ingresa el código de tu aplicación de autenticación.'
                : 'Para desactivar 2FA, ingresa el código que enviamos a tu correo electrónico.'}
              {' '}Esto hará tu cuenta menos segura.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <Label htmlFor="disable-code">Código de verificación</Label>
            <Input
              id="disable-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ''))}
              className="mt-2 text-center text-2xl tracking-widest"
            />
            {twoFactorMethod === 'EMAIL' && (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={sendDisableCode}
                disabled={isPending}
                className="mt-2 w-full"
              >
                Reenviar código
              </Button>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDisableCode('')}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisable}
              disabled={isPending || disableCode.length !== 6}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? 'Desactivando...' : 'Desactivar 2FA'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
