'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <section className={cn('glass rounded-2xl p-4 md:p-5', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/12 ring-1 ring-primary/25">
              <Icon className="h-4.5 w-4.5 text-primary" />
            </span>
          )}
          <div>
            <h2 className="text-sm font-semibold text-foreground md:text-base">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
