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
  /** Use 2 when the empty state sits directly under the page title, otherwise keep the default 3. */
  headingLevel?: 2 | 3
}

/** Shown when a list or table has nothing to display yet. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  headingLevel = 3,
}: EmptyStateProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <div className="rounded-full border border-line bg-raised p-3 text-muted">{icon}</div>
      <Heading className="mt-4 font-display text-lg font-bold">{title}</Heading>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
