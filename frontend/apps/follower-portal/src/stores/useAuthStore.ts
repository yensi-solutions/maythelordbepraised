import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '@mtlbp/shared';
import type { User } from '@mtlbp/shared';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (token: string) => {
        localStorage.setItem('access_token', token);
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<User>('/auth/me');
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch {
          set({ error: 'Failed to authenticate', isLoading: false });
          localStorage.removeItem('access_token');
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, isAuthenticated: false, error: null });
      },

      fetchMe: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        set({ isLoading: true });
        try {
          const response = await api.get<User>('/auth/me');
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch {
          set({ isLoading: false });
          localStorage.removeItem('access_token');
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'follower-auth-store' },
  ),
);
