'use client';

import Link from 'next/link';
import { Mail, Sparkles, ArrowLeft } from 'lucide-react';
import { LoginViewModel } from '../view-model/login.view-model';
import { LoginForm } from '../components/form/login.form';
import { TwoFactorLoginView } from '@/modules/two-factor/view/two-factor-login.view';
import { ReactivateAccountDialog } from '../components/reactivate-account-dialog.component';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function LoginView() {
  const {
    handleLogin,
    isPending,
    error,
    requiresTwoFactor,
    pendingUserId,
    cancelTwoFactor,
    requiresEmailVerification,
    unverifiedEmail,
    isResendingVerification,
    resendVerificationEmail,
    cancelEmailVerification,
    accountDeleted,
    deletedAccountEmail,
    daysRemaining,
    isReactivating,
    reactivationError,
    reactivateAccount,
    cancelAccountReactivation,
  } = LoginViewModel();

  if (requiresEmailVerification && unverifiedEmail) {
    return (
      <AuthLayout
        title="Verificación pendiente"
        subtitle="Tu cuenta necesita ser verificada"
        showFeatures={false}
      >
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-semibold text-amber-900 mb-2">
              Revisa tu bandeja de entrada
            </h3>
            <p className="text-sm text-amber-700 mb-1">
              Enviamos un correo de verificación a
            </p>
            <p className="font-medium text-amber-900">{unverifiedEmail}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              ¿No recibiste el correo?
            </p>
            <Button
              onClick={resendVerificationEmail}
              disabled={isResendingVerification}
              className="w-full h-11"
            >
              {isResendingVerification ? 'Enviando...' : 'Reenviar correo de verificación'}
            </Button>
            <Button
              variant="ghost"
              onClick={cancelEmailVerification}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al login
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (requiresTwoFactor && pendingUserId) {
    return (
      <AuthLayout
        title="Verificación en dos pasos"
        subtitle="Ingresa el código de seguridad"
        showFeatures={false}
      >
        <TwoFactorLoginView
          userId={pendingUserId}
          onCancel={cancelTwoFactor}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Ingresa tus credenciales para acceder a tu cuenta"
    >
      <div className="space-y-6">
        <LoginForm
          onSubmit={handleLogin}
          isPending={isPending}
          error={error}
        />

        <div className="flex items-center justify-between text-sm">
          <Link
            href="/forgot-password"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground uppercase tracking-wider">
            o continúa con
          </span>
        </div>

        <Link href="/magic-link" className="block">
          <Button variant="outline" className="w-full h-11 gap-2">
            <Sparkles className="w-4 h-4" />
            Enlace mágico
          </Button>
        </Link>

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Crear cuenta
          </Link>
        </p>
      </div>

      <ReactivateAccountDialog
        open={accountDeleted}
        onOpenChange={(open) => {
          if (!open) cancelAccountReactivation();
        }}
        email={deletedAccountEmail || ''}
        daysRemaining={daysRemaining}
        onReactivate={reactivateAccount}
        isPending={isReactivating}
        error={reactivationError}
      />
    </AuthLayout>
  );
}
