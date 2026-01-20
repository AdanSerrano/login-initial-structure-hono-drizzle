'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DeleteAccountDialog } from './delete-account-dialog.component';
import { userApi } from '../api/user.api';
import { logoutApi } from '@/modules/logout/api/logout.api';
import { useUserStore } from '../state/user.state';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2, Clock, ShieldAlert } from 'lucide-react';

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
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-orange-50/30 shadow-lg shadow-red-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-100 to-orange-100">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-700">Zona de peligro</CardTitle>
              <CardDescription className="text-red-600/80">
                Acciones irreversibles para tu cuenta
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive" className="border-red-200 bg-red-50/80">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-red-800">Antes de eliminar tu cuenta</AlertTitle>
            <AlertDescription className="text-red-700 space-y-2 mt-2">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Tendrás <strong>30 días</strong> para reactivar tu cuenta iniciando sesión nuevamente.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Trash2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Después de 30 días, <strong>todos tus datos serán eliminados permanentemente</strong>.
                </span>
              </div>
            </AlertDescription>
          </Alert>

          <Button
            variant="destructive"
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/25"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar mi cuenta
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
