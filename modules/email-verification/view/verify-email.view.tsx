'use client';

import Link from 'next/link';
import { useEmailVerificationViewModel } from '../view-model/email-verification.view-model';

interface Props {
  token: string;
}

export function VerifyEmailView({ token }: Props) {
  const { isVerifying, isVerified, error } = useEmailVerificationViewModel(token);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600">Verificando tu correo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600">Error de verificación</h1>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>

          <div className="text-center space-y-2">
            <Link
              href="/resend-verification"
              className="block text-blue-600 hover:underline"
            >
              Reenviar correo de verificación
            </Link>
            <Link
              href="/login"
              className="block text-gray-500 hover:underline"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-600">Correo verificado</h1>
            <p className="text-gray-600 mt-2">
              Tu correo electrónico ha sido verificado correctamente.
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Serás redirigido al inicio de sesión en unos segundos...
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-blue-600 hover:underline"
            >
              Ir al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
