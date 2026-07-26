'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  EMPTY_STATS,
  fetchPackets,
  fetchStats,
  type Packet,
  type Stats,
} from '@/lib/api'

const POLL_INTERVAL = 3000

export interface DpiData {
  stats: Stats
  packets: Packet[]
  connected: boolean
  error: string | null
  lastUpdated: Date | null
  loading: boolean
}

export function useDpiData(): DpiData {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS)
  const [packets, setPackets] = useState<Packet[]>([])
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  // Keep a ref so the interval callback stays stable across renders.
  const mounted = useRef(true)

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const [nextStats, nextPackets] = await Promise.all([
        fetchStats(signal),
        fetchPackets(signal),
      ])
      if (!mounted.current) return
      setStats(nextStats)
      setPackets(nextPackets)
      setConnected(true)
      setError(null)
      setLastUpdated(new Date())
    } catch (err) {
      if (!mounted.current) return
      // Ignore abort errors triggered by unmount / refresh.
      if (axiosAborted(err)) return
      setConnected(false)
      setError(
        'Unable to reach the DPI backend at the configured API URL. Ensure packet capture is running.',
      )
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    const controller = new AbortController()

    // Initial fetch.
    load(controller.signal)

    // Poll every 3 seconds.
    const id = setInterval(() => {
      load(controller.signal)
    }, POLL_INTERVAL)

    return () => {
      mounted.current = false
      clearInterval(id)
      controller.abort()
    }
  }, [load])

  return { stats, packets, connected, error, lastUpdated, loading }
}

function axiosAborted(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false
  const code = (err as { code?: string }).code
  const name = (err as { name?: string }).name
  return code === 'ERR_CANCELED' || name === 'CanceledError' || name === 'AbortError'
}
