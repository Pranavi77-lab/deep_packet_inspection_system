'use client'

import { CheckCircle2, Clock, Server, WifiOff } from 'lucide-react'
import { API_BASE_URL } from '@/lib/api'
import { SectionCard } from '@/components/section-card'

interface SettingsViewProps {
  connected: boolean
  lastUpdated: Date | null
}

export function SettingsView({ connected, lastUpdated }: SettingsViewProps) {
  const rows = [
    {
      icon: Server,
      label: 'Backend API URL',
      value: API_BASE_URL,
      mono: true,
    },
    {
      icon: Clock,
      label: 'Polling interval',
      value: 'Every 3 seconds (automatic)',
    },
    {
      icon: connected ? CheckCircle2 : WifiOff,
      label: 'Connection status',
      value: connected ? 'Connected — receiving live data' : 'Disconnected',
      color: connected ? 'var(--safe)' : 'var(--threat)',
    },
    {
      icon: Clock,
      label: 'Last successful update',
      value: lastUpdated ? lastUpdated.toLocaleString() : 'Never',
    },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard
        title="Connection"
        description="Live data source configuration"
        icon={Server}
      >
        <dl className="flex flex-col divide-y divide-border/60">
          {rows.map((row) => {
            const Icon = row.icon
            return (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon
                    className="h-4 w-4"
                    style={{ color: row.color ?? 'var(--muted-foreground)' }}
                  />
                  {row.label}
                </dt>
                <dd
                  className={`text-right text-sm font-medium ${row.mono ? 'font-mono' : ''}`}
                  style={{ color: row.color ?? 'var(--foreground)' }}
                >
                  {row.value}
                </dd>
              </div>
            )
          })}
        </dl>
      </SectionCard>

      <SectionCard
        title="About"
        description="Deep Packet Inspection System"
        icon={CheckCircle2}
      >
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            This Security Operations Center dashboard visualizes live packet
            capture data streamed from the DPI backend. All statistics, charts,
            tables, and alerts are pulled directly from the running capture
            engine and refresh automatically.
          </p>
          <p>
            To point the dashboard at a different backend, set the{' '}
            <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground">
              NEXT_PUBLIC_DPI_API_URL
            </code>{' '}
            environment variable.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
