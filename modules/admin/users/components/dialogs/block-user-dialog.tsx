"use client";

import { memo, useState, useCallback, useTransition } from "react";
import { ShieldOff, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import type { AdminUser, BlockUserInput } from "../../types/admin-users.types";

interface Props {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string, data: BlockUserInput) => Promise<void>;
}

function BlockUserDialogComponent({ user, open, onOpenChange, onConfirm }: Props) {
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleConfirm = useCallback(() => {
    if (!user || !reason.trim()) return;

    startTransition(async () => {
      try {
        await onConfirm(user.id, { reason: reason.trim() });
        setReason("");
        onOpenChange(false);
      } catch {
        // Error handled by hook
      }
    });
  }, [user, reason, onConfirm, onOpenChange]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        setReason("");
      }
      onOpenChange(newOpen);
    },
    [onOpenChange]
  );

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldOff className="h-5 w-5 text-orange-500" />
            Bloquear usuario
          </DialogTitle>
          <DialogDescription>
            Bloquear a <strong>{user.name || user.email}</strong> impedirá que inicie sesión.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="destructive" className="bg-orange-50 border-orange-200 text-orange-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Esta acción cerrará todas las sesiones activas del usuario.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo del bloqueo *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Escribe el motivo del bloqueo..."
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isPending}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isPending ? "Bloqueando..." : "Bloquear usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const BlockUserDialog = memo(BlockUserDialogComponent);
