"use client";

import { Shield, Lock, Fingerprint, KeyRound, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
        <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
            {/* Logo */}
            <div>
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight">SecureAuth</span>
              </Link>
            </div>

            {/* Features */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
                  Seguridad de nivel<br />empresarial
                </h2>
                <p className="mt-4 text-white/70 text-lg max-w-md">
                  Protege tu identidad digital con nuestra plataforma de autenticación de última generación.
                </p>
              </div>

              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/15"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-white/60 mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>GDPR Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>ISO 27001</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right Panel - Form */}
      <div className={`flex-1 flex flex-col ${showFeatures ? 'lg:w-1/2 xl:w-[55%]' : 'w-full'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden p-6 border-b bg-background">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">SecureAuth</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-[440px] space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>

            {/* Form Content */}
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-muted-foreground border-t">
          <p>
            © {new Date().getFullYear()} SecureAuth. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
