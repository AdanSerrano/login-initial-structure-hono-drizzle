'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVerifyMagicLink } from '../hooks/magic-link.hook';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  token: string | null;
}

export function VerifyMagicLinkView({ token }: Props) {
  const router = useRouter();
  const { verifyMagicLink, isLoading, error, isNewUser } = useVerifyMagicLink();
  const [verified, setVerified] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!token || verified) return;
      setVerified(true);
      const result = await verifyMagicLink(token);
      if (result) {
        setSuccess(true);
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/settings/security');
        }, 2000);
      }
    };

    verify();
  }, [token, verifyMagicLink, verified, router]);

  if (!token) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Enlace inválido</CardTitle>
          <CardDescription>
            El enlace de inicio de sesión no es válido o ha expirado.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <Button asChild variant="outline" className="w-full">
            <Link href="/magic-link">Solicitar nuevo enlace</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/login">Iniciar sesión con contraseña</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !verified) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
          <CardTitle>Verificando...</CardTitle>
          <CardDescription>
            Estamos verificando tu enlace de inicio de sesión.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Error de verificación</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <Button asChild variant="outline" className="w-full">
            <Link href="/magic-link">Solicitar nuevo enlace</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/login">Iniciar sesión con contraseña</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle>
          {isNewUser ? '¡Cuenta creada!' : '¡Bienvenido de nuevo!'}
        </CardTitle>
        <CardDescription>
          {isNewUser
            ? 'Tu cuenta ha sido creada exitosamente.'
            : 'Has iniciado sesión exitosamente.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Serás redirigido automáticamente...
        </p>
        <Button onClick={() => router.push('/settings')}>
          Ir a configuración
        </Button>
      </CardContent>
    </Card>
  );
}
