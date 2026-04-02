import { create } from 'zustand'
import { SpeedTestService } from '@/services'
import type { SpeedTestResult } from '@/types'

interface SpeedTestState {
  results: SpeedTestResult[]
  running: boolean
  loading: boolean
  error: string | null
  fetch: () => Promise<void>
  run: () => Promise<void>
}

export const useSpeedTestStore = create<SpeedTestState>((set, get) => ({
  results: [],
  running: false,
  loading: false,
    error: null,

  fetch: async () => {
    set({ loading: true, error: null })
    try {
      const results = await SpeedTestService.fetchHistory()
      set({ results, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  run: async () => {
    set({ running: true })
    try {
      const result = await SpeedTestService.run()
      set({ results: [result, ...get().results], running: false })
    } catch {
      set({ running: false })
    }
  },
}))
