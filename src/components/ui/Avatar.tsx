import { cx } from '../../lib/cx'

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-lg',
}

// Three looks, picked from the name so the same person always gets the same colour.
const TONES = ['bg-accent text-on-accent', 'bg-link text-bg', 'bg-fg text-bg']

function toneFor(name: string) {
  let sum = 0
  for (const character of name) sum += character.codePointAt(0) ?? 0
  return TONES[sum % TONES.length]
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
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        toneFor(name),
        SIZES[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
