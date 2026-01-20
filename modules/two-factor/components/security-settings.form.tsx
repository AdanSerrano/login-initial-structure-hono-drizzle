'use client';

import { useState, useEffect } from 'react';
import { useTwoFactorSetup, useBackupCodes } from '../hooks/two-factor.hook';
import { useUser } from '@/modules/user/hooks/user.hook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { BackupCodesDialog } from './backup-codes-dialog.component';
import {
  Key,
  AlertTriangle,
  Smartphone,
  Mail,
  CheckCircle,
  Shield,
  ShieldOff,
  Loader2,
  QrCode,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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

  const {
    isPending: isBackupPending,
    codes: backupCodes,
    showDialog: showBackupDialog,
    remainingCodes,
    generateCodes,
    fetchRemainingCodes,
    closeDialog: closeBackupDialog,
    setShowDialog: setShowBackupDialog,
  } = useBackupCodes();

  const [verifyCode, setVerifyCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [showDisableDialog, setShowDisableDialog] = useState(false);

  useEffect(() => {
    if (isTwoFactorEnabled) {
      fetchRemainingCodes();
    }
  }, [isTwoFactorEnabled, fetchRemainingCodes]);

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

  const handleVerifyComplete = async (code: string) => {
    if (code.length === 6) {
      if (selectedMethod === 'AUTHENTICATOR') {
        await verifyAuthenticator({ code });
      } else {
        await verifyEmail({ code });
      }
      setVerifyCode('');
    }
  };

  const handleDisable = async () => {
    await disable({ code: disableCode });
    setDisableCode('');
    setShowDisableDialog(false);
  };

  const handleDisableComplete = async (code: string) => {
    if (code.length === 6) {
      setDisableCode(code);
    }
  };

  const handleOpenDisable = async () => {
    if (twoFactorMethod === 'EMAIL') {
      await sendDisableCode();
    }
    setShowDisableDialog(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-muted/30">
          <div className="w-12 h-12 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Debes iniciar sesión para ver esta página</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {!isTwoFactorEnabled ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Elige un método para proteger tu cuenta con autenticación de dos factores.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card
              className={cn(
                "cursor-pointer transition-all border-2",
                "hover:border-violet-300 hover:shadow-lg hover:shadow-purple-500/10",
                "group"
              )}
              onClick={() => handleSelectMethod('AUTHENTICATOR')}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-8 h-8 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Google Authenticator</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Usa una app como Google Authenticator o Authy
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                    Recomendado
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card
              className={cn(
                "cursor-pointer transition-all border-2",
                "hover:border-violet-300 hover:shadow-lg hover:shadow-purple-500/10",
                "group"
              )}
              onClick={() => handleSelectMethod('EMAIL')}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:scale-110 transition-transform">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Correo electrónico</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recibe un código de verificación por email
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Más simple
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-100">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-emerald-800">2FA Activado</p>
                <p className="text-sm text-emerald-600 flex items-center gap-2">
                  {twoFactorMethod === 'AUTHENTICATOR' ? (
                    <>
                      <Smartphone className="w-4 h-4" />
                      Google Authenticator
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Correo electrónico
                    </>
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenDisable}
              disabled={isPending}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
            >
              <ShieldOff className="w-4 h-4" />
              Desactivar
            </Button>
          </div>

          {/* Backup Codes Section */}
          <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100">
                  <Key className="w-5 h-5 text-violet-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Códigos de respaldo</p>
                  <p className="text-sm text-muted-foreground">
                    Usa estos códigos si pierdes acceso a tu método de 2FA
                  </p>
                  {remainingCodes > 0 ? (
                    <Badge
                      className={cn(
                        remainingCodes <= 2
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-emerald-100 text-emerald-700 border-emerald-200"
                      )}
                    >
                      {remainingCodes} códigos disponibles
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Sin códigos
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={generateCodes}
                disabled={isBackupPending}
                className="gap-2 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300"
              >
                <RefreshCw className={cn("w-4 h-4", isBackupPending && "animate-spin")} />
                {remainingCodes > 0 ? 'Regenerar' : 'Generar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Setup Authenticator Dialog */}
      <Dialog open={isSettingUp && selectedMethod === 'AUTHENTICATOR'} onOpenChange={(open) => !open && cancelSetup()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100">
                <QrCode className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <DialogTitle>Configurar Authenticator</DialogTitle>
                <DialogDescription>
                  Escanea el código QR con tu app
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {setupData && 'qrCode' in setupData && (
            <div className="space-y-5">
              <div className="flex justify-center p-4 bg-white rounded-xl border-2 border-dashed border-border">
                <img
                  src={(setupData as TwoFactorSetupResponse).qrCode}
                  alt="QR Code para 2FA"
                  className="w-48 h-48"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  O ingresa este código manualmente:
                </Label>
                <code className="block p-3 bg-muted rounded-lg text-center font-mono text-sm break-all select-all">
                  {(setupData as TwoFactorSetupResponse).secret}
                </code>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-center block">Código de verificación</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={verifyCode}
                      onChange={setVerifyCode}
                      onComplete={handleVerifyComplete}
                      disabled={isPending}
                    >
                      <InputOTPGroup>
                        {[0, 1, 2].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-11 h-12 text-lg font-semibold rounded-lg border-2"
                          />
                        ))}
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        {[3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-11 h-12 text-lg font-semibold rounded-lg border-2"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="ghost" onClick={cancelSetup}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || verifyCode.length !== 6}
                    className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Activar 2FA
                      </>
                    )}
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
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle>Verificar correo</DialogTitle>
                <DialogDescription>
                  Ingresa el código de 6 dígitos
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleVerify} className="space-y-5">
            <Alert className="border-blue-200 bg-blue-50">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Enviamos un código a <strong>{user.email}</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={verifyCode}
                  onChange={setVerifyCode}
                  onComplete={handleVerifyComplete}
                  disabled={isPending}
                >
                  <InputOTPGroup>
                    {[0, 1, 2].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-11 h-12 text-lg font-semibold rounded-lg border-2"
                      />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    {[3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-11 h-12 text-lg font-semibold rounded-lg border-2"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={resendEmailCode}
                disabled={isPending}
                className="text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reenviar código
              </Button>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={cancelSetup}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending || verifyCode.length !== 6}
                className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Activar 2FA
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Disable 2FA Dialog */}
      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-red-100">
                <ShieldOff className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle>Desactivar 2FA</AlertDialogTitle>
                <AlertDialogDescription>
                  Esto hará tu cuenta menos segura
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-700">
              {twoFactorMethod === 'AUTHENTICATOR'
                ? 'Ingresa el código de tu aplicación de autenticación.'
                : 'Ingresa el código que enviamos a tu correo.'}
            </AlertDescription>
          </Alert>

          <div className="py-4 flex justify-center">
            <InputOTP
              maxLength={6}
              value={disableCode}
              onChange={setDisableCode}
              onComplete={handleDisableComplete}
            >
              <InputOTPGroup>
                {[0, 1, 2].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-11 h-12 text-lg font-semibold rounded-lg border-2"
                  />
                ))}
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                {[3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-11 h-12 text-lg font-semibold rounded-lg border-2"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {twoFactorMethod === 'EMAIL' && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={sendDisableCode}
                disabled={isPending}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reenviar código
              </Button>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDisableCode('')}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisable}
              disabled={isPending || disableCode.length !== 6}
              className="bg-red-600 hover:bg-red-700 gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Desactivando...
                </>
              ) : (
                'Desactivar 2FA'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Backup Codes Dialog */}
      <BackupCodesDialog
        open={showBackupDialog}
        onOpenChange={setShowBackupDialog}
        codes={backupCodes}
        isGenerating={isBackupPending}
        onRegenerate={generateCodes}
      />
    </div>
  );
}
