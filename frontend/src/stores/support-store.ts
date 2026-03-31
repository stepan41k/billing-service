import { create } from 'zustand';
import { SupportService } from '@/services';
import type { SupportTicket } from '@/types';

interface SupportState {
  tickets: SupportTicket[];
  loading: boolean;
  /** Ошибка загрузки/создания/ответа */
  error: string | null;
  fetch: () => Promise<void>;
  create: (subject: string, text: string) => Promise<void>;
  reply: (ticketId: number, text: string) => Promise<void>;
}

export const useSupportStore = create<SupportState>((set) => ({
  tickets: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const tickets = await SupportService.fetchTickets();
      set({ tickets, loading: false });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Ошибка загрузки тикетов', loading: false });
    }
  },
  create: async (subject, text) => {
    set({ error: null });
    try {
      const ticket = await SupportService.createTicket(subject, text);
      set((s) => ({ tickets: [ticket, ...s.tickets] }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Ошибка создания тикета' });
    }
  },
  reply: async (ticketId, text) => {
    set({ error: null });
    try {
      const updated = await SupportService.reply(ticketId, text);
      set((s) => ({ tickets: s.tickets.map((t) => (t.id === ticketId ? updated : t)) }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Ошибка отправки ответа' });
    }
  },
}));
