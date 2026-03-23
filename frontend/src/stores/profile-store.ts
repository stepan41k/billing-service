import { create } from 'zustand';
import { ProfileService } from '@/services';
import type { User } from '@/types';

interface ProfileState {
  user: User | null;
  loading: boolean;
  fetch: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: null,
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const user = await ProfileService.fetch();
      set({ user, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
