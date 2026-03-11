import { useState, useCallback } from 'react'
import { api } from '../api/client'
import type { LoginPayload } from '../types'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = Boolean(sessionStorage.getItem('token'))

  const login = useCallback(async (payload: LoginPayload): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const { token } = await api.login(payload)
      sessionStorage.setItem('token', token)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Auth failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('token')
  }, [])

  return { isAuthenticated, login, logout, loading, error }
}
