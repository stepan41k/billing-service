import { create } from 'zustand';
import { NotificationsService } from '@/services';
import type { AppNotification } from '@/types';

interface NotificationsState {
  items: AppNotification[];
  loading: boolean;
  unreadCount: number;
  fetch: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  items: [],
  loading: false,
  unreadCount: 0,
  fetch: async () => {
    set({ loading: true });
    try {
      const items = await NotificationsService.fetchAll();
      set({ items, unreadCount: items.filter((n) => !n.read).length, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  markRead: async (id) => {
    try {
      await NotificationsService.markRead(id);
      set((s) => {
        const items = s.items.map((n) => (n.id === id ? { ...n, read: true } : n));
        return { items, unreadCount: items.filter((n) => !n.read).length };
      });
    } catch {
      /* silent */
    }
  },
  markAllRead: async () => {
    try {
      await NotificationsService.markAllRead();
      set((s) => ({
        items: s.items.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch {
      /* silent */
    }
  },
}));
