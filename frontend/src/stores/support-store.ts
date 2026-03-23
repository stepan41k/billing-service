import { create } from 'zustand';
import { SupportService } from '@/services';
import type { SupportTicket } from '@/types';

interface SupportState {
  tickets: SupportTicket[];
  loading: boolean;
  fetch: () => Promise<void>;
  create: (subject: string, text: string) => Promise<void>;
  reply: (ticketId: number, text: string) => Promise<void>;
}

export const useSupportStore = create<SupportState>((set) => ({
  tickets: [],
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const tickets = await SupportService.fetchTickets();
      set({ tickets, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  create: async (subject, text) => {
    set({ loading: true });
    try {
      const ticket = await SupportService.createTicket(subject, text);
      set((s) => ({ tickets: [ticket, ...s.tickets], loading: false }));
    } catch {
      set({ loading: false });
    }
  },
  reply: async (ticketId, text) => {
    try {
      const updated = await SupportService.reply(ticketId, text);
      set((s) => ({
        tickets: s.tickets.map((t) => (t.id === ticketId ? updated : t)),
      }));
    } catch {
      /* silent */
    }
  },
}));
