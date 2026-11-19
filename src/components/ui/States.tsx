import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'

/** A grey pulsing placeholder shown while content loads. Decorative, so it is hidden from screen readers. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'animate-pulse bg-line/60',
        className?.includes('rounded') ? '' : 'rounded-xl',
        className,
      )}
    />
  )
}

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

/** Shown when a list or table has nothing to display yet. */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <div className="rounded-full border border-line bg-raised p-3 text-muted">{icon}</div>
      <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
