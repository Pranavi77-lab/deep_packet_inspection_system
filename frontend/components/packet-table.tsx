'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Lock,
  Search,
  Unlock,
} from 'lucide-react'
import type { Packet } from '@/lib/api'
import { ProtocolBadge, SeverityBadge, ThreatBadge } from '@/components/badges'
import { cn } from '@/lib/utils'

type SortKey = keyof Packet
type SortDir = 'asc' | 'desc'

const COLUMNS: { key: SortKey; label: string; sortable?: boolean }[] = [
  { key: 'Packet ID', label: 'ID', sortable: true },
  { key: 'Timestamp', label: 'Timestamp', sortable: true },
  { key: 'Source IP', label: 'Source', sortable: true },
  { key: 'Destination IP', label: 'Destination', sortable: true },
  { key: 'IP Version', label: 'IP Ver', sortable: true },
  { key: 'Protocol', label: 'Protocol', sortable: true },
  { key: 'Source Port', label: 'Src Port', sortable: true },
  { key: 'Destination Port', label: 'Dst Port', sortable: true },
  { key: 'Threat', label: 'Threat', sortable: true },
  { key: 'Severity', label: 'Severity', sortable: true },
  { key: 'Payload Status', label: 'Payload', sortable: true },
]

const PAGE_SIZE = 12

interface PacketTableProps {
  packets: Packet[]
  /** When true, only threats (non-SAFE) are shown. */
  threatsOnly?: boolean
}

export function PacketTable({ packets, threatsOnly = false }: PacketTableProps) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('Packet ID')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const processed = useMemo(() => {
    let rows = packets
    if (threatsOnly) {
      rows = rows.filter(
        (p) => (p.Threat ?? '').toUpperCase() !== 'SAFE',
      )
    }
    const q = query.trim().toLowerCase()
    if (q) {
      rows = rows.filter((p) =>
        Object.values(p).some((v) => String(v).toLowerCase().includes(q)),
      )
    }
    const sorted = [...rows].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      let cmp: number
      if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv
      } else {
        cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [packets, query, sortKey, sortDir, threatsOnly])

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = processed.slice(start, start + PAGE_SIZE)

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search IP, port, protocol…"
            className="w-full rounded-xl border bg-secondary/40 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Showing{' '}
          <span className="font-mono text-foreground">{pageRows.length}</span> of{' '}
          <span className="font-mono text-foreground">{processed.length}</span>{' '}
          packets
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="max-h-[540px] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-secondary/80 backdrop-blur">
                {COLUMNS.map((col) => (
                  <th
                    key={String(col.key)}
                    className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                      {col.label}
                      <SortIcon
                        active={sortKey === col.key}
                        dir={sortDir}
                      />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    {threatsOnly
                      ? 'No threats detected. All captured traffic is safe.'
                      : 'No packets captured yet. Waiting for live data…'}
                  </td>
                </tr>
              ) : (
                pageRows.map((p) => (
                  <tr
                    key={p['Packet ID']}
                    className="border-t border-border/60 transition-colors hover:bg-primary/5"
                  >
                    <td className="px-3 py-2.5 font-mono text-muted-foreground">
                      {p['Packet ID']}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-muted-foreground">
                      {p.Timestamp}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-foreground">
                      {p['Source IP']}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-foreground">
                      {p['Destination IP']}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {p['IP Version']}
                    </td>
                    <td className="px-3 py-2.5">
                      <ProtocolBadge protocol={p.Protocol} />
                    </td>
                    <td className="px-3 py-2.5 font-mono text-muted-foreground">
                      {p['Source Port']}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-muted-foreground">
                      {p['Destination Port']}
                    </td>
                    <td className="px-3 py-2.5">
                      <ThreatBadge threat={p.Threat} severity={p.Severity} />
                    </td>
                    <td className="px-3 py-2.5">
                      <SeverityBadge severity={p.Severity} />
                    </td>
                    <td className="px-3 py-2.5">
                      <PayloadCell status={p['Payload Status']} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Page <span className="font-mono text-foreground">{currentPage}</span> /{' '}
          <span className="font-mono text-foreground">{totalPages}</span>
        </p>
        <div className="flex items-center gap-2">
          <PagerButton
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </PagerButton>
          <PagerButton
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </PagerButton>
        </div>
      </div>
    </div>
  )
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-40" />
  return dir === 'asc' ? (
    <ArrowUp className="h-3 w-3 text-primary" />
  ) : (
    <ArrowDown className="h-3 w-3 text-primary" />
  )
}

function PayloadCell({ status }: { status: string }) {
  const encrypted = (status ?? '').toLowerCase().includes('encrypt')
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      {encrypted ? (
        <Lock className="h-3.5 w-3.5" style={{ color: 'var(--safe)' }} />
      ) : (
        <Unlock className="h-3.5 w-3.5" style={{ color: 'var(--warning)' }} />
      )}
      {status || '—'}
    </span>
  )
}

function PagerButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
        disabled
          ? 'cursor-not-allowed text-muted-foreground opacity-50'
          : 'text-foreground hover:bg-secondary',
      )}
    >
      {children}
    </button>
  )
}
