'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { useSendMagicLink } from '../hooks/magic-link.hook';
import { MagicLinkForm } from '../components/form/magic-link.form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';

export function RequestMagicLinkView() {
  const { sendMagicLink, isLoading, error, success } = useSendMagicLink();

  if (success) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        subtitle="Te enviamos un enlace mágico para iniciar sesión"
        showFeatures={false}
      >
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-emerald-900 mb-2">
              Enlace enviado exitosamente
            </h3>
            <p className="text-sm text-emerald-700">
              Si existe una cuenta asociada a ese email, recibirás un enlace para iniciar sesión.
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
      title="Enlace mágico"
      subtitle="Inicia sesión sin contraseña, solo con tu email"
      showFeatures={false}
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <MagicLinkForm
          onSubmit={sendMagicLink}
          isPending={isLoading}
          error={error}
          success={success}
        />

        <div className="text-center text-sm space-y-3 pt-4">
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Iniciar sesión con contraseña
          </Link>
          <div>
            <span className="text-muted-foreground">¿No tienes cuenta? </span>
            <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
