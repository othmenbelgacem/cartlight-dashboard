import type { ComponentProps } from 'react'
import { cx } from '../../lib/cx'

export function Card({ className, ...props }: ComponentProps<'section'>) {
  return (
    <section
      className={cx(
        'rounded-tile border border-line bg-surface p-6 shadow-[0_14px_28px_-20px_color-mix(in_oklab,var(--fg)_35%,transparent)]',
        className,
      )}
      {...props}
    />
  )
}

// How many columns a tile uses: 1 column on phones, 6-column grid on tablets, 12-column grid on desktop.
const SPANS = {
  small: 'md:col-span-3 lg:col-span-3',
  medium: 'md:col-span-3 lg:col-span-4',
  large: 'md:col-span-6 lg:col-span-6',
  wide: 'md:col-span-6 lg:col-span-8',
  full: 'md:col-span-6 lg:col-span-12',
}

export function BentoGrid({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cx('grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12', className)}
      {...props}
    />
  )
}

type BentoTileProps = ComponentProps<'section'> & {
  size?: keyof typeof SPANS
  tall?: boolean
}

export function BentoTile({ size = 'medium', tall = false, className, ...props }: BentoTileProps) {
  return <Card className={cx(SPANS[size], tall && 'md:row-span-2', className)} {...props} />
}
