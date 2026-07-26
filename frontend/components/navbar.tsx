'use client'

import { useEffect, useState } from 'react'
import { Menu, ShieldCheck } from 'lucide-react'

interface NavbarProps {
  connected: boolean
  onToggleSidebar: () => void
}

export function Navbar({ connected, onToggleSidebar }: NavbarProps) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="glass-strong sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/40">
            <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold tracking-tight text-foreground md:text-base">
              Deep Packet Inspection System
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Security Operations Center
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <LiveIndicator connected={connected} />
        <div className="hidden text-right sm:block">
          <p className="font-mono text-sm font-medium tabular-nums text-foreground">
            {now ? now.toLocaleTimeString() : '--:--:--'}
          </p>
          <p className="text-xs text-muted-foreground">
            {now
              ? now.toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Loading…'}
          </p>
        </div>
      </div>
    </header>
  )
}

function LiveIndicator({ connected }: { connected: boolean }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full border px-3 py-1.5"
      style={{
        borderColor: connected
          ? 'color-mix(in oklch, var(--safe) 45%, transparent)'
          : 'color-mix(in oklch, var(--threat) 45%, transparent)',
        background: connected
          ? 'color-mix(in oklch, var(--safe) 12%, transparent)'
          : 'color-mix(in oklch, var(--threat) 12%, transparent)',
      }}
    >
      <span
        className={`h-2 w-2 rounded-full ${connected ? 'animate-live' : ''}`}
        style={{ background: connected ? 'var(--safe)' : 'var(--threat)' }}
      />
      <span
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: connected ? 'var(--safe)' : 'var(--threat)' }}
      >
        {connected ? 'Live' : 'Offline'}
      </span>
    </div>
  )
}
