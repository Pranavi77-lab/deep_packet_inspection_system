'use client'

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BarChart3, Globe, PieChart as PieIcon, ShieldCheck } from 'lucide-react'
import type { Stats } from '@/lib/api'
import { SectionCard } from '@/components/section-card'

const COLORS = {
  primary: 'oklch(0.62 0.19 250)',
  cyan: 'oklch(0.75 0.14 205)',
  safe: 'oklch(0.72 0.18 155)',
  warning: 'oklch(0.75 0.16 65)',
  threat: 'oklch(0.63 0.23 25)',
}

const tooltipStyle = {
  background: 'oklch(0.2 0.035 258)',
  border: '1px solid oklch(0.4 0.04 255 / 0.35)',
  borderRadius: 12,
  color: 'oklch(0.95 0.01 250)',
  fontSize: 12,
  padding: '8px 12px',
}

function EmptyOverlay({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <p className="text-xs text-muted-foreground">Awaiting live packet data…</p>
    </div>
  )
}

/* ---------------- Network Traffic Bar Chart ---------------- */
export function TrafficBarChart({ stats }: { stats: Stats }) {
  const data = [
    { name: 'TCP', value: stats.tcp_packets, fill: COLORS.cyan },
    { name: 'UDP', value: stats.udp_packets, fill: COLORS.warning },
    { name: 'IPv4', value: stats.ipv4_packets, fill: COLORS.primary },
    { name: 'IPv6', value: stats.ipv6_packets, fill: COLORS.safe },
    { name: 'Safe', value: stats.safe_packets, fill: COLORS.safe },
    { name: 'Threat', value: stats.threat_packets, fill: COLORS.threat },
  ]
  const empty = data.every((d) => d.value === 0)

  return (
    <SectionCard
      title="Network Traffic Overview"
      description="Live packet distribution by category"
      icon={BarChart3}
    >
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: 'oklch(0.68 0.03 255)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'oklch(0.4 0.04 255 / 0.25)' }}
            />
            <YAxis
              tick={{ fill: 'oklch(0.68 0.03 255)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: 'oklch(0.62 0.19 250 / 0.08)' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <EmptyOverlay show={empty} />
      </div>
    </SectionCard>
  )
}

/* ---------------- Reusable donut / pie ---------------- */
function DonutChart({
  data,
  innerRadius,
}: {
  data: { name: string; value: number; fill: string }[]
  innerRadius: number
}) {
  const empty = data.every((d) => d.value === 0)
  const display = empty ? data.map((d) => ({ ...d, value: 1 })) : data

  return (
    <div className="relative h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={display}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={82}
            paddingAngle={2}
            stroke="oklch(0.17 0.03 258)"
            strokeWidth={2}
          >
            {display.map((entry, i) => (
              <Cell key={i} fill={empty ? 'oklch(0.3 0.03 258)' : entry.fill} />
            ))}
          </Pie>
          {!empty && <Tooltip contentStyle={tooltipStyle} />}
          <Legend
            verticalAlign="bottom"
            height={28}
            iconType="circle"
            formatter={(value) => (
              <span style={{ color: 'oklch(0.78 0.02 255)', fontSize: 12 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <EmptyOverlay show={empty} />
    </div>
  )
}

/* ---------------- TCP vs UDP ---------------- */
export function ProtocolPieChart({ stats }: { stats: Stats }) {
  const data = [
    { name: 'TCP', value: stats.tcp_packets, fill: COLORS.cyan },
    { name: 'UDP', value: stats.udp_packets, fill: COLORS.warning },
  ]
  return (
    <SectionCard title="TCP vs UDP" description="Transport protocol split" icon={PieIcon}>
      <DonutChart data={data} innerRadius={0} />
    </SectionCard>
  )
}

/* ---------------- IPv4 vs IPv6 ---------------- */
export function IpVersionChart({ stats }: { stats: Stats }) {
  const data = [
    { name: 'IPv4', value: stats.ipv4_packets, fill: COLORS.primary },
    { name: 'IPv6', value: stats.ipv6_packets, fill: COLORS.safe },
  ]
  return (
    <SectionCard title="IPv4 vs IPv6" description="IP version distribution" icon={Globe}>
      <DonutChart data={data} innerRadius={48} />
    </SectionCard>
  )
}

/* ---------------- Safe vs Threat ---------------- */
export function ThreatPieChart({ stats }: { stats: Stats }) {
  const data = [
    { name: 'Safe', value: stats.safe_packets, fill: COLORS.safe },
    { name: 'Threat', value: stats.threat_packets, fill: COLORS.threat },
  ]
  return (
    <SectionCard
      title="Safe vs Threat"
      description="Security classification"
      icon={ShieldCheck}
    >
      <DonutChart data={data} innerRadius={0} />
    </SectionCard>
  )
}
