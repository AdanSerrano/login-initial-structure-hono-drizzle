'use client';

import Link from 'next/link';
import { RegisterViewModel } from '../view-model/register.view-model';
import { RegisterForm } from '../components/form/register.form';

export function RegisterView() {
  const { handleRegister, isPending, error } = RegisterViewModel();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <RegisterForm
            onSubmit={handleRegister}
            isPending={isPending}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
