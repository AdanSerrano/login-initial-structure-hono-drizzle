'use client';

import { useEffect, useRef } from 'react';
import { useUserStore } from '@/modules/user/state/user.state';
import type { UserResponse } from '@/modules/user/types/user.types';

interface SessionProviderProps {
  children: React.ReactNode;
  session: { user: UserResponse } | null;
}

/**
 * SessionProvider - Hydrates client state with server session
 * Similar to NextAuth's SessionProvider
 *
 * This component receives the session from the server (via auth())
 * and hydrates the Zustand store on the client, avoiding the flash
 * of unauthenticated content.
 */
export function SessionProvider({ children, session }: SessionProviderProps) {
  const { setUser, clearUser } = useUserStore();
  const initialized = useRef(false);

  useEffect(() => {
    // Only hydrate once on mount
    if (initialized.current) return;
    initialized.current = true;

    if (session?.user) {
      setUser(session.user);
    } else {
      clearUser();
    }
  }, [session, setUser, clearUser]);

  return <>{children}</>;
}
