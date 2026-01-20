import { create } from 'zustand';
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

// No persistence - user state is fetched from server on each page load
// Authentication is handled by httpOnly cookies
export const useUserStore = create<UserState & UserActions>()((set) => ({
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
}));
