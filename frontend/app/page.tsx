'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, Bell, ListTree, ShieldAlert } from 'lucide-react'
import { useDpiData } from '@/lib/use-dpi-data'
import { Navbar } from '@/components/navbar'
import { Sidebar, type ViewId } from '@/components/sidebar'
import { StatCards } from '@/components/stat-cards'
import {
  IpVersionChart,
  ProtocolPieChart,
  ThreatPieChart,
  TrafficBarChart,
} from '@/components/charts'
import { SectionCard } from '@/components/section-card'
import { PacketTable } from '@/components/packet-table'
import { AlertsPanel, getThreatPackets } from '@/components/alerts-panel'
import { SettingsView } from '@/components/settings-view'


const VIEW_TITLES: Record<ViewId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Live network overview & security posture' },
  packets: { title: 'Packet Logs', subtitle: 'Every captured packet, newest first' },
  analytics: { title: 'Traffic Analytics', subtitle: 'Protocol & IP version breakdown' },
  threats: { title: 'Threat Analysis', subtitle: 'Malicious and suspicious traffic' },
  alerts: { title: 'Alerts', subtitle: 'Real-time non-safe packet notifications' },
  settings: { title: 'Settings', subtitle: 'Data source & system configuration' },
}

export default function Page() {
  const { stats, packets, connected, error, lastUpdated, loading } = useDpiData()
  const [view, setView] = useState<ViewId>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const threatPackets = useMemo(() => getThreatPackets(packets), [packets])

  function handleSelect(id: ViewId) {
    setView(id)
    setSidebarOpen(false)
  }

  const meta = VIEW_TITLES[view]

  return (
    <div className="min-h-dvh">
      <Navbar
        connected={connected}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      <div className="flex">
        <Sidebar
          active={view}
          onSelect={handleSelect}
          open={sidebarOpen}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          alertCount={threatPackets.length}
        />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8">
          {/* Page heading */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                {meta.title}
              </h1>
              <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {lastUpdated
                ? `Last update ${lastUpdated.toLocaleTimeString()}`
                : loading
                  ? 'Connecting…'
                  : '—'}
            </p>
          </div>

          {error && <ConnectionError message={error} />}

          {view === 'dashboard' && (
            <DashboardView
              statsCards={<StatCards stats={stats} />}
              packets={packets}
              threatCount={threatPackets.length}
              stats={stats}
            />
          )}

          {view === 'packets' && (
            <SectionCard
              title="Captured Packets"
              description="Live packet log — search, sort & paginate"
              icon={ListTree}
            >
              <PacketTable packets={packets} />
            </SectionCard>
          )}

          {view === 'analytics' && (
            <div className="flex flex-col gap-4">
              <StatCards stats={stats} />
              <TrafficBarChart stats={stats} />
              <div className="grid gap-4 lg:grid-cols-3">
                <ProtocolPieChart stats={stats} />
                <IpVersionChart stats={stats} />
                <ThreatPieChart stats={stats} />
              </div>
            </div>
          )}

          {view === 'threats' && (
            <div className="flex flex-col gap-4">
              <ThreatSummary
                total={stats.total_packets}
                safe={stats.safe_packets}
                threat={stats.threat_packets}
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <ThreatPieChart stats={stats} />
                <SectionCard
                  title="Active Threat Feed"
                  description="Non-safe packets, newest first"
                  icon={ShieldAlert}
                >
                  <div className="max-h-[300px] overflow-auto pr-1">
                    <AlertsPanel packets={packets} limit={20} compact />
                  </div>
                </SectionCard>
              </div>
              <SectionCard
                title="Threat Packet Log"
                description="Detailed view of all flagged packets"
                icon={ShieldAlert}
              >
                <PacketTable packets={packets} threatsOnly />
              </SectionCard>
            </div>
          )}

          {view === 'alerts' && (
            <SectionCard
              title="Security Alerts"
              description={`${threatPackets.length} active alert${threatPackets.length === 1 ? '' : 's'}`}
              icon={Bell}
            >
              <AlertsPanel packets={packets} />
            </SectionCard>
          )}

          {view === 'settings' && (
            <SettingsView connected={connected} lastUpdated={lastUpdated} />
          )}
        </main>
      </div>
    </div>
  )
}

function DashboardView({
  statsCards,
  packets,
  threatCount,
  stats,
}: {
  statsCards: React.ReactNode
  packets: import('@/lib/api').Packet[]
  threatCount: number
  stats: import('@/lib/api').Stats
}) {
  return (
    <div className="flex flex-col gap-6">
      {statsCards}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TrafficBarChart stats={stats} />
        </div>
        <ThreatPieChart stats={stats} />
        <ProtocolPieChart stats={stats} />
        <IpVersionChart stats={stats} />
        <SectionCard
          title="Recent Alerts"
          description={`${threatCount} active`}
          icon={Bell}
        >
          <div className="max-h-[224px] overflow-auto pr-1">
            <AlertsPanel packets={packets} limit={6} compact />
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Live Packet Feed"
        description="Most recent captured packets"
        icon={ListTree}
      >
        <PacketTable packets={packets} />
      </SectionCard>
    </div>
  )
}

function ThreatSummary({
  total,
  safe,
  threat,
}: {
  total: number
  safe: number
  threat: number
}) {
  const rate = total > 0 ? ((threat / total) * 100).toFixed(1) : '0.0'
  const items = [
    { label: 'Total Analyzed', value: total, color: 'var(--primary)' },
    { label: 'Safe', value: safe, color: 'var(--safe)' },
    { label: 'Threats', value: threat, color: 'var(--threat)' },
    { label: 'Threat Rate', value: `${rate}%`, color: 'var(--warning)' },
  ]
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="glass rounded-2xl p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {it.label}
          </p>
          <p
            className="mt-2 font-mono text-2xl font-semibold tabular-nums"
            style={{ color: it.color }}
          >
            {typeof it.value === 'number'
              ? new Intl.NumberFormat().format(it.value)
              : it.value}
          </p>
        </div>
      ))}
    </div>
  )
}

function ConnectionError({ message }: { message: string }) {
  return (
    <div
      className="mb-6 flex items-start gap-3 rounded-2xl border p-4"
      style={{
        borderColor: 'color-mix(in oklch, var(--threat) 40%, transparent)',
        background: 'color-mix(in oklch, var(--threat) 10%, transparent)',
      }}
    >
      <AlertTriangle
        className="mt-0.5 h-5 w-5 shrink-0"
        style={{ color: 'var(--threat)' }}
      />
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--threat)' }}>
          Backend connection lost
        </p>
        <p className="text-xs text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
