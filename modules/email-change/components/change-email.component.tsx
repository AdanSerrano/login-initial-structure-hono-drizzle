'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEmailChange } from '../hooks/email-change.hook';
import { requestEmailChangeSchema, type RequestEmailChangeInput } from '../validations/schema/email-change.schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Mail, Loader2, X, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ChangeEmailComponentProps {
  currentEmail: string;
}

export function ChangeEmailComponent({ currentEmail }: ChangeEmailComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    isLoading,
    isPending,
    error,
    success,
    pendingRequest,
    fetchPending,
    requestChange,
    cancelPending,
    clearMessages,
  } = useEmailChange();

  const form = useForm<RequestEmailChangeInput>({
    resolver: zodResolver(requestEmailChangeSchema),
    defaultValues: {
      newEmail: '',
      password: '',
    },
  });

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const onSubmit = async (data: RequestEmailChangeInput) => {
    const result = await requestChange(data);
    if (result.success) {
      form.reset();
      setDialogOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      form.reset();
      clearMessages();
    }
  };

  const formatExpiryTime = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hora${hours === 1 ? '' : 's'}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Correo electrónico
        </CardTitle>
        <CardDescription>
          Gestiona el correo electrónico asociado a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Correo actual</p>
            <p className="text-sm text-muted-foreground">{currentEmail}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                Cambiar correo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cambiar correo electrónico</DialogTitle>
                <DialogDescription>
                  Ingresa tu nuevo correo electrónico y tu contraseña para confirmar el cambio.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="newEmail">Nuevo correo electrónico</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      placeholder="nuevo@email.com"
                      {...form.register('newEmail')}
                      disabled={isPending}
                    />
                    {form.formState.errors.newEmail && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.newEmail.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña actual</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Tu contraseña"
                      {...form.register('password')}
                      disabled={isPending}
                    />
                    {form.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar verificación
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pending request alert */}
        {pendingRequest?.hasPending && (
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-amber-800 dark:text-amber-200">
                Verificación pendiente para <strong>{pendingRequest.newEmail}</strong>
                {pendingRequest.expiresAt && (
                  <span className="text-amber-600 dark:text-amber-400">
                    {' '}(expira en {formatExpiryTime(pendingRequest.expiresAt)})
                  </span>
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelPending}
                disabled={isPending}
                className="ml-2 h-7 px-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Success message */}
        {success && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {success}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
