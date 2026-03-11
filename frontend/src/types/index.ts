export interface User {
  id: number
  login: string
  client: number
  contract: number
  email: string
  phone: string
  readOnly: boolean
  lastActivity: string
}

export interface Balance {
  amount: number
  currency: string
  updatedAt: string
}

export interface Contract {
  id: number
  number: number
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

export interface LoginPayload {
  login: string
  password: string
}
export interface AuthResponse {
  token: string
}

export interface RegisterPayload {
  login: string
  password: string
  email: string
  phone: string
}
export interface RegisterResponse {
  success: boolean
  message?: string
}

export interface NavItem {
  label: string
  path: string
  icon?: React.ReactNode
}
