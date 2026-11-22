import type { ReactNode } from 'react'
import type { Product } from '../../data/types'
import { cx } from '../../lib/cx'

// Drawn artwork instead of photos: no image files, no photo licences, and it follows the theme.
const COLOURS = ['var(--accent)', 'var(--link)', 'var(--fg)'] as const

function hash(text: string) {
  let value = 0
  for (const character of text) value = (value * 31 + (character.codePointAt(0) ?? 0)) >>> 0
  return value
}

type Shapes = (a: string, b: string, c: string) => ReactNode

const MOTIFS: Record<Product['category'], Shapes> = {
  Kitchen: (a, b) => (
    <>
      <circle cx="100" cy="70" r="48" fill={a} />
      <circle cx="100" cy="70" r="32" fill="var(--surface)" />
      <circle cx="100" cy="70" r="14" fill={b} />
    </>
  ),
  Home: (a, b) => (
    <>
      <path d="M60 120V70a40 40 0 0 1 80 0v50z" fill={a} />
      <path d="M78 120V74a22 22 0 0 1 44 0v46z" fill="var(--surface)" />
      <rect x="40" y="118" width="120" height="6" rx="3" fill={b} />
    </>
  ),
  Beauty: (a, b, c) => (
    <>
      <rect x="78" y="48" width="44" height="72" rx="14" fill={a} />
      <rect x="90" y="30" width="20" height="22" rx="4" fill={b} />
      <circle cx="100" cy="22" r="9" fill={c} />
    </>
  ),
  Food: (a, b) => (
    <>
      <rect x="70" y="44" width="60" height="76" rx="12" fill={a} />
      <rect x="64" y="30" width="72" height="18" rx="6" fill={b} />
      <circle cx="100" cy="84" r="14" fill="var(--surface)" />
    </>
  ),
  Fashion: (a, b) => (
    <>
      <path d="M30 110 L100 30 L170 110 Z" fill={a} />
      <path d="M30 110 Q65 85 100 110 T170 110 V124 H30 Z" fill={b} />
    </>
  ),
}

/** A small drawn picture for a product. Decorative, so screen readers skip it. */
export function ProductArt({ product, className }: { product: Product; className?: string }) {
  const seed = hash(product.id)
  const [a, b, c] = [COLOURS[seed % 3], COLOURS[(seed + 1) % 3], COLOURS[(seed + 2) % 3]]

  return (
    <svg
      viewBox="0 0 200 140"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className={cx('block h-auto w-full', className)}
    >
      <rect width="200" height="140" fill="var(--raised)" />
      {MOTIFS[product.category](a, b, c)}
    </svg>
  )
}
