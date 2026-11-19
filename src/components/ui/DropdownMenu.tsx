import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type MenuItem = {
  label: string
  onSelect: () => void
  icon?: ReactNode
  danger?: boolean
}

type DropdownMenuProps = {
  /** Describes the menu for screen readers, for example "Order actions". */
  label: string
  items: MenuItem[]
  /** What the trigger button shows. */
  children: ReactNode
  triggerClassName?: string
}

export function DropdownMenu({ label, items, children, triggerClassName }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    itemRefs.current[0]?.focus()
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const elements = itemRefs.current.filter((el): el is HTMLButtonElement => el !== null)
    const index = elements.findIndex((el) => el === document.activeElement)
    const move = (next: number) => {
      event.preventDefault()
      elements[(next + elements.length) % elements.length]?.focus()
    }

    if (event.key === 'ArrowDown') move(index + 1)
    else if (event.key === 'ArrowUp') move(index - 1)
    else if (event.key === 'Home') move(0)
    else if (event.key === 'End') move(elements.length - 1)
    else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault()
            setOpen(true)
          }
        }}
        className={cx(
          'inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-raised',
          triggerClassName,
        )}
      >
        {children}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className="absolute end-0 top-full z-40 mt-2 min-w-48 rounded-2xl border border-line bg-surface p-1.5 shadow-[0_18px_40px_-18px_color-mix(in_oklab,var(--fg)_45%,transparent)]"
        >
          {items.map((item, index) => (
            <button
              key={item.label}
              ref={(element) => {
                itemRefs.current[index] = element
              }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                close()
                item.onSelect()
              }}
              className={cx(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm transition-colors hover:bg-raised focus-visible:bg-raised',
                item.danger && 'text-hot',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
