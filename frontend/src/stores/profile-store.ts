import { create } from 'zustand';
import { ProfileService } from '@/services';
import type { User } from '@/types';

interface ProfileState {
  user: User | null;
  loading: boolean
  error: string | null;
  fetch: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: null,
  loading: false,
    error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const user = await ProfileService.fetch();
      set({ user, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
