import { create } from 'zustand';
import type { UserResponse } from '../types/user.types';

interface UserState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isHydrated: boolean; // Track if client has been hydrated with server session
}

interface UserActions {
  setUser: (user: UserResponse) => void;
  updateUser: (user: Partial<UserResponse>) => void;
  clearUser: () => void;
  setHydrated: (hydrated: boolean) => void;
}

// No persistence - user state is fetched from server on each page load
// Authentication is handled by httpOnly cookies
export const useUserStore = create<UserState & UserActions>()((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      isHydrated: true,
    }),

  updateUser: (userData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isHydrated: true,
    }),

  setHydrated: (hydrated) =>
    set({ isHydrated: hydrated }),
}));
