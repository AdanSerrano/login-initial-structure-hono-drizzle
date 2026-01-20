"use client";

import { Shield, Lock, Fingerprint, KeyRound, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { GlowingOrb, DotPattern } from "@/components/ui/background-effects";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showFeatures?: boolean;
}

const features = [
  {
    icon: Shield,
    title: "Protección Avanzada",
    description: "Cifrado de extremo a extremo para todos tus datos",
  },
  {
    icon: Fingerprint,
    title: "Autenticación 2FA",
    description: "Verificación en dos pasos con app o email",
  },
  {
    icon: Lock,
    title: "Sesiones Seguras",
    description: "Control total sobre tus dispositivos activos",
  },
  {
    icon: KeyRound,
    title: "Códigos de Respaldo",
    description: "Acceso garantizado con códigos de recuperación",
  },
];

export function AuthLayout({ children, title, subtitle, showFeatures = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding & Features */}
      {showFeatures && (
        <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-20">
            <GlowingOrb className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" color="#ffffff" size="xl" />
            <GlowingOrb className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" color="#ffffff" size="xl" />
            <GlowingOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="#ffffff" size="md" />
          </div>

          <DotPattern className="opacity-10" dotColor="rgba(255,255,255,0.4)" gap={30} />

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
            {/* Logo */}
            <ScrollAnimation variant="fade-down" delay={0}>
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/30 transition-colors">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight">SecureAuth</span>
              </Link>
            </ScrollAnimation>

            {/* Features */}
            <div className="space-y-8">
              <ScrollAnimation variant="fade-right" delay={0.1}>
                <div>
                  <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
                    Seguridad de nivel
                    <br />
                    <span className="text-white/90">empresarial</span>
                  </h2>
                  <p className="mt-4 text-white/70 text-lg max-w-md">
                    Protege tu identidad digital con nuestra plataforma de autenticación de última generación.
                  </p>
                </div>
              </ScrollAnimation>

              <div className="grid gap-3">
                {features.map((feature, index) => (
                  <ScrollAnimation key={index} variant="fade-right" delay={0.2 + index * 0.1}>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/15 hover:border-white/20 hover:translate-x-1 group">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-white/60 mt-0.5">{feature.description}</p>
                      </div>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <ScrollAnimation variant="fade-up" delay={0.6}>
              <div className="flex items-center gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2 hover:text-white/80 transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white/80 transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>GDPR Ready</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white/80 transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ISO 27001</span>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      )}

      {/* Right Panel - Form */}
      <div className={`flex-1 flex flex-col bg-gradient-to-b from-violet-50/30 to-background ${showFeatures ? 'lg:w-1/2 xl:w-[55%]' : 'w-full'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden p-6 border-b bg-background/80 backdrop-blur-sm">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              SecureAuth
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-[440px] space-y-8">
            {/* Header */}
            <ScrollAnimation variant="fade-up" delay={0}>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                <p className="text-muted-foreground">{subtitle}</p>
              </div>
            </ScrollAnimation>

            {/* Form Content */}
            <ScrollAnimation variant="fade-up" delay={0.1}>
              {children}
            </ScrollAnimation>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-muted-foreground border-t bg-background/50">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <p>© {new Date().getFullYear()} SecureAuth</p>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/30" />
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Términos
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
