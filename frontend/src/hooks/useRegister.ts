import { useState, useCallback } from 'react'
import { api } from '../api/client'
import type { RegisterPayload } from '../types'

export function useRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = useCallback(async (payload: RegisterPayload): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.register(payload)
      return res.success
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка регистрации')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { register, loading, error }
}
