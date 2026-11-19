import { cloneElement, useId, useState, type ReactElement } from 'react'
import { cx } from '../../lib/cx'

type TooltipProps = {
  label: string
  children: ReactElement<{ 'aria-describedby'?: string }>
}

/** Shows a short hint on hover or keyboard focus. Press Escape to hide it. */
export function Tooltip({ label, children }: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false)
      }}
    >
      {cloneElement(children, { 'aria-describedby': id })}
      <span
        id={id}
        role="tooltip"
        className={cx(
          'pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg bg-fg px-2.5 py-1 text-xs whitespace-nowrap text-bg transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
      >
        {label}
      </span>
    </span>
  )
}
