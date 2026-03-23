/* ── Domain types ── */

export interface User {
  id: number;
  login: string;
  client: number;
  contract: number;
  email: string;
  phone: string;
  readOnly: boolean;
  lastActivity: string;
}

export interface Balance {
  amount: number;
  currency: string;
  updatedAt: string;
}

export interface Contract {
  id: number;
  number: number;
  status: 'active' | 'suspended' | 'closed';
  tariff: string;
  address: string;
  created: string;
  pricePerMonth: number;
  speedMbps: number;
  unlimitedTraffic: boolean;
  trafficLimitGb?: number;
}

export interface Payment {
  id: number;
  date: string;
  amount: number;
  type: 'deposit' | 'charge' | 'refund';
  description: string;
  contractNumber: number;
}

export interface SupportTicket {
  id: number;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: number;
  sender: 'user' | 'support';
  text: string;
  createdAt: string;
}

export interface SpeedTestResult {
  id: number;
  date: string;
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  server: string;
}

export interface NetworkEvent {
  id: number;
  type: 'maintenance' | 'outage' | 'resolved' | 'info';
  title: string;
  description: string;
  startAt: string;
  endAt?: string;
  affectedArea: string;
}

export interface AppNotification {
  id: number;
  type: 'payment' | 'system' | 'promo' | 'alert';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

/* ── Auth payloads ── */

export interface LoginPayload {
  login: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterPayload {
  login: string;
  password: string;
  email: string;
  phone: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}

/* ── Navigation ── */

export interface NavItem {
  label: string;
  path: string;
  icon: string; // lucide icon name
  badge?: number;
}
