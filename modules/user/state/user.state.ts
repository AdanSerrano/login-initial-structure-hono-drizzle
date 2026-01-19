import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserResponse } from '../types/user.types';

interface UserState {
  user: UserResponse | null;
  isAuthenticated: boolean;
}

interface UserActions {
  setUser: (user: UserResponse) => void;
  updateUser: (user: Partial<UserResponse>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
