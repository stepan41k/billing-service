import { create } from 'zustand';
import { NotificationsService } from '@/services';
import type { AppNotification } from '@/types';

/** Интервал между опросами сервера (мс). Базовое значение — 60 с. */
const POLL_INTERVAL_MS = 60_000;
/** Jitter ±20% от интервала — аналог паттерна heartbeat из Claude Code,
 *  чтобы несколько вкладок не пинговали сервер одновременно. */
const jitter = () => (Math.random() - 0.5) * 2 * POLL_INTERVAL_MS * 0.2;

interface NotificationsState {
  items: AppNotification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  /** id таймера опроса (stopPolling его отменяет) */
  _pollTimer: ReturnType<typeof setTimeout> | null;
  fetch: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
  /** Запустить периодический опрос уведомлений */
  startPolling: () => void;
  /** Остановить опрос (напр. при logout) */
  stopPolling: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  unreadCount: 0,
  _pollTimer: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const items = await NotificationsService.fetchAll();
      set({ items, unreadCount: items.filter((n) => !n.read).length, loading: false });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Ошибка загрузки уведомлений', loading: false });
    }
  },

  markRead: async (id) => {
    try {
      await NotificationsService.markRead(id);
      set((s) => {
        const items = s.items.map((n) => (n.id === id ? { ...n, read: true } : n));
        return { items, unreadCount: items.filter((n) => !n.read).length };
      });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Ошибка пометки уведомления' });
    }
  },

  markAllRead: async () => {
    try {
      await NotificationsService.markAllRead();
      set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })), unreadCount: 0 }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Ошибка пометки всех уведомлений' });
    }
  },

  /**
   * Запустить опрос уведомлений с jitter-ом.
   * Analogous to Claude Code's startHeartbeat() with jitterFraction.
   */
  startPolling: () => {
    const schedule = () => {
      const timer = setTimeout(async () => {
        await get().fetch();
        // Перепланируем только если опрос ещё активен
        if (get()._pollTimer !== null) schedule();
      }, POLL_INTERVAL_MS + jitter());
      set({ _pollTimer: timer });
    };
    // Немедленный первый fetch, потом периодика
    void get().fetch();
    schedule();
  },

  stopPolling: () => {
    const { _pollTimer } = get();
    if (_pollTimer !== null) {
      clearTimeout(_pollTimer);
      set({ _pollTimer: null });
    }
  },
}));
