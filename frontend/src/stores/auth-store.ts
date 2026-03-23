import { create } from 'zustand';
import { Token } from '@/lib/token';
import { AuthService } from '@/services';
import type { LoginPayload, RegisterPayload } from '@/types';

interface AuthState {
  isAuth: boolean;
  loading: boolean;
  error: string | null;
  login: (p: LoginPayload) => Promise<void>;
  register: (p: RegisterPayload) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: Token.exists(),
  loading: false,
  error: null,
  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { token } = await AuthService.login(payload);
      Token.set(token);
      set({ isAuth: true, loading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка входа';
      set({ error: msg, loading: false });
    }
  },
  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await AuthService.register(payload);
      set({ loading: false });
      return res.success;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка регистрации';
      set({ error: msg, loading: false });
      return false;
    }
  },
  logout: () => {
    Token.clear();
    set({ isAuth: false, error: null });
  },
}));
