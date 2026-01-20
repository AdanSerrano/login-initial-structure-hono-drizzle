'use client';

import { useState } from 'react';
import { useTwoFactorLoginViewModel } from '../view-model/two-factor.view-model';
import { TwoFactorForm } from '../components/form/two-factor.form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Key } from 'lucide-react';

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
    <div className="flex items-center space-x-2">
      <Checkbox
        id="trust-device"
        checked={trustDevice}
        onCheckedChange={(checked) => setTrustDevice(checked === true)}
      />
      <Label
        htmlFor="trust-device"
        className="text-sm font-normal text-gray-600 cursor-pointer"
      >
        Confiar en este dispositivo por 30 días
      </Label>
    </div>
  );

  if (useBackupCode) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Código de respaldo</h2>
          <p className="text-gray-600 mt-2">
            Ingresa uno de tus códigos de respaldo de 8 caracteres
          </p>
        </div>

        <form onSubmit={handleBackupCodeSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backup-code">Código de respaldo</Label>
            <Input
              id="backup-code"
              type="text"
              placeholder="XXXXXXXX"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
              className="text-center text-xl tracking-widest font-mono"
              maxLength={8}
              autoComplete="off"
            />
          </div>

          <TrustDeviceCheckbox />

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || backupCode.length < 8}
          >
            {isPending ? 'Verificando...' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => {
              toggleBackupCodeMode();
              setBackupCode('');
            }}
            className="text-sm text-primary hover:underline"
          >
            Volver a usar código de autenticación
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="block w-full text-sm text-gray-500 hover:underline"
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
        <h2 className="text-xl font-bold">Verificación de dos factores</h2>
        <p className="text-gray-600 mt-2">
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

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={toggleBackupCodeMode}
          className="text-sm text-primary hover:underline"
        >
          Usar código de respaldo
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="block w-full text-sm text-gray-500 hover:underline"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
