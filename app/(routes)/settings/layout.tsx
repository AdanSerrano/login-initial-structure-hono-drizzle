'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/modules/user/hooks/user.hook';
import { useLogout } from '@/modules/logout/hooks/logout.hook';
import { Shield, User, LogOut, ChevronLeft, Lock, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/layout/footer';
import { GlowingOrb } from '@/components/ui/background-effects';

const navigation = [
  { name: 'Perfil', href: '/settings/profile', icon: User, description: 'Información personal' },
  { name: 'Seguridad', href: '/settings/security', icon: Lock, description: '2FA y sesiones' },
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
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 via-background to-background">
      {/* Background decoration */}
      <div className="fixed top-0 right-0 -translate-y-1/2 translate-x-1/2 opacity-20 pointer-events-none">
        <GlowingOrb color="#8b5cf6" size="xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  SecureAuth
                </span>
              </Link>
              <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
                <ChevronLeft className="w-4 h-4" />
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Configuración</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isHydrated ? (
                <div className="animate-pulse h-9 w-28 bg-muted rounded-lg" />
              ) : user ? (
                <>
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-violet-600" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-foreground">{user.name || 'Usuario'}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    disabled={isPending}
                    className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">{isPending ? 'Saliendo...' : 'Salir'}</span>
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                    Iniciar sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Settings Navigation */}
      <div className="border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-2 py-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground hover:bg-violet-100/50"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Inicio</span>
              </Button>
            </Link>
            <div className="w-px bg-border/50 mx-1" />
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      'gap-2 transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25'
                        : 'text-muted-foreground hover:text-foreground hover:bg-violet-100/50'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                    {isActive && (
                      <Badge variant="secondary" className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0">
                        Activo
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {children}
      </main>

      <Footer />
    </div>
  );
}
