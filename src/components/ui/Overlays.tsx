import { useId, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cx } from '../../lib/cx'
import { IconButton } from './Button'
import { useModalDialog } from './useModalDialog'

type OverlayProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Buttons shown at the bottom, for example Cancel and Save. */
  footer?: ReactNode
}

type DialogProps = OverlayProps & { side?: boolean }

// Both overlays use the browser's built-in <dialog>: it traps the keyboard focus,
// closes on Escape and blocks the page behind it, without extra code.
function Dialog({ open, onClose, title, children, footer, side = false }: DialogProps) {
  const ref = useModalDialog(open)
  const titleId = useId()

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className={cx(
        'border border-line bg-surface p-0 text-fg backdrop:bg-fg/50',
        side
          ? 'm-0 ms-auto h-dvh max-h-none w-full max-w-md rounded-none border-y-0 border-e-0'
          : 'm-auto w-[min(32rem,calc(100%-2rem))] rounded-tile shadow-[0_30px_60px_-24px_color-mix(in_oklab,var(--fg)_55%,transparent)]',
      )}
    >
      {open && (
        <div className={cx('flex flex-col', side ? 'h-dvh' : 'max-h-[85dvh]')}>
          <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
            <h2 id={titleId} className="font-display text-xl font-bold">
              {title}
            </h2>
            <IconButton label="Close" onClick={onClose}>
              <X size={20} />
            </IconButton>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {footer && (
            <div className="flex justify-end gap-3 border-t border-line px-6 py-4">{footer}</div>
          )}
        </div>
      )}
    </dialog>
  )
}

/** A centred pop-up for confirmations and short forms. */
export function Modal(props: OverlayProps) {
  return <Dialog {...props} />
}

/** A panel that slides in from the end side (right in English, left in Arabic). */
export function Drawer(props: OverlayProps) {
  return <Dialog {...props} side />
}
