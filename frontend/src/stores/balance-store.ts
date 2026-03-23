import { create } from 'zustand';
import { BalanceService } from '@/services';
import type { Balance } from '@/types';

interface BalanceState {
  balance: Balance | null;
  loading: boolean;
  fetch: () => Promise<void>;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balance: null,
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const balance = await BalanceService.fetch();
      set({ balance, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
