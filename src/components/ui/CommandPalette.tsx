import { Fragment, useEffect, useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Search } from 'lucide-react'
import { cx } from '../../lib/cx'
import { useModalDialog } from './useModalDialog'

export type Command = {
  id: string
  label: string
  /** Commands with the same group are listed together under a heading. */
  group: string
  icon?: ReactNode
  /** Extra words that should also match, for example "dark mode". */
  keywords?: string
  run: () => void
}

type CommandPaletteProps = {
  open: boolean
  onClose: () => void
  commands: Command[]
}

function PaletteBody({ commands, onClose }: Omit<CommandPaletteProps, 'open'>) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const listId = useId()

  const needle = query.trim().toLowerCase()
  const results = needle
    ? commands.filter((command) =>
        `${command.label} ${command.group} ${command.keywords ?? ''}`
          .toLowerCase()
          .includes(needle),
      )
    : commands
  const active = Math.min(activeIndex, Math.max(results.length - 1, 0))
  const activeCommand = results[active]
  const activeId = activeCommand ? `${listId}-${activeCommand.id}` : undefined

  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView?.({ block: 'nearest' })
  }, [activeId])

  function run(command: Command) {
    onClose()
    command.run()
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const count = Math.max(results.length, 1)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((active + 1) % count)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((active - 1 + count) % count)
    } else if (event.key === 'Enter' && activeCommand) {
      event.preventDefault()
      run(activeCommand)
    }
  }

  return (
    <div>
      <div className="relative border-b border-line">
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          autoFocus
          role="combobox"
          aria-label="Search commands"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
          onKeyDown={onKeyDown}
          placeholder="Type a page or command…"
          className="w-full bg-transparent py-4 ps-12 pe-4 text-base placeholder:text-muted focus-visible:-outline-offset-2"
        />
      </div>

      <ul id={listId} role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto p-2">
        {results.map((command, index) => (
          <Fragment key={command.id}>
            {(index === 0 || results[index - 1].group !== command.group) && (
              <li role="presentation" className="px-3 pt-3 pb-1 text-xs font-medium text-muted">
                {command.group}
              </li>
            )}
            <li
              id={`${listId}-${command.id}`}
              role="option"
              aria-selected={index === active}
              onMouseMove={() => setActiveIndex(index)}
              onClick={() => run(command)}
              className={cx(
                'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm',
                index === active && 'bg-raised',
              )}
            >
              {command.icon}
              {command.label}
            </li>
          </Fragment>
        ))}
      </ul>

      {results.length === 0 && (
        <p role="status" className="px-4 py-8 text-center text-sm text-muted">
          No match for “{query}”.
        </p>
      )}

      <p className="border-t border-line px-4 py-2.5 text-xs text-muted">
        Arrow keys to move, Enter to choose, Escape to close.
      </p>
    </div>
  )
}

/** A quick-search box for jumping to pages and running actions with the keyboard. */
export function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  const ref = useModalDialog(open)

  return (
    <dialog
      ref={ref}
      aria-label="Command palette"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-auto mt-[12vh] w-[min(36rem,calc(100%-2rem))] overflow-hidden rounded-tile border border-line bg-surface p-0 text-fg shadow-[0_30px_60px_-24px_color-mix(in_oklab,var(--fg)_55%,transparent)] backdrop:bg-fg/50"
    >
      {open && <PaletteBody commands={commands} onClose={onClose} />}
    </dialog>
  )
}
