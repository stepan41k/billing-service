/**
 * API client layer.
 * All HTTP calls go through this module.
 * Service layer calls these functions via interface contracts.
 */
import { Token } from '@/lib/token';
import type {
  AuthResponse,
  Balance,
  Contract,
  LoginPayload,
  Payment,
  RegisterPayload,
  RegisterResponse,
  User,
  SupportTicket,
  SpeedTestResult,
  NetworkEvent,
  AppNotification,
} from '@/types';

const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = Token.get();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...init, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }

  return res.json();
}

/* ── Auth ── */
export const authApi = {
  login: (payload: LoginPayload) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  register: (payload: RegisterPayload) =>
    request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

/* ── Profile ── */
export const profileApi = {
  get: () => request<User>('/profile'),
};

/* ── Balance ── */
export const balanceApi = {
  get: () => request<Balance>('/profile/balance'),
};

/* ── Contracts ── */
export const contractsApi = {
  list: () => request<Contract[]>('/profile/contracts'),
};

/* ── Payments ── */
export const paymentsApi = {
  list: () => request<Payment[]>('/profile/payments'),
};

/* ── Support ── */
export const supportApi = {
  list: () => request<SupportTicket[]>('/support/tickets'),
  create: (subject: string, text: string) =>
    request<SupportTicket>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify({ subject, text }),
    }),
  reply: (ticketId: number, text: string) =>
    request<SupportTicket>(`/support/tickets/${ticketId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
};

/* ── Speed Test ── */
export const speedTestApi = {
  history: () => request<SpeedTestResult[]>('/speedtest/history'),
  run: () => request<SpeedTestResult>('/speedtest/run', { method: 'POST' }),
};

/* ── Network ── */
export const networkApi = {
  events: () => request<NetworkEvent[]>('/network/events'),
};

/* ── Notifications ── */
export const notificationsApi = {
  list: () => request<AppNotification[]>('/notifications'),
  markRead: (id: number) =>
    request<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),
  markAllRead: () =>
    request<{ success: boolean }>('/notifications/read-all', {
      method: 'PATCH',
    }),
};
