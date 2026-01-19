'use client';

import Link from 'next/link';
import { usePasswordResetRequestViewModel } from '../view-model/request-reset.view-model';
import { RequestResetForm } from '../components/form/request-reset.form';

export function RequestResetView() {
  const { requestReset, isPending, error, success } = usePasswordResetRequestViewModel();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Olvidé mi contraseña</h1>
          <p className="text-gray-600 mt-2">
            Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
          </p>
        </div>

        <RequestResetForm
          onSubmit={requestReset}
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
