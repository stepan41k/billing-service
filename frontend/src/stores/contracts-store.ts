import { create } from 'zustand';
import { ContractsService } from '@/services';
import type { Contract } from '@/types';

interface ContractsState {
  contracts: Contract[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useContractsStore = create<ContractsState>((set) => ({
  contracts: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const contracts = await ContractsService.fetchAll();
      set({ contracts, loading: false });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Ошибка загрузки договоров', loading: false });
    }
  },
}));
