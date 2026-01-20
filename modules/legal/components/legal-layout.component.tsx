'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, FileText, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>

            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">SecureAuth</span>
            </Link>

            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
            <IconComponent className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Última actualización: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="bg-card rounded-2xl border shadow-sm p-6 sm:p-10">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {children}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/terms">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Scale className="w-4 h-4" />
              Términos de Servicio
            </Button>
          </Link>
          <Link href="/privacy">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Shield className="w-4 h-4" />
              Política de Privacidad
            </Button>
          </Link>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Tienes preguntas sobre nuestras políticas?{' '}
            <a href="mailto:legal@secureauth.com" className="text-primary hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SecureAuth. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-foreground">
                Términos
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
