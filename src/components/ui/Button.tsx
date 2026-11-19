import type { ComponentProps } from 'react'
import { cx } from '../../lib/cx'

const VARIANTS = {
  primary: 'bg-accent text-on-accent hover:opacity-90',
  secondary: 'border border-line bg-surface text-fg hover:bg-raised',
  ghost: 'text-muted hover:bg-raised hover:text-fg',
  danger: 'bg-hot text-on-hot hover:opacity-90',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
}

type ButtonProps = ComponentProps<'button'> & {
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  )
}

type IconButtonProps = Omit<ComponentProps<'button'>, 'aria-label'> & { label: string }

/** A round button with only an icon. `label` is required so screen readers know what it does. */
export function IconButton({ label, type = 'button', className, ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        'rounded-full p-2 text-muted transition-colors hover:bg-raised hover:text-fg disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
