import { create } from 'zustand';
import { PaymentsService } from '@/services';
import type { Payment } from '@/types';

interface PaymentsState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const usePaymentsStore = create<PaymentsState>((set) => ({
  payments: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const payments = await PaymentsService.fetchAll();
      set({ payments, loading: false });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Ошибка загрузки платежей', loading: false });
    }
  },
}));
