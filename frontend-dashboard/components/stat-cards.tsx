'use client'

import {
  Boxes,
  Globe,
  Globe2,
  Network,
  ShieldAlert,
  ShieldCheck,
  Waves,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Stats } from '@/lib/api'

interface StatDef {
  key: keyof Stats
  label: string
  icon: LucideIcon
  color: string
}

const STAT_DEFS: StatDef[] = [
  { key: 'total_packets', label: 'Total Packets', icon: Boxes, color: 'var(--primary)' },
  { key: 'tcp_packets', label: 'TCP Packets', icon: Network, color: 'var(--cyan)' },
  { key: 'udp_packets', label: 'UDP Packets', icon: Waves, color: 'var(--chart-4)' },
  { key: 'ipv4_packets', label: 'IPv4 Packets', icon: Globe, color: 'var(--primary)' },
  { key: 'ipv6_packets', label: 'IPv6 Packets', icon: Globe2, color: 'var(--cyan)' },
  { key: 'safe_packets', label: 'Safe Packets', icon: ShieldCheck, color: 'var(--safe)' },
  { key: 'threat_packets', label: 'Threat Packets', icon: ShieldAlert, color: 'var(--threat)' },
]

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n ?? 0)
}

export function StatCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {STAT_DEFS.map((def) => (
        <StatCard
          key={def.key}
          label={def.label}
          value={stats[def.key]}
          icon={def.icon}
          color={def.color}
        />
      ))}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: LucideIcon
  color: string
}) {
  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-4 transition-transform duration-200 hover:-translate-y-0.5">
      <div
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-15 blur-xl transition-opacity group-hover:opacity-30"
        style={{ background: color }}
        aria-hidden="true"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ background: `color-mix(in oklch, ${color} 16%, transparent)` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </span>
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-foreground md:text-3xl">
        {formatNumber(value)}
      </p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <span
          className="block h-full rounded-full transition-all duration-500"
          style={{ background: color, width: value > 0 ? '100%' : '0%' }}
        />
      </div>
    </div>
  )
}
