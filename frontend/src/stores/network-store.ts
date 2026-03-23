import { create } from 'zustand';
import { NetworkService } from '@/services';
import type { NetworkEvent } from '@/types';

interface NetworkState {
  events: NetworkEvent[];
  loading: boolean;
  fetch: () => Promise<void>;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  events: [],
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const events = await NetworkService.fetchEvents();
      set({ events, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
