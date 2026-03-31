
export interface User {
  id: number
  login: string
  email: string
  phone: string
  /** Лицевой счёт клиента (camelCase от json:"client") */
  clientNumber: string
  /** Номер договора (camelCase от json:"contract") */
  contractNumber: string
  /** Признак только-чтение (camelCase от json:"is_read_only") */
  isReadOnly: boolean
  lastActivity: string
}

export interface Balance {
  amount: number
  currency: string
  updatedAt: string
}

export interface Contract {
  id: number
  number: string
  status: 'active' | 'suspended' | 'closed'
  tariff: string
  address: string
  created: string
  pricePerMonth: number
  speedMbps: number
  unlimitedTraffic: boolean
  trafficLimitGb?: number
}

export interface Payment {
  id: number
  date: string
  amount: number
  type: 'deposit' | 'charge' | 'refund'
  description: string
  contractNumber: number
}

export interface TicketMessage {
  id: number
  sender: 'user' | 'support'
  text: string
  createdAt: string
}

export interface SupportTicket {
  id: number
  subject: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  messages: TicketMessage[]
}

export interface SpeedTestResult {
  id: number
  createdAt: string
  downloadMbps: number
  uploadMbps: number
  pingMs: number
  server: string
}

export interface NetworkEvent {
  id: number
  /** degraded добавлен для совместимости с NetworkStatus */
  type: 'maintenance' | 'outage' | 'degraded' | 'resolved' | 'info'
  title: string
  description: string
  startedAt: string
  resolvedAt?: string
  affectedArea: string
}

export interface AppNotification {
  id: number
  /** success добавлен для совместимости с Notifications */
  type: 'payment' | 'system' | 'promo' | 'alert'
  title: string
  body: string
  /** message — алиас для body (используется в некоторых патчах) */
  message?: string
  read: boolean
  createdAt: string
  link?: string
}

export interface LoginPayload {
  login: string
  password: string
}

/** Структура ответа бэка на POST /login */
export interface AuthResponse {
  access_token: string
  refresh_token: string
  profile: User
}

export interface RegisterPayload {
  login: string
  password: string
  email: string
  phoneNumber: string
  clientNumber: string
  contractNumber: string
}

export interface RegisterResponse {
  success: boolean
  message?: string
}

export interface NavItem {
  label: string
  path: string
  icon: string
  badge?: number
}
