'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { usePasswordResetRequestViewModel } from '../view-model/request-reset.view-model';
import { RequestResetForm } from '../components/form/request-reset.form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';

export function RequestResetView() {
  const { requestReset, isPending, error, success } = usePasswordResetRequestViewModel();

  if (success) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        subtitle="Te enviamos instrucciones para restablecer tu contraseña"
        showFeatures={false}
      >
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-emerald-900 mb-2">
              Correo enviado exitosamente
            </h3>
            <p className="text-sm text-emerald-700">
              Si existe una cuenta asociada, recibirás un correo con las instrucciones.
            </p>
          </div>

          <Link href="/login">
            <Button variant="outline" className="w-full gap-2">
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
      title="Recuperar contraseña"
      subtitle="Ingresa tu email para recibir instrucciones"
      showFeatures={false}
    >
      <div className="space-y-6">
        <RequestResetForm
          onSubmit={requestReset}
          isPending={isPending}
          error={error}
          success={success}
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
