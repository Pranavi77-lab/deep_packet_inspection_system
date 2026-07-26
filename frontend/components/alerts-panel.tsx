'use client'

import { useMemo } from 'react'
import { ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react'
import type { Packet } from '@/lib/api'
import { SeverityBadge } from '@/components/badges'

interface AlertsPanelProps {
  packets: Packet[]
  /** Cap the number of alerts rendered (e.g. compact dashboard widget). */
  limit?: number
  compact?: boolean
}

export function getThreatPackets(packets: Packet[]): Packet[] {
  return packets
    .filter((p) => (p.Threat ?? '').toUpperCase() !== 'SAFE')
    .sort((a, b) => b['Packet ID'] - a['Packet ID'])
}

function severityAccent(severity: string, threat: string): string {
  const s = (severity ?? '').toUpperCase()
  if (s === 'HIGH' || s === 'CRITICAL') return 'var(--threat)'
  if (s === 'MEDIUM' || s === 'LOW') return 'var(--warning)'
  return (threat ?? '').toUpperCase() === 'SAFE' ? 'var(--safe)' : 'var(--threat)'
}

export function AlertsPanel({ packets, limit, compact = false }: AlertsPanelProps) {
  const threats = useMemo(() => {
    const list = getThreatPackets(packets)
    return typeof limit === 'number' ? list.slice(0, limit) : list
  }, [packets, limit])

  if (threats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-12 text-center">
        <span
          className="grid h-12 w-12 place-items-center rounded-full"
          style={{ background: 'color-mix(in oklch, var(--safe) 14%, transparent)' }}
        >
          <ShieldCheck className="h-6 w-6" style={{ color: 'var(--safe)' }} />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">No active threats</p>
          <p className="text-xs text-muted-foreground">
            All captured packets are classified as safe.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ul className={compact ? 'flex flex-col gap-2' : 'flex flex-col gap-3'}>
      {threats.map((p) => {
        const accent = severityAccent(p.Severity, p.Threat)
        return (
          <li
            key={p['Packet ID']}
            className="relative flex items-center gap-3 overflow-hidden rounded-xl border bg-secondary/30 p-3"
            style={{ borderColor: `color-mix(in oklch, ${accent} 35%, transparent)` }}
          >
            <span
              className="absolute left-0 top-0 h-full"
              style={{ width: 3, background: accent }}
            />
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg animate-pulse-glow"
              style={{ background: `color-mix(in oklch, ${accent} 16%, transparent)` }}
            >
              <ShieldAlert className="h-4.5 w-4.5" style={{ color: accent }} />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {p.Threat}
                </span>
                <SeverityBadge severity={p.Severity} />
                <span className="font-mono text-xs text-muted-foreground">
                  #{p['Packet ID']}
                </span>
              </div>
              <p className="mt-0.5 flex items-center gap-1.5 truncate font-mono text-xs text-muted-foreground">
                <span className="text-foreground">{p['Source IP']}</span>
                <span className="text-muted-foreground">:{p['Source Port']}</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
                <span className="text-foreground">{p['Destination IP']}</span>
                <span className="text-muted-foreground">:{p['Destination Port']}</span>
              </p>
            </div>

            <div className="hidden shrink-0 text-right sm:block">
              <p className="font-mono text-xs text-muted-foreground">{p.Protocol}</p>
              <p className="font-mono text-xs text-muted-foreground">{p.Timestamp}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
