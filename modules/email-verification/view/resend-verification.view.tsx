'use client';

import Link from 'next/link';
import { useResendVerificationViewModel } from '../view-model/email-verification.view-model';
import { ResendVerificationForm } from '../components/form/resend-verification.form';

export function ResendVerificationView() {
  const { resend, isPending, error, success } = useResendVerificationViewModel();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reenviar verificación</h1>
          <p className="text-gray-600 mt-2">
            Ingresa tu email para recibir un nuevo correo de verificación.
          </p>
        </div>

        <ResendVerificationForm
          onSubmit={resend}
          isPending={isPending}
          error={error}
          success={success}
        />

        <div className="text-center text-sm">
          <Link href="/login" className="text-blue-600 hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
