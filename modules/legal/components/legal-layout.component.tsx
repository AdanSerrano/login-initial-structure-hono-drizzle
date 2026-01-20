'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, FileText, Scale, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { GlowingOrb, DotPattern } from '@/components/ui/background-effects';

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  lastUpdated: string;
  icon?: 'terms' | 'privacy';
}

export function LegalLayout({
  children,
  title,
  description,
  lastUpdated,
  icon = 'terms'
}: LegalLayoutProps) {
  const router = useRouter();

  const IconComponent = icon === 'privacy' ? Shield : Scale;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2 hover:bg-violet-100/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-shadow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                SecureAuth
              </span>
            </Link>

            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-30 pointer-events-none">
          <GlowingOrb color="#8b5cf6" size="lg" />
        </div>

        {/* Hero */}
        <ScrollAnimation variant="fade-up">
          <div className="text-center mb-12">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-violet-200/50">
              <IconComponent className="w-8 h-8 text-violet-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
            <Badge variant="secondary" className="mt-4 bg-violet-100/50 text-violet-700 border-violet-200/50">
              Última actualización: {lastUpdated}
            </Badge>
          </div>
        </ScrollAnimation>

        {/* Content */}
        <ScrollAnimation variant="fade-up" delay={0.1}>
          <div className="bg-card rounded-2xl border border-border/50 shadow-xl shadow-purple-500/5 p-6 sm:p-10 backdrop-blur-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground">
              {children}
            </div>
          </div>
        </ScrollAnimation>

        {/* Navigation */}
        <ScrollAnimation variant="fade-up" delay={0.2}>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/terms">
              <Button
                variant="outline"
                className={`w-full sm:w-auto gap-2 ${icon === 'terms' ? 'bg-violet-100/50 border-violet-300 text-violet-700' : 'hover:bg-violet-50'}`}
              >
                <Scale className="w-4 h-4" />
                Términos de Servicio
              </Button>
            </Link>
            <Link href="/privacy">
              <Button
                variant="outline"
                className={`w-full sm:w-auto gap-2 ${icon === 'privacy' ? 'bg-violet-100/50 border-violet-300 text-violet-700' : 'hover:bg-violet-50'}`}
              >
                <Shield className="w-4 h-4" />
                Política de Privacidad
              </Button>
            </Link>
          </div>
        </ScrollAnimation>

        {/* Contact */}
        <ScrollAnimation variant="fade-up" delay={0.3}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100/50 text-sm text-violet-700">
              <span>¿Tienes preguntas?</span>
              <a
                href="mailto:legal@secureauth.com"
                className="font-medium hover:text-violet-900 transition-colors inline-flex items-center gap-1"
              >
                Contáctanos
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </ScrollAnimation>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SecureAuth. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-violet-600 transition-colors">
                Términos
              </Link>
              <Link href="/privacy" className="hover:text-violet-600 transition-colors">
                Privacidad
              </Link>
              <Link href="/" className="hover:text-violet-600 transition-colors">
                Inicio
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
