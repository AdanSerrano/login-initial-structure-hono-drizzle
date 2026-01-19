'use client';

import Link from 'next/link';
import { usePasswordResetViewModel } from '../view-model/reset-password.view-model';
import { ResetPasswordForm } from '../components/form/reset-password.form';

interface Props {
  token: string;
}

export function ResetPasswordView({ token }: Props) {
  const { resetPassword, isPending, error, isValidating, isValidToken, email } = usePasswordResetViewModel(token);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
          <p className="text-gray-600">Validando token...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Token inválido</h1>
            <p className="text-gray-600 mt-2">
              El enlace de restablecimiento es inválido o ha expirado.
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Restablecer contraseña</h1>
          {email && (
            <p className="text-gray-600 mt-2">
              Para: {email}
            </p>
          )}
        </div>

        <ResetPasswordForm
          onSubmit={resetPassword}
          isPending={isPending}
          error={error}
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
