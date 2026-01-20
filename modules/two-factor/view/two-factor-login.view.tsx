'use client';

import { useState } from 'react';
import { useTwoFactorLoginViewModel } from '../view-model/two-factor.view-model';
import { TwoFactorForm } from '../components/form/two-factor.form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Key, Shield, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

interface Props {
  userId: string;
  onCancel?: () => void;
}

export function TwoFactorLoginView({ userId, onCancel }: Props) {
  const {
    verifyLogin,
    verifyWithBackupCode,
    useBackupCode,
    toggleBackupCodeMode,
    isPending,
    error,
  } = useTwoFactorLoginViewModel();

  const [backupCode, setBackupCode] = useState('');
  const [trustDevice, setTrustDevice] = useState(false);

  const handleSubmit = async (values: { code: string }) => {
    await verifyLogin({ userId, code: values.code, trustDevice });
  };

  const handleBackupCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (backupCode.trim()) {
      await verifyWithBackupCode(userId, backupCode.trim(), trustDevice);
    }
  };

  const TrustDeviceCheckbox = () => (
    <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary/50">
      <Checkbox
        id="trust-device"
        checked={trustDevice}
        onCheckedChange={(checked) => setTrustDevice(checked === true)}
      />
      <Label
        htmlFor="trust-device"
        className="text-sm font-normal text-muted-foreground cursor-pointer"
      >
        Confiar en este dispositivo por 30 días
      </Label>
    </div>
  );

  if (useBackupCode) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Código de respaldo</h2>
          <p className="text-muted-foreground mt-2">
            Ingresa uno de tus códigos de respaldo de 8 caracteres
          </p>
        </div>

        <form onSubmit={handleBackupCodeSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="backup-code" className="text-sm font-medium">Código de respaldo</Label>
            <Input
              id="backup-code"
              type="text"
              placeholder="XXXXXXXX"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
              className="h-14 text-center text-xl tracking-[0.3em] font-mono bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-2"
              maxLength={8}
              autoComplete="off"
            />
          </div>

          <TrustDeviceCheckbox />

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 font-medium"
            disabled={isPending || backupCode.length < 8}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </Button>
        </form>

        <div className="text-center space-y-3 pt-2">
          <button
            type="button"
            onClick={() => {
              toggleBackupCodeMode();
              setBackupCode('');
            }}
            className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Volver a usar código de autenticación
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="block w-full text-sm text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Verificación de dos factores</h2>
        <p className="text-muted-foreground mt-2">
          Ingresa el código de tu aplicación autenticadora
        </p>
      </div>

      <TwoFactorForm
        onSubmit={handleSubmit}
        isPending={isPending}
        error={error}
        submitText="Iniciar sesión"
      />

      <TrustDeviceCheckbox />

      <div className="text-center space-y-3 pt-2">
        <button
          type="button"
          onClick={toggleBackupCodeMode}
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          ¿Perdiste acceso? Usar código de respaldo
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="block w-full text-sm text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
