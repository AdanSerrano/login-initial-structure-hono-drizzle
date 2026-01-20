'use client';

import Link from 'next/link';
import { useSendMagicLink } from '../hooks/magic-link.hook';
import { MagicLinkForm } from '../components/form/magic-link.form';

export function RequestMagicLinkView() {
  const { sendMagicLink, isLoading, error, success } = useSendMagicLink();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Iniciar sesión con enlace mágico</h1>
          <p className="text-gray-600 mt-2">
            Ingresa tu email y te enviaremos un enlace para iniciar sesión sin contraseña.
          </p>
        </div>

        <MagicLinkForm
          onSubmit={sendMagicLink}
          isPending={isLoading}
          error={error}
          success={success}
        />

        <div className="text-center text-sm space-y-2">
          <div>
            <Link href="/login" className="text-blue-600 hover:underline">
              Iniciar sesión con contraseña
            </Link>
          </div>
          <div>
            <span className="text-gray-600">¿No tienes cuenta? </span>
            <Link href="/register" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
