import { create } from 'zustand';
import { PaymentsService } from '@/services';
import type { Payment } from '@/types';

interface PaymentsState {
  payments: Payment[];
  loading: boolean;
  fetch: () => Promise<void>;
}

export const usePaymentsStore = create<PaymentsState>((set) => ({
  payments: [],
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const payments = await PaymentsService.fetchAll();
      set({ payments, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
