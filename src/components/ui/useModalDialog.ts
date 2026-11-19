import { useEffect, useRef } from 'react'

const FOCUSABLE = 'input, textarea, select, button, a[href], [tabindex]:not([tabindex="-1"])'

/**
 * Opens and closes a native <dialog> as a modal, and locks page scrolling while it is open.
 * The browser handles keyboard focus trapping and the Escape key.
 */
export function useModalDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal()
      } else {
        // Fallback for environments without showModal (very old browsers, test runners):
        // open the dialog and move focus inside it, as showModal would.
        dialog.setAttribute('open', '')
        dialog.querySelector<HTMLElement>(FOCUSABLE)?.focus()
      }
    }
    if (!open && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close()
      else dialog.removeAttribute('open')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return ref
}
