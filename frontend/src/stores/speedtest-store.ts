import { create } from 'zustand';
import { SpeedTestService } from '@/services';
import type { SpeedTestResult } from '@/types';

interface SpeedTestState {
  results: SpeedTestResult[];
  running: boolean;
  loading: boolean;
  fetch: () => Promise<void>;
  run: () => Promise<void>;
}

export const useSpeedTestStore = create<SpeedTestState>((set) => ({
  results: [],
  running: false,
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const results = await SpeedTestService.fetchHistory();
      set({ results, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  run: async () => {
    set({ running: true });
    try {
      const result = await SpeedTestService.run();
      set((s) => ({ results: [result, ...s.results], running: false }));
    } catch {
      set({ running: false });
    }
  },
}));
