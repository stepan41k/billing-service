import { create } from 'zustand';
import { BalanceService } from '@/services';
import type { Balance } from '@/types';

interface BalanceState {
  balance: Balance | null;
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balance: null,
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const balance = await BalanceService.fetch();
      set({ balance, loading: false });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Ошибка загрузки баланса', loading: false });
    }
  },
}));
