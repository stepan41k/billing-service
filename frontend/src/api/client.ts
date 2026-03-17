import type {
  LoginPayload,
  AuthResponse,
  RegisterPayload,
  RegisterResponse,
  User,
  Contract,
  Payment,
  Balance,
} from '../types'

const BASE_URL = import.meta.env.VITE_MOCK === 'true' ? '' : import.meta.env.VITE_API_URL ?? ''

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...init.headers,
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new ApiError(res.status, text)
  }
  return res.json() as Promise<T>
}

export const api = {
  login: (body: LoginPayload) => request<AuthResponse>('/api/login', { method: 'POST', body: JSON.stringify(body) }),
  // TODO: подключить к POST /api/register на Go-бэке
  register: (body: RegisterPayload) =>
    request<RegisterResponse>('/api/register', { method: 'POST', body: JSON.stringify(body) }),
  profile: () => request<User>('/api/profile'),
  balance: () => request<Balance>('/api/balance'),
  contracts: () => request<Contract[]>('/api/contracts'),
  payments: () => request<Payment[]>('/api/payments'),
}
