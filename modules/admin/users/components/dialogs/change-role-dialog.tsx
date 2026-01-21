"use client";

import { memo, useState, useCallback, useTransition } from "react";
import { Crown, User, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

import type { AdminUser } from "../../types/admin-users.types";

interface Props {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string, role: "USER" | "ADMIN") => Promise<void>;
}

function ChangeRoleDialogComponent({ user, open, onOpenChange, onConfirm }: Props) {
  const [selectedRole, setSelectedRole] = useState<"USER" | "ADMIN">("USER");
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (newOpen && user) {
        setSelectedRole(user.role);
      }
      onOpenChange(newOpen);
    },
    [user, onOpenChange]
  );

  const handleConfirm = useCallback(() => {
    if (!user) return;

    startTransition(async () => {
      try {
        await onConfirm(user.id, selectedRole);
        onOpenChange(false);
      } catch {
        // Error handled by hook
      }
    });
  }, [user, selectedRole, onConfirm, onOpenChange]);

  if (!user) return null;

  const isChangingToAdmin = selectedRole === "ADMIN" && user.role !== "ADMIN";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Cambiar rol de usuario
          </DialogTitle>
          <DialogDescription>
            Cambiar el rol de <strong>{user.name || user.email}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isChangingToAdmin && (
            <Alert className="bg-amber-50 border-amber-200">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Los administradores tienen acceso completo al sistema, incluyendo
                la gestión de usuarios.
              </AlertDescription>
            </Alert>
          )}

          <RadioGroup
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value as "USER" | "ADMIN")}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
              <RadioGroupItem value="USER" id="role-user" className="mt-0.5" />
              <Label htmlFor="role-user" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 font-medium">
                  <User className="h-4 w-4" />
                  Usuario
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Acceso estándar a las funciones básicas del sistema.
                </p>
              </Label>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
              <RadioGroupItem value="ADMIN" id="role-admin" className="mt-0.5" />
              <Label htmlFor="role-admin" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 font-medium">
                  <Crown className="h-4 w-4 text-purple-500" />
                  Administrador
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Acceso completo incluyendo gestión de usuarios y configuración.
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedRole === user.role || isPending}
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const ChangeRoleDialog = memo(ChangeRoleDialogComponent);
