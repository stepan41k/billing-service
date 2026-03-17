import { useState, useEffect } from 'react'
import { api } from '../api/client'
import type { Balance } from '../types'

export function useBalance() {
  const [balance, setBalance] = useState<Balance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .balance()
      .then(data => {
        if (!cancelled) setBalance(data)
      })
      .catch(e => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { balance, loading, error }
}
