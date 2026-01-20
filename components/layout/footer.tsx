'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { useUser } from '@/modules/user/hooks/user.hook';

export function Footer() {
  const { isAuthenticated } = useUser();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">AuthSystem</span>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            {isAuthenticated ? (
              <>
                <Link href="/settings/profile" className="hover:text-white transition-colors">
                  Perfil
                </Link>
                <Link href="/settings/security" className="hover:text-white transition-colors">
                  Seguridad
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/register" className="hover:text-white transition-colors">
                  Registro
                </Link>
                <Link href="/magic-link" className="hover:text-white transition-colors">
                  Magic Link
                </Link>
              </>
            )}
          </nav>

          <p className="text-sm">
            Construido con Next.js, Hono y Drizzle
          </p>
        </div>
      </div>
    </footer>
  );
}
