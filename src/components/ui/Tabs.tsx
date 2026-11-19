import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type TabItem = { id: string; label: string; content: ReactNode }

type TabsProps = {
  /** Describes the tab set for screen readers, for example "Order sections". */
  label: string
  tabs: TabItem[]
  initialId?: string
}

export function Tabs({ label, tabs, initialId }: TabsProps) {
  const [activeId, setActiveId] = useState(initialId ?? tabs[0]?.id)
  const baseId = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  function select(index: number) {
    const wrapped = (index + tabs.length) % tabs.length
    setActiveId(tabs[wrapped].id)
    tabRefs.current[wrapped]?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    // In right-to-left layouts the arrow keys swap direction.
    const rtl = document.documentElement.dir === 'rtl'
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight'
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft'

    if (event.key === forward) select(index + 1)
    else if (event.key === backward) select(index - 1)
    else if (event.key === 'Home') select(0)
    else if (event.key === 'End') select(tabs.length - 1)
    else return
    event.preventDefault()
  }

  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0]

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="flex gap-6 overflow-x-auto border-b border-line"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === active.id
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              id={`${baseId}-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cx(
                '-mb-px border-b-2 px-1 pb-3 text-sm font-medium whitespace-nowrap transition-colors',
                selected ? 'border-fg text-fg' : 'border-transparent text-muted hover:text-fg',
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel-${active.id}`}
        aria-labelledby={`${baseId}-tab-${active.id}`}
        tabIndex={0}
        className="pt-5"
      >
        {active.content}
      </div>
    </div>
  )
}
