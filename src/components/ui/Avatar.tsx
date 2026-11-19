import { cx } from '../../lib/cx'

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-lg',
}

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return (first + last).toUpperCase()
}

type AvatarProps = { name: string; size?: keyof typeof SIZES; className?: string }

/** Shows initials, so no photos (and no photo licenses) are needed. */
export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-on-accent',
        SIZES[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
