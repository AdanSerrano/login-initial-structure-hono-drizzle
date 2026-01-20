'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/modules/user/hooks/user.hook';
import { useLogout } from '@/modules/logout/hooks/logout.hook';
import { Shield, User, LogOut, ChevronLeft, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/layout/footer';

const navigation = [
  { name: 'Perfil', href: '/settings/profile', icon: User },
  { name: 'Seguridad', href: '/settings/security', icon: Lock },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isHydrated } = useUser();
  const { logout, isPending } = useLogout();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AuthSystem
                </span>
              </Link>
              <div className="hidden sm:flex items-center gap-1 text-gray-400">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Configuración</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isHydrated ? (
                <div className="animate-pulse h-9 w-28 bg-gray-200 rounded-lg"></div>
              ) : user ? (
                <>
                  <span className="hidden sm:block text-sm text-gray-600">
                    {user.name || user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    disabled={isPending}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">{isPending ? 'Saliendo...' : 'Salir'}</span>
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button size="sm">Iniciar sesión</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Settings Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 py-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      'gap-2',
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        : ''
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
