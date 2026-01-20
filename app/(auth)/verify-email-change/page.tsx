'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEmailChange } from '@/modules/email-change/hooks/email-change.hook';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailChangeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { verifyChange, isPending, error, success } = useEmailChange();
  const [verified, setVerified] = useState(false);
  const [newEmail, setNewEmail] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!token || verified) return;
      setVerified(true);
      const result = await verifyChange(token);
      if (result.success && result.newEmail) {
        setNewEmail(result.newEmail);
      }
    };

    verify();
  }, [token, verifyChange, verified]);

  if (!token) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Enlace inválido</CardTitle>
          <CardDescription>
            El enlace de verificación no es válido o ha expirado.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/settings/security">Volver a configuración</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isPending || !verified) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
          <CardTitle>Verificando...</CardTitle>
          <CardDescription>
            Estamos verificando tu nuevo correo electrónico.
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
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/settings/security">Volver a configuración</Link>
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
        <CardTitle>Correo actualizado</CardTitle>
        <CardDescription>
          {success || 'Tu correo electrónico ha sido actualizado exitosamente.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {newEmail && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>Tu nuevo correo es: <strong>{newEmail}</strong></span>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Ahora puedes usar tu nuevo correo para iniciar sesión.
        </p>
        <Button onClick={() => router.push('/login')}>
          Iniciar sesión
        </Button>
      </CardContent>
    </Card>
  );
}

function VerifyEmailChangeSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <CardTitle>Cargando...</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function VerifyEmailChangePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<VerifyEmailChangeSkeleton />}>
        <VerifyEmailChangeContent />
      </Suspense>
    </div>
  );
}
