'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/modules/user/hooks/user.hook';
import { useLogout } from '@/modules/logout/hooks/logout.hook';
import {
  Shield,
  Fingerprint,
  Mail,
  Smartphone,
  Key,
  History,
  Download,
  Lock,
  Sparkles,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Monitor,
  Globe,
  Zap,
} from 'lucide-react';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  const { user, isAuthenticated, isHydrated } = useUser();
  const { logout, isPending } = useLogout();

  const features = [
    {
      icon: Shield,
      title: 'Autenticación Segura',
      description: 'Login con email y contraseña con protección contra ataques de fuerza bruta.',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      icon: Fingerprint,
      title: 'Autenticación de Dos Factores',
      description: 'Protege tu cuenta con Google Authenticator o códigos por email.',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      icon: Sparkles,
      title: 'Magic Link',
      description: 'Inicia sesión sin contraseña con un enlace mágico enviado a tu email.',
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
    {
      icon: Monitor,
      title: 'Gestión de Sesiones',
      description: 'Visualiza y controla todos los dispositivos conectados a tu cuenta.',
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      icon: History,
      title: 'Registro de Actividad',
      description: 'Historial completo de acciones con ubicación y dispositivo.',
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
    {
      icon: Key,
      title: 'Códigos de Respaldo',
      description: 'Códigos de recuperación para acceder si pierdes tu dispositivo 2FA.',
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      icon: Mail,
      title: 'Verificación de Email',
      description: 'Confirma tu identidad y mantén tu cuenta segura.',
      color: 'text-cyan-600',
      bg: 'bg-cyan-100',
    },
    {
      icon: Download,
      title: 'Exportar Datos',
      description: 'Descarga todos tus datos en formato JSON (cumplimiento GDPR).',
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
    },
    {
      icon: Smartphone,
      title: 'Dispositivos de Confianza',
      description: 'Marca dispositivos como seguros para omitir 2FA temporalmente.',
      color: 'text-teal-600',
      bg: 'bg-teal-100',
    },
  ];

  const stats = [
    { label: 'Métodos de Login', value: '3', icon: Lock },
    { label: 'Tipos de 2FA', value: '2', icon: Shield },
    { label: 'Eventos Auditados', value: '20+', icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AuthSystem
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Características
              </a>
              <a href="#security" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Seguridad
              </a>
            </nav>

            <div className="flex items-center gap-3">
              {!isHydrated ? (
                <div className="animate-pulse h-9 w-28 bg-gray-200 rounded-lg"></div>
              ) : isAuthenticated ? (
                <>
                  <Link href="/settings/profile">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">{user?.name || 'Mi cuenta'}</span>
                    </Button>
                  </Link>
                  <Link href="/settings/security">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Seguridad</span>
                    </Button>
                  </Link>
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
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Iniciar sesión</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-white"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Sistema de Autenticación Completo
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Seguridad de nivel{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  empresarial
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {isAuthenticated
                  ? `Bienvenido de nuevo, ${user?.name || user?.email}. Tu cuenta está protegida con las mejores prácticas de seguridad.`
                  : 'Autenticación robusta con 2FA, magic links, gestión de sesiones y mucho más. Todo lo que necesitas para proteger a tus usuarios.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <>
                    <Link href="/settings/security">
                      <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Shield className="w-5 h-5" />
                        Configurar Seguridad
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/settings/profile">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                        <User className="w-5 h-5" />
                        Ver mi Perfil
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/register">
                      <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Comenzar Gratis
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/magic-link">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                        <Sparkles className="w-5 h-5" />
                        Probar Magic Link
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm mb-2">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Características</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Todo lo que necesitas
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Un sistema de autenticación completo con las mejores prácticas de seguridad implementadas.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-300">
                  <CardHeader>
                    <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-20 sm:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">Seguridad</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Protección en cada capa
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Implementamos las mejores prácticas de seguridad para mantener tus datos protegidos.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Lock, text: 'Contraseñas hasheadas con bcrypt' },
                    { icon: Shield, text: 'Tokens JWT con refresh automático' },
                    { icon: Globe, text: 'Detección de ubicación sospechosa' },
                    { icon: History, text: 'Auditoría completa de acciones' },
                    { icon: Key, text: 'Historial de contraseñas' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>

                {!isAuthenticated && (
                  <div className="mt-8">
                    <Link href="/register">
                      <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Crear cuenta segura
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl"></div>
                <Card className="relative bg-white/80 backdrop-blur border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Estado de Seguridad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Email verificado</span>
                          <Badge variant={user?.emailVerified ? 'default' : 'secondary'} className={user?.emailVerified ? 'bg-green-100 text-green-700' : ''}>
                            {user?.emailVerified ? 'Verificado' : 'Pendiente'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Autenticación 2FA</span>
                          <Badge variant={user?.isTwoFactorEnabled ? 'default' : 'secondary'} className={user?.isTwoFactorEnabled ? 'bg-green-100 text-green-700' : ''}>
                            {user?.isTwoFactorEnabled ? 'Habilitado' : 'Deshabilitado'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Sesión actual</span>
                          <Badge className="bg-blue-100 text-blue-700">Activa</Badge>
                        </div>
                        <Link href="/settings/security" className="block">
                          <Button variant="outline" className="w-full mt-2">
                            Ver configuración completa
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Verificación de email</span>
                          <Badge className="bg-green-100 text-green-700">Incluido</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">2FA (TOTP + Email)</span>
                          <Badge className="bg-green-100 text-green-700">Incluido</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Magic Link</span>
                          <Badge className="bg-green-100 text-green-700">Incluido</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Gestión de sesiones</span>
                          <Badge className="bg-green-100 text-green-700">Incluido</Badge>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="py-20 sm:py-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Listo para comenzar?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Crea tu cuenta en segundos y experimenta la mejor seguridad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Crear cuenta gratis
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Ya tengo cuenta
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
