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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isPending: boolean;
}

export function DeleteAccountDialog({ open, onOpenChange, onConfirm, isPending }: Props) {
  const [confirmText, setConfirmText] = useState('');
  const isValid = confirmText === 'delete';

  const handleConfirm = async () => {
    if (!isValid) return;
    await onConfirm();
    setConfirmText('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmText('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Eliminar cuenta
          </DialogTitle>
          <DialogDescription>
            Esta acción programará la eliminación de tu cuenta. Tendrás 30 días para
            reactivarla iniciando sesión.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Para confirmar, escribe{' '}
            <span className="font-mono font-bold text-foreground">delete</span> abajo:
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Escribe delete para confirmar"
            disabled={isPending}
            autoComplete="off"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!isValid || isPending}>
            {isPending ? 'Eliminando...' : 'Eliminar cuenta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
