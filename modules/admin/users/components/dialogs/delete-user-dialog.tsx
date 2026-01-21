"use client";

import { memo, useCallback, useTransition } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { AdminUser } from "../../types/admin-users.types";

interface Props {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
}

function DeleteUserDialogComponent({ user, open, onOpenChange, onConfirm }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = useCallback(() => {
    if (!user) return;

    startTransition(async () => {
      try {
        await onConfirm(user.id);
        onOpenChange(false);
      } catch {
        // Error handled by hook
      }
    });
  }, [user, onConfirm, onOpenChange]);

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Eliminar usuario
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                ¿Estás seguro de que deseas eliminar a{" "}
                <strong>{user.name || user.email}</strong>?
              </p>
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  El usuario será marcado como eliminado pero sus datos se conservarán
                  durante 30 días. Podrás restaurarlo durante ese período.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? "Eliminando..." : "Eliminar usuario"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const DeleteUserDialog = memo(DeleteUserDialogComponent);
