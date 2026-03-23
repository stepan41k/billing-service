import { create } from 'zustand';
import { ContractsService } from '@/services';
import type { Contract } from '@/types';

interface ContractsState {
  contracts: Contract[];
  loading: boolean;
  fetch: () => Promise<void>;
}

export const useContractsStore = create<ContractsState>((set) => ({
  contracts: [],
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const contracts = await ContractsService.fetchAll();
      set({ contracts, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
