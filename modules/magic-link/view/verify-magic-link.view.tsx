'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useVerifyMagicLink } from '../hooks/magic-link.hook';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface Props {
  token: string | null;
}

export function VerifyMagicLinkView({ token }: Props) {
  const router = useRouter();
  const { verifyMagicLink, isLoading, error, isNewUser } = useVerifyMagicLink();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!token || verified) return;
      setVerified(true);
      const result = await verifyMagicLink(token);
      if (result) {
        setTimeout(() => {
          router.refresh();
          router.push('/settings/security');
        }, 2000);
      }
    };

    verify();
  }, [token, verifyMagicLink, verified, router]);

  if (!token) {
    return (
      <AuthLayout
        title="Enlace inválido"
        subtitle="El enlace de inicio de sesión no es válido"
        showFeatures={false}
      >
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="font-semibold text-destructive mb-2">
              Enlace no válido
            </h3>
            <p className="text-sm text-destructive/80">
              El enlace de inicio de sesión no es válido o ha expirado.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/magic-link">
              <Button variant="outline" className="w-full">
                Solicitar nuevo enlace
              </Button>
            </Link>
            <Link href="/login">
              <Button className="w-full">
                Iniciar sesión con contraseña
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (isLoading || !verified) {
    return (
      <AuthLayout
        title="Verificando..."
        subtitle="Estamos verificando tu enlace de inicio de sesión"
        showFeatures={false}
      >
        <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Verificando enlace
          </h3>
          <p className="text-sm text-muted-foreground">
            Por favor espera mientras verificamos tu enlace mágico...
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout
        title="Error de verificación"
        subtitle="No pudimos verificar tu enlace"
        showFeatures={false}
      >
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="font-semibold text-destructive mb-2">
              Verificación fallida
            </h3>
            <p className="text-sm text-destructive/80">
              {error}
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/magic-link">
              <Button variant="outline" className="w-full">
                Solicitar nuevo enlace
              </Button>
            </Link>
            <Link href="/login">
              <Button className="w-full">
                Iniciar sesión con contraseña
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={isNewUser ? '¡Cuenta creada!' : '¡Bienvenido de nuevo!'}
      subtitle={isNewUser ? 'Tu cuenta ha sido creada exitosamente' : 'Has iniciado sesión correctamente'}
      showFeatures={false}
    >
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-emerald-900 mb-2">
            {isNewUser ? '¡Bienvenido a SecureAuth!' : '¡Sesión iniciada!'}
          </h3>
          <p className="text-sm text-emerald-700">
            {isNewUser
              ? 'Tu cuenta ha sido creada y verificada automáticamente.'
              : 'Has iniciado sesión exitosamente con tu enlace mágico.'}
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Serás redirigido automáticamente...
          </p>
          <Button
            onClick={() => { router.refresh(); router.push('/settings/profile'); }}
            className="gap-2"
          >
            Ir a configuración
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
