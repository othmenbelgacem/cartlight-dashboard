import type { ComponentProps } from 'react'
import { cx } from '../../lib/cx'

const TONES = {
  neutral: 'border border-line bg-raised text-fg',
  accent: 'bg-accent text-on-accent',
  info: 'border border-link text-link',
  success: 'bg-link text-bg',
  danger: 'bg-hot text-on-hot',
}

type BadgeProps = ComponentProps<'span'> & { tone?: keyof typeof TONES }

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
      {...props}
    />
  )
}
