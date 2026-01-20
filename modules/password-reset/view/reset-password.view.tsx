'use client';

import Link from 'next/link';
import { ArrowLeft, XCircle, Loader2 } from 'lucide-react';
import { usePasswordResetViewModel } from '../view-model/reset-password.view-model';
import { ResetPasswordForm } from '../components/form/reset-password.form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
  token: string;
}

export function ResetPasswordView({ token }: Props) {
  const { resetPassword, isPending, error, isValidating, isValidToken, email } = usePasswordResetViewModel(token);

  if (isValidating) {
    return (
      <AuthLayout
        title="Verificando enlace"
        subtitle="Espera un momento..."
        showFeatures={false}
      >
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Validando tu enlace de recuperación</p>
        </div>
      </AuthLayout>
    );
  }

  if (!isValidToken) {
    return (
      <AuthLayout
        title="Enlace inválido"
        subtitle="No pudimos verificar tu enlace"
        showFeatures={false}
      >
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/20 rounded-2xl flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="font-semibold text-destructive mb-2">
              El enlace es inválido o ha expirado
            </h3>
            <p className="text-sm text-muted-foreground">
              Los enlaces de recuperación expiran después de 1 hora por seguridad.
            </p>
          </div>

          <Link href="/forgot-password">
            <Button className="w-full">
              Solicitar nuevo enlace
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="ghost" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver al login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Nueva contraseña"
      subtitle="Crea una contraseña segura para tu cuenta"
      showFeatures={false}
    >
      <div className="space-y-6">
        {email && (
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="text-sm py-1.5 px-3">
              {email}
            </Badge>
          </div>
        )}

        <ResetPasswordForm
          onSubmit={resetPassword}
          isPending={isPending}
          error={error}
        />

        <Link href="/login">
          <Button variant="ghost" className="w-full gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al login
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
