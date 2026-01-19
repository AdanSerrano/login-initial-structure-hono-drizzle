'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@/modules/user/hooks/user.hook';
import { useLogout } from '@/modules/logout/hooks/logout.hook';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useUser();
  const { logout, isPending } = useLogout();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Mi App</h1>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
            ) : isAuthenticated ? (
              <>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">
                  Hola, <span className="font-medium">{user?.name}</span>
                </Link>
                <Button
                  variant="outline"
                  onClick={logout}
                  disabled={isPending}
                >
                  {isPending ? 'Cerrando...' : 'Cerrar sesión'}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Iniciar sesión</Button>
                </Link>
                <Link href="/register">
                  <Button>Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Bienvenido a Mi App
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {isAuthenticated
              ? `Has iniciado sesión como ${user?.email}`
              : 'Inicia sesión o regístrate para continuar'}
          </p>
          {isAuthenticated && (
            <div className="mt-8">
              <Link href="/profile">
                <Button>Ver mi perfil</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
