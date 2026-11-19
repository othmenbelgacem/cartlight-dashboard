import { useId, type ComponentProps, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cx } from '../../lib/cx'

const CONTROL =
  'w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted disabled:opacity-50'

type FieldProps = { label: string; hint?: string; error?: string; className?: string }

type ShellProps = FieldProps & { id: string; children: ReactNode }

function FieldShell({ id, label, hint, error, className, children }: ShellProps) {
  const message = error ?? hint
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {message && (
        <p id={`${id}-message`} className={cx('text-sm', error ? 'text-hot' : 'text-muted')}>
          {message}
        </p>
      )}
    </div>
  )
}

function fieldState(id: string, hint?: string, error?: string) {
  return {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error || hint ? `${id}-message` : undefined,
  }
}

type InputProps = FieldProps & Omit<ComponentProps<'input'>, 'id' | 'className'>

export function Input({ label, hint, error, className, ...props }: InputProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <input
        {...fieldState(id, hint, error)}
        className={cx(CONTROL, error && 'border-hot')}
        {...props}
      />
    </FieldShell>
  )
}

type TextareaProps = FieldProps & Omit<ComponentProps<'textarea'>, 'id' | 'className'>

export function Textarea({ label, hint, error, className, ...props }: TextareaProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <textarea
        rows={4}
        {...fieldState(id, hint, error)}
        className={cx(CONTROL, 'resize-y', error && 'border-hot')}
        {...props}
      />
    </FieldShell>
  )
}

type SelectProps = FieldProps & Omit<ComponentProps<'select'>, 'id' | 'className'>

export function Select({ label, hint, error, className, children, ...props }: SelectProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <div className="relative">
        <select
          {...fieldState(id, hint, error)}
          className={cx(CONTROL, 'appearance-none pe-10', error && 'border-hot')}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
    </FieldShell>
  )
}
