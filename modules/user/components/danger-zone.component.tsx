'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteAccountDialog } from './delete-account-dialog.component';
import { userApi } from '../api/user.api';
import { logoutApi } from '@/modules/logout/api/logout.api';
import { useUserStore } from '../state/user.state';
import { useRouter } from 'next/navigation';

export function DangerZone() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { clearUser } = useUserStore();

  const handleDeleteAccount = async () => {
    startTransition(async () => {
      try {
        const message = await userApi.deleteMe();
        setIsDialogOpen(false);

        // Cerrar sesión después de eliminar la cuenta
        try {
          await logoutApi.logout();
        } catch {
          // Continuar aunque falle el logout del servidor
        }

        clearUser();
        toast.success(message);
        router.push('/login');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la cuenta';
        toast.error(errorMessage);
      }
    });
  };

  return (
    <>
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de peligro</CardTitle>
          <CardDescription>
            Una vez que elimines tu cuenta, tendrás 30 días para reactivarla. Después de ese período,
            todos tus datos serán eliminados permanentemente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setIsDialogOpen(true)}>
            Eliminar cuenta
          </Button>
        </CardContent>
      </Card>

      <DeleteAccountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDeleteAccount}
        isPending={isPending}
      />
    </>
  );
}
