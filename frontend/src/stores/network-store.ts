import { create } from 'zustand';
import { NetworkService } from '@/services';
import type { NetworkEvent } from '@/types';

interface NetworkState {
  events: NetworkEvent[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  events: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const events = await NetworkService.fetchEvents();
      set({ events, loading: false });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Ошибка загрузки сетевых событий', loading: false });
    }
  },
}));
