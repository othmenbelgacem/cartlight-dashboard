import { createContext, useContext } from 'react'

export type ToastInput = { title: string; description?: string; tone?: 'neutral' | 'danger' }

export const ToastContext = createContext<((toast: ToastInput) => void) | null>(null)

/** Returns a function that shows a toast: `toast({ title: 'Order saved' })`. */
export function useToast() {
  const push = useContext(ToastContext)
  if (!push) throw new Error('useToast must be used inside <ToastProvider>')
  return push
}
