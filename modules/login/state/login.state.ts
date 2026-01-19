import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types/login.types';

interface LoginState {
  user: User | null;
  isAuthenticated: boolean;
}

interface LoginActions {
  setUser: (user: User) => void;
  logout: () => void;
}

export const useLoginStore = create<LoginState & LoginActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
