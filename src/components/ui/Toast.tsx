import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cx } from '../../lib/cx'
import { IconButton } from './Button'
import { ToastContext, type ToastInput } from './toast-context'

type ToastItem = ToastInput & { id: number }

type ToastCardProps = { toast: ToastItem; dismiss: (id: number) => void }

function ToastCard({ toast, dismiss }: ToastCardProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(toast.id), 5000)
    return () => window.clearTimeout(timer)
  }, [dismiss, toast.id])

  const danger = toast.tone === 'danger'
  return (
    <div
      role={danger ? 'alert' : 'status'}
      className={cx(
        'pointer-events-auto flex w-full animate-rise items-start gap-3 rounded-2xl border border-line bg-surface p-4 shadow-[0_18px_40px_-18px_color-mix(in_oklab,var(--fg)_45%,transparent)]',
        danger && 'border-s-4 border-s-hot',
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-sm text-muted">{toast.description}</p>}
      </div>
      <IconButton label="Dismiss notification" onClick={() => dismiss(toast.id)} className="-m-1">
        <X size={18} />
      </IconButton>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((item) => item.id !== id))
  }, [])

  const push = useCallback((toast: ToastInput) => {
    const id = nextId.current++
    setToasts((list) => [...list.slice(-3), { ...toast, id }])
  }, [])

  return (
    <ToastContext value={push}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className="pointer-events-none fixed start-4 end-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:start-auto sm:end-6 sm:bottom-6 sm:w-96"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} dismiss={dismiss} />
        ))}
      </div>
    </ToastContext>
  )
}
