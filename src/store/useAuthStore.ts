import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  username: string;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  isLoggedIn: false,
  username: '',

  login: () => {
    set({
      isLoggedIn: true,
    });
  },

  logout: () =>
    set({
      isLoggedIn: false,
    }),
}));
