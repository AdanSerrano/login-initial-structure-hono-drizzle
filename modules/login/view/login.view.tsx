'use client';

import Link from 'next/link';
import { LoginViewModel } from '../view-model/login.view-model';
import { LoginForm } from '../components/form/login.form';
import { TwoFactorLoginView } from '@/modules/two-factor/view/two-factor-login.view';
import { ReactivateAccountDialog } from '../components/reactivate-account-dialog.component';
import { Button } from '@/components/ui/button';

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
    // Account deleted
    accountDeleted,
    deletedAccountEmail,
    daysRemaining,
    isReactivating,
    reactivationError,
    reactivateAccount,
    cancelAccountReactivation,
  } = LoginViewModel();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {requiresEmailVerification ? 'Verifica tu correo' : 'Iniciar sesión'}
          </h2>
          {!requiresTwoFactor && !requiresEmailVerification && (
            <p className="mt-2 text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Regístrate
              </Link>
            </p>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {requiresEmailVerification && unverifiedEmail ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">
                  Tu cuenta aún no ha sido verificada.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Enviamos un correo de verificación a{' '}
                  <span className="font-medium text-gray-700">{unverifiedEmail}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                </p>
              </div>

              <div className="border-t pt-4 space-y-3">
                <p className="text-sm text-gray-600 text-center">
                  ¿No recibiste el correo?
                </p>
                <Button
                  onClick={resendVerificationEmail}
                  disabled={isResendingVerification}
                  className="w-full"
                >
                  {isResendingVerification ? 'Enviando...' : 'Reenviar correo de verificación'}
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelEmailVerification}
                  className="w-full"
                >
                  Volver al login
                </Button>
              </div>
            </div>
          ) : requiresTwoFactor && pendingUserId ? (
            <TwoFactorLoginView
              userId={pendingUserId}
              onCancel={cancelTwoFactor}
            />
          ) : (
            <>
              <LoginForm
                onSubmit={handleLogin}
                isPending={isPending}
                error={error}
              />
              <div className="mt-4 text-center space-y-2">
                <div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div>
                  <Link
                    href="/magic-link"
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Iniciar sesión con enlace mágico
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reactivate Account Dialog */}
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
    </div>
  );
}
