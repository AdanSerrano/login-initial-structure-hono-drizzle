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
  ArrowRight,
  Check,
} from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { ScrollAnimation, TextReveal } from '@/components/ui/scroll-animation';
import {
  Spotlight,
  GridBackground,
  GradientBlob,
  GlowingOrb,
  DotPattern,
} from '@/components/ui/background-effects';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

export default function Home() {
  const { user, isAuthenticated, isHydrated } = useUser();
  const { logout, isPending } = useLogout();

  const features = [
    {
      icon: Shield,
      title: 'Autenticación Segura',
      description: 'Login con email y contraseña con protección contra ataques de fuerza bruta.',
      color: 'text-violet-600',
      bg: 'bg-violet-500/10',
      gradient: 'from-violet-500 to-violet-600',
    },
    {
      icon: Fingerprint,
      title: 'Autenticación de Dos Factores',
      description: 'Protege tu cuenta con Google Authenticator o códigos por email.',
      color: 'text-purple-600',
      bg: 'bg-purple-500/10',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: Sparkles,
      title: 'Magic Link',
      description: 'Inicia sesión sin contraseña con un enlace mágico enviado a tu email.',
      color: 'text-fuchsia-600',
      bg: 'bg-fuchsia-500/10',
      gradient: 'from-fuchsia-500 to-fuchsia-600',
    },
    {
      icon: Monitor,
      title: 'Gestión de Sesiones',
      description: 'Visualiza y controla todos los dispositivos conectados a tu cuenta.',
      color: 'text-violet-600',
      bg: 'bg-violet-500/10',
      gradient: 'from-violet-600 to-purple-600',
    },
    {
      icon: History,
      title: 'Registro de Actividad',
      description: 'Historial completo de acciones con ubicación y dispositivo.',
      color: 'text-purple-600',
      bg: 'bg-purple-500/10',
      gradient: 'from-purple-600 to-fuchsia-600',
    },
    {
      icon: Key,
      title: 'Códigos de Respaldo',
      description: 'Códigos de recuperación para acceder si pierdes tu dispositivo 2FA.',
      color: 'text-fuchsia-600',
      bg: 'bg-fuchsia-500/10',
      gradient: 'from-fuchsia-600 to-pink-600',
    },
    {
      icon: Mail,
      title: 'Verificación de Email',
      description: 'Confirma tu identidad y mantén tu cuenta segura.',
      color: 'text-violet-600',
      bg: 'bg-violet-500/10',
      gradient: 'from-indigo-500 to-violet-600',
    },
    {
      icon: Download,
      title: 'Exportar Datos',
      description: 'Descarga todos tus datos en formato JSON (cumplimiento GDPR).',
      color: 'text-purple-600',
      bg: 'bg-purple-500/10',
      gradient: 'from-purple-500 to-indigo-600',
    },
    {
      icon: Smartphone,
      title: 'Dispositivos de Confianza',
      description: 'Marca dispositivos como seguros para omitir 2FA temporalmente.',
      color: 'text-violet-600',
      bg: 'bg-violet-500/10',
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  const stats = [
    { label: 'Métodos de Login', value: '3', icon: Lock },
    { label: 'Tipos de 2FA', value: '2', icon: Shield },
    { label: 'Eventos Auditados', value: '20+', icon: History },
  ];

  const securityFeatures = [
    { icon: Lock, text: 'Contraseñas hasheadas con bcrypt' },
    { icon: Shield, text: 'Tokens JWT con refresh automático' },
    { icon: Globe, text: 'Detección de ubicación sospechosa' },
    { icon: History, text: 'Auditoría completa de acciones' },
    { icon: Key, text: 'Historial de contraseñas' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                SecureAuth
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Características
              </a>
              <a href="#security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Seguridad
              </a>
            </nav>

            <div className="flex items-center gap-3">
              {!isHydrated ? (
                <div className="animate-pulse h-9 w-28 bg-muted rounded-lg" />
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
                    <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25">
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
        <section className="relative min-h-[90vh] flex items-center">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 via-purple-50/30 to-background" />
          <GridBackground className="opacity-50" />
          <Spotlight className="z-10" fill="rgb(139, 92, 246)" />

          <GlowingOrb
            className="top-20 -left-32"
            color="#8b5cf6"
            size="xl"
          />
          <GlowingOrb
            className="top-40 -right-32"
            color="#a855f7"
            size="lg"
          />
          <GradientBlob
            className="top-1/4 left-1/4 w-96 h-96"
            colors={['#8b5cf6', '#a855f7']}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <ScrollAnimation variant="fade-up" delay={0}>
                <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium border border-border/50 bg-background/50 backdrop-blur-sm">
                  <Zap className="w-3.5 h-3.5 mr-2 text-amber-500" />
                  Sistema de Autenticación Empresarial
                </Badge>
              </ScrollAnimation>

              <ScrollAnimation variant="fade-up" delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
                  Seguridad de nivel{' '}
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent animate-text-gradient">
                    empresarial
                  </span>
                </h1>
              </ScrollAnimation>

              <ScrollAnimation variant="fade-up" delay={0.2}>
                <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                  {isAuthenticated
                    ? `Bienvenido de nuevo, ${user?.name || user?.email}. Tu cuenta está protegida con las mejores prácticas de seguridad.`
                    : 'Autenticación robusta con 2FA, magic links, gestión de sesiones y mucho más. Todo lo que necesitas para proteger a tus usuarios.'}
                </p>
              </ScrollAnimation>

              <ScrollAnimation variant="fade-up" delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isAuthenticated ? (
                    <>
                      <Link href="/settings/security">
                        <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-xl shadow-purple-500/25 h-12 px-8">
                          <Shield className="w-5 h-5" />
                          Configurar Seguridad
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href="/settings/profile">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 h-12 px-8 bg-background/50 backdrop-blur-sm">
                          <User className="w-5 h-5" />
                          Ver mi Perfil
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/register">
                        <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-xl shadow-purple-500/25 h-12 px-8 text-base">
                          Comenzar Gratis
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href="/magic-link">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 h-12 px-8 bg-background/50 backdrop-blur-sm text-base">
                          <Sparkles className="w-5 h-5 text-purple-500" />
                          Probar Magic Link
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </ScrollAnimation>

              {/* Stats */}
              <ScrollAnimation variant="fade-up" delay={0.4}>
                <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="text-center group">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
                        <stat.icon className="w-5 h-5 text-violet-600" />
                      </div>
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </ScrollAnimation>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32 relative">
          <DotPattern className="opacity-30" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <ScrollAnimation variant="fade-up">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4 px-4 py-1.5">
                  Características
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Todo lo que necesitas
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Un sistema de autenticación completo con las mejores prácticas de seguridad implementadas.
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <ScrollAnimation
                  key={feature.title}
                  variant="fade-up"
                  delay={index * 0.1}
                >
                  <FeatureCard feature={feature} index={index} />
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-24 sm:py-32 relative bg-muted/30">
          <GridBackground className="opacity-30" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <ScrollAnimation variant="fade-right">
                  <Badge variant="outline" className="mb-4 px-4 py-1.5">
                    Seguridad
                  </Badge>
                </ScrollAnimation>

                <ScrollAnimation variant="fade-right" delay={0.1}>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                    Protección en cada capa
                  </h2>
                </ScrollAnimation>

                <ScrollAnimation variant="fade-right" delay={0.2}>
                  <p className="text-lg text-muted-foreground mb-8">
                    Implementamos las mejores prácticas de seguridad para mantener tus datos protegidos.
                  </p>
                </ScrollAnimation>

                <div className="space-y-2">
                  {securityFeatures.map((item, index) => (
                    <ScrollAnimation key={item.text} variant="fade-right" delay={0.3 + index * 0.1}>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-green-500/30 hover:bg-green-500/5 transition-all group">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                          <item.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-foreground font-medium">{item.text}</span>
                        <Check className="w-5 h-5 text-green-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </ScrollAnimation>
                  ))}
                </div>

                {!isAuthenticated && (
                  <ScrollAnimation variant="fade-up" delay={0.8}>
                    <div className="mt-6">
                      <Link href="/register">
                        <Button className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 h-12 px-6">
                          Crear cuenta segura
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </ScrollAnimation>
                )}
              </div>

              <ScrollAnimation variant="fade-left" delay={0.3}>
                <div className="relative">
                  <GlowingOrb
                    className="-top-10 -right-10"
                    color="#8b5cf6"
                    size="md"
                  />

                  <Card className="relative bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4 text-green-600" />
                        </div>
                        Estado de Seguridad
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {isAuthenticated ? (
                        <>
                          <SecurityStatusItem
                            label="Email verificado"
                            status={user?.emailVerified ? 'verified' : 'pending'}
                          />
                          <SecurityStatusItem
                            label="Autenticación 2FA"
                            status={user?.isTwoFactorEnabled ? 'enabled' : 'disabled'}
                          />
                          <SecurityStatusItem
                            label="Sesión actual"
                            status="active"
                          />
                          <Link href="/settings/security" className="block pt-2">
                            <Button variant="outline" className="w-full">
                              Ver configuración completa
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <SecurityStatusItem label="Verificación de email" status="included" />
                          <SecurityStatusItem label="2FA (TOTP + Email)" status="included" />
                          <SecurityStatusItem label="Magic Link" status="included" />
                          <SecurityStatusItem label="Gestión de sesiones" status="included" />
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="py-24 sm:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-700" />
            <DotPattern className="opacity-10" dotColor="rgba(255,255,255,0.3)" />
            <GlowingOrb className="top-0 right-0" color="#ffffff" size="xl" />
            <GlowingOrb className="bottom-0 left-0" color="#ffffff" size="lg" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
              <ScrollAnimation variant="zoom-in">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  ¿Listo para comenzar?
                </h2>
              </ScrollAnimation>

              <ScrollAnimation variant="fade-up" delay={0.1}>
                <p className="text-lg text-white/80 mb-10">
                  Crea tu cuenta en segundos y experimenta la mejor seguridad.
                </p>
              </ScrollAnimation>

              <ScrollAnimation variant="fade-up" delay={0.2}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto gap-2 bg-white text-violet-700 hover:bg-white/90 h-12 px-8 shadow-xl font-semibold">
                      Crear cuenta gratis
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-white/40 text-white bg-violet-600 hover:bg-white/10 backdrop-blur-sm font-medium">
                      Ya tengo cuenta
                    </Button>
                  </Link>
                </div>
              </ScrollAnimation>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Feature type
interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bg: string;
  gradient: string;
}

// Feature Card Component
function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const { ref, hasBeenInView } = useInView<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      <Card
        className={cn(
          'group relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm',
          'hover:border-border hover:shadow-xl hover:shadow-purple-500/5',
          'transition-all duration-500',
          hasBeenInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
        style={{ transitionDelay: `${index * 50}ms` }}
      >
        <Spotlight fill="rgb(139, 92, 246)" />

        <CardHeader className="relative">
          <div className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center mb-4',
            'bg-gradient-to-br',
            feature.gradient,
            'shadow-lg group-hover:scale-110 transition-transform duration-300'
          )}>
            <feature.icon className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-xl">{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-muted-foreground text-base leading-relaxed">
            {feature.description}
          </CardDescription>
        </CardContent>

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Card>
    </div>
  );
}

// Security Status Item Component
function SecurityStatusItem({
  label,
  status
}: {
  label: string;
  status: 'verified' | 'pending' | 'enabled' | 'disabled' | 'active' | 'included';
}) {
  const statusConfig = {
    verified: { text: 'Verificado', className: 'bg-green-500/10 text-green-600' },
    pending: { text: 'Pendiente', className: 'bg-amber-500/10 text-amber-600' },
    enabled: { text: 'Habilitado', className: 'bg-green-500/10 text-green-600' },
    disabled: { text: 'Deshabilitado', className: 'bg-muted text-muted-foreground' },
    active: { text: 'Activa', className: 'bg-violet-500/10 text-violet-600' },
    included: { text: 'Incluido', className: 'bg-green-500/10 text-green-600' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge className={cn('font-medium', config.className)}>
        {config.text}
      </Badge>
    </div>
  );
}

