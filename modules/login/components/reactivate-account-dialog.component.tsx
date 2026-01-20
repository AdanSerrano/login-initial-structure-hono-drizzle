'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { PasswordInput } from '@/components/ui/pasword-input';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  daysRemaining: number;
  onReactivate: (password: string) => Promise<void>;
  isPending: boolean;
  error?: string | null;
}

const CONFIRM_WORD = 'activar';

export function ReactivateAccountDialog({
  open,
  onOpenChange,
  email,
  daysRemaining,
  onReactivate,
  isPending,
  error,
}: Props) {
  const [step, setStep] = useState<'confirm' | 'password'>('confirm');
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');

  const isConfirmValid = confirmText.toLowerCase() === CONFIRM_WORD;

  const handleConfirmStep = () => {
    if (isConfirmValid) {
      setStep('password');
    }
  };

  const handleReactivate = async () => {
    if (!password) return;
    await onReactivate(password);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep('confirm');
      setConfirmText('');
      setPassword('');
    }
    onOpenChange(newOpen);
  };

  const handleBack = () => {
    setStep('confirm');
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle>Cuenta eliminada</DialogTitle>
              <DialogDescription className="mt-1">
                Esta cuenta fue programada para eliminación
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === 'confirm' ? (
          <>
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 space-y-2">
                <p className="text-sm text-amber-800">
                  La cuenta <span className="font-semibold">{email}</span> será eliminada
                  permanentemente en{' '}
                  <span className="font-bold text-amber-900">
                    {daysRemaining} día{daysRemaining === 1 ? '' : 's'}
                  </span>
                  .
                </p>
                <p className="text-sm text-amber-700">
                  Después de ese período, todos tus datos serán anonimizados y no podrás recuperar
                  tu cuenta.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-reactivate">
                  Para reactivar tu cuenta, escribe{' '}
                  <span className="font-mono font-bold text-primary">{CONFIRM_WORD}</span>
                </Label>
                <Input
                  id="confirm-reactivate"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={`Escribe ${CONFIRM_WORD} para continuar`}
                  disabled={isPending}
                  autoComplete="off"
                />
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmStep}
                disabled={!isConfirmValid || isPending}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Quiero reactivar mi cuenta
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-800">
                  Ingresa tu contraseña para confirmar la reactivación de tu cuenta.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reactivate-password">Contraseña</Label>
                <PasswordInput
                  id="reactivate-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  disabled={isPending}
                />
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                Volver
              </Button>
              <Button
                onClick={handleReactivate}
                disabled={!password || isPending}
                className="w-full sm:w-auto"
              >
                {isPending ? 'Reactivando...' : 'Reactivar cuenta'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
