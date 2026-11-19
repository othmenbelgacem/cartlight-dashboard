import type { ComponentProps } from 'react'
import { cx } from '../../lib/cx'

type ChoiceProps = { label: string; className?: string } & Omit<
  ComponentProps<'input'>,
  'type' | 'className'
>

const BOX = 'size-5 shrink-0 accent-accent'

export function Checkbox({ label, className, ...props }: ChoiceProps) {
  return (
    <label className={cx('inline-flex items-center gap-3 text-sm', className)}>
      <input type="checkbox" className={BOX} {...props} />
      {label}
    </label>
  )
}

export function Radio({ label, className, ...props }: ChoiceProps) {
  return (
    <label className={cx('inline-flex items-center gap-3 text-sm', className)}>
      <input type="radio" className={BOX} {...props} />
      {label}
    </label>
  )
}

/** An on/off switch. It is a real checkbox underneath, so the keyboard and screen readers just work. */
export function Switch({ label, className, ...props }: ChoiceProps) {
  return (
    <label className={cx('inline-flex items-center gap-3 text-sm', className)}>
      <input type="checkbox" role="switch" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-full border border-line bg-raised transition-colors peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-link peer-disabled:opacity-50 after:absolute after:start-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-muted after:transition-[inset-inline-start] peer-checked:after:start-5 peer-checked:after:bg-on-accent"
      />
      {label}
    </label>
  )
}
