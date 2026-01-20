'use client';

import Link from 'next/link';
import { RegisterViewModel } from '../view-model/register.view-model';
import { RegisterForm } from '../components/form/register.form';
import { AuthLayout } from '@/components/auth/auth-layout';

export function RegisterView() {
  const { handleRegister, isPending, error } = RegisterViewModel();

  return (
    <AuthLayout
      title="Crear tu cuenta"
      subtitle="Completa tus datos para comenzar"
    >
      <div className="space-y-6">
        <RegisterForm
          onSubmit={handleRegister}
          isPending={isPending}
          error={error}
        />

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
