/**
 * Service layer.
 * Thin wrappers over API client with error handling.
 * Components/stores call services, never the API directly.
 */
import {
  authApi,
  profileApi,
  balanceApi,
  contractsApi,
  paymentsApi,
  supportApi,
  speedTestApi,
  networkApi,
  notificationsApi,
} from '@/api/client';
import type {
  LoginPayload,
  RegisterPayload,
} from '@/types';

export const AuthService = {
  login: (payload: LoginPayload) => authApi.login(payload),
  register: (payload: RegisterPayload) => authApi.register(payload),
};

export const ProfileService = {
  fetch: () => profileApi.get(),
};

export const BalanceService = {
  fetch: () => balanceApi.get(),
};

export const ContractsService = {
  fetchAll: () => contractsApi.list(),
};

export const PaymentsService = {
  fetchAll: () => paymentsApi.list(),
};

export const SupportService = {
  fetchTickets: () => supportApi.list(),
  createTicket: (subject: string, text: string) => supportApi.create(subject, text),
  reply: (ticketId: number, text: string) => supportApi.reply(ticketId, text),
};

export const SpeedTestService = {
  fetchHistory: () => speedTestApi.history(),
  run: () => speedTestApi.run(),
};

export const NetworkService = {
  fetchEvents: () => networkApi.events(),
};

export const NotificationsService = {
  fetchAll: () => notificationsApi.list(),
  markRead: (id: number) => notificationsApi.markRead(id),
  markAllRead: () => notificationsApi.markAllRead(),
};
