'use client'

function styleFor(color: string) {
  return {
    color,
    background: `color-mix(in oklch, ${color} 14%, transparent)`,
    borderColor: `color-mix(in oklch, ${color} 40%, transparent)`,
  }
}

export function ProtocolBadge({ protocol }: { protocol: string }) {
  const p = (protocol ?? '').toUpperCase()
  const color =
    p === 'TCP'
      ? 'var(--cyan)'
      : p === 'UDP'
        ? 'var(--warning)'
        : 'var(--muted-foreground)'
  return (
    <span
      className="inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-semibold"
      style={styleFor(color)}
    >
      {protocol || '—'}
    </span>
  )
}

export function ThreatBadge({
  threat,
  severity,
}: {
  threat: string
  severity?: string
}) {
  const t = (threat ?? '').toUpperCase()
  const isSafe = t === 'SAFE' || t === 'NONE' || t === ''
  const sev = (severity ?? '').toUpperCase()
  const isWarning =
    !isSafe && (sev === 'LOW' || sev === 'MEDIUM' || t === 'SUSPICIOUS')

  const color = isSafe ? 'var(--safe)' : isWarning ? 'var(--warning)' : 'var(--threat)'

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold"
      style={styleFor(color)}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      {threat || 'SAFE'}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: string }) {
  const s = (severity ?? 'NONE').toUpperCase()
  const color =
    s === 'HIGH' || s === 'CRITICAL'
      ? 'var(--threat)'
      : s === 'MEDIUM' || s === 'LOW'
        ? 'var(--warning)'
        : 'var(--muted-foreground)'
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
      style={{
        color,
        background: `color-mix(in oklch, ${color} 12%, transparent)`,
      }}
    >
      {severity || 'NONE'}
    </span>
  )
}
