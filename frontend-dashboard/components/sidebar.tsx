'use client'

import {
  Activity,
  BarChart3,
  Bell,
  LayoutDashboard,
  ListTree,
  Settings,
  ShieldAlert,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewId =
  | 'dashboard'
  | 'packets'
  | 'analytics'
  | 'threats'
  | 'alerts'
  | 'settings'

interface NavItem {
  id: ViewId
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'packets', label: 'Packet Logs', icon: ListTree },
  { id: 'analytics', label: 'Traffic Analytics', icon: BarChart3 },
  { id: 'threats', label: 'Threat Analysis', icon: ShieldAlert },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  active: ViewId
  onSelect: (id: ViewId) => void
  open: boolean
  collapsed: boolean
  onToggleCollapse: () => void
  alertCount: number
}

export function Sidebar({
  active,
  onSelect,
  open,
  collapsed,
  onToggleCollapse,
  alertCount,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm md:hidden"
          onClick={() => onSelect(active)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'glass-strong fixed z-40 flex h-[calc(100dvh-4rem)] flex-col border-r py-4 transition-[width,transform] duration-300 md:sticky md:top-16 md:z-0 md:translate-x-0',
          collapsed ? 'md:w-[76px]' : 'md:w-60',
          'top-16 w-60',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/15 text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  collapsed && 'md:justify-center',
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r-full bg-primary" style={{ width: 3 }} />
                )}
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isActive ? 'text-primary' : '',
                  )}
                />
                <span className={cn('flex-1 text-left', collapsed && 'md:hidden')}>
                  {item.label}
                </span>
                {item.id === 'alerts' && alertCount > 0 && (
                  <span
                    className={cn(
                      'grid min-w-5 place-items-center rounded-full px-1.5 text-xs font-bold text-background',
                      collapsed && 'md:absolute md:right-1 md:top-1 md:min-w-0 md:px-1',
                    )}
                    style={{ background: 'var(--threat)' }}
                  >
                    {alertCount > 99 ? '99+' : alertCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="mt-2 hidden px-3 md:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Activity className="h-5 w-5 shrink-0" />
            <span className={cn(collapsed && 'md:hidden')}>Collapse</span>
          </button>
        </div>
      </aside>
    </>
  )
}
