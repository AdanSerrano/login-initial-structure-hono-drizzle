'use client';

import Link from 'next/link';
import { Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useEmailVerificationViewModel } from '../view-model/email-verification.view-model';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';

interface Props {
  token: string;
}

export function VerifyEmailView({ token }: Props) {
  const { isVerifying, isVerified, error } = useEmailVerificationViewModel(token);

  if (isVerifying) {
    return (
      <AuthLayout
        title="Verificando..."
        subtitle="Estamos verificando tu correo electrónico"
        showFeatures={false}
      >
        <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Verificando email
          </h3>
          <p className="text-sm text-muted-foreground">
            Por favor espera mientras verificamos tu correo electrónico...
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout
        title="Error de verificación"
        subtitle="No pudimos verificar tu correo"
        showFeatures={false}
      >
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="font-semibold text-destructive mb-2">
              Verificación fallida
            </h3>
            <p className="text-sm text-destructive/80">
              {error}
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/resend-verification">
              <Button variant="outline" className="w-full">
                Reenviar correo de verificación
              </Button>
            </Link>
            <Link href="/login">
              <Button className="w-full">
                Volver al inicio de sesión
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (isVerified) {
    return (
      <AuthLayout
        title="¡Correo verificado!"
        subtitle="Tu correo electrónico ha sido verificado correctamente"
        showFeatures={false}
      >
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-emerald-900 mb-2">
              ¡Email verificado exitosamente!
            </h3>
            <p className="text-sm text-emerald-700">
              Tu correo electrónico ha sido verificado. Ahora puedes acceder a todas las funciones de tu cuenta.
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Serás redirigido al inicio de sesión en unos segundos...
            </p>
            <Link href="/login">
              <Button className="gap-2">
                Ir al inicio de sesión
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return null;
}
