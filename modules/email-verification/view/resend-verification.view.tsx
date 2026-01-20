'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { useResendVerificationViewModel } from '../view-model/email-verification.view-model';
import { ResendVerificationForm } from '../components/form/resend-verification.form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';

export function ResendVerificationView() {
  const { resend, isPending, error, success } = useResendVerificationViewModel();

  if (success) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        subtitle="Te enviamos un nuevo correo de verificación"
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
              Si existe una cuenta con ese email, recibirás un correo de verificación.
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
      title="Reenviar verificación"
      subtitle="Ingresa tu email para recibir un nuevo correo de verificación"
      showFeatures={false}
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center">
            <Mail className="w-8 h-8 text-cyan-600" />
          </div>
        </div>

        <ResendVerificationForm
          onSubmit={resend}
          isPending={isPending}
          error={error}
          success={success}
        />

        <div className="text-center pt-4">
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
