import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types/register.types';

interface RegisterState {
  user: User | null;
  isAuthenticated: boolean;
}

interface RegisterActions {
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useRegisterStore = create<RegisterState & RegisterActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      clearUser: () =>
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
