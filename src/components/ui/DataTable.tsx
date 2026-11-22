import { useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { cx } from '../../lib/cx'
import { Button } from './Button'
import { Pagination } from './Pagination'

export type Column<T> = {
  id: string
  header: string
  cell: (row: T) => ReactNode
  /** Makes the column sortable. Return the value to sort by. */
  sortBy?: (row: T) => string | number
  /** Right-aligns numbers (left-aligns in right-to-left layouts). */
  numeric?: boolean
}

type DataTableProps<T> = {
  /** Describes the table for screen readers. */
  caption: string
  columns: Column<T>[]
  rows: T[]
  getRowId: (row: T) => string
  /** Name of a row for its checkbox, for example the customer name. */
  getRowLabel?: (row: T) => string
  pageSize?: number
  selectable?: boolean
  /** Shown when there are no rows. */
  empty?: ReactNode
  /** Buttons shown next to the selection count. Receives the selected row ids that match the current rows. */
  bulkActions?: (selectedIds: string[], clear: () => void) => ReactNode
  /** Short text shown in the selection bar while nothing is selected. */
  selectionHint?: string
}

type Sort = { id: string; direction: 'asc' | 'desc' } | null

export function DataTable<T>({
  caption,
  columns,
  rows,
  getRowId,
  getRowLabel,
  pageSize = 10,
  selectable = false,
  empty,
  bulkActions,
  selectionHint,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<Sort>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const sortBy = sort ? columns.find((column) => column.id === sort.id)?.sortBy : undefined
  const sorted =
    sort && sortBy
      ? [...rows].sort((a, b) => {
          const x = sortBy(a)
          const y = sortBy(b)
          const result =
            typeof x === 'number' && typeof y === 'number'
              ? x - y
              : String(x).localeCompare(String(y))
          return sort.direction === 'asc' ? result : -result
        })
      : rows

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * pageSize
  const visible = sorted.slice(start, start + pageSize)
  const visibleIds = visible.map(getRowId)
  // Only rows that are still in the table count, so a bulk action never touches hidden rows.
  const rowIds = new Set(rows.map(getRowId))
  const chosen = [...selected].filter((id) => rowIds.has(id))
  const clearSelection = () => setSelected(new Set())
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id))
  const someSelected = visibleIds.some((id) => selected.has(id))

  function toggleSort(id: string) {
    setSort((previous) =>
      previous?.id === id
        ? { id, direction: previous.direction === 'asc' ? 'desc' : 'asc' }
        : { id, direction: 'asc' },
    )
  }

  function toggleRow(id: string) {
    setSelected((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAllOnPage() {
    setSelected((previous) => {
      const next = new Set(previous)
      for (const id of visibleIds) {
        if (allSelected) next.delete(id)
        else next.add(id)
      }
      return next
    })
  }

  const columnCount = columns.length + (selectable ? 1 : 0)

  return (
    <div>
      {selectable && (
        <div aria-live="polite" className="mb-3 flex min-h-9 items-center gap-3 text-sm">
          {chosen.length > 0 ? (
            <>
              <span className="font-medium">{chosen.length} selected</span>
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                Clear selection
              </Button>
              {bulkActions?.(chosen, clearSelection)}
            </>
          ) : (
            selectionHint && <span className="text-muted">{selectionHint}</span>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-raised text-muted">
            <tr>
              {selectable && (
                <th scope="col" className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Select all rows on this page"
                    className="size-5 accent-accent"
                    checked={allSelected}
                    ref={(element) => {
                      if (element) element.indeterminate = someSelected && !allSelected
                    }}
                    onChange={toggleAllOnPage}
                  />
                </th>
              )}
              {columns.map((column) => {
                const direction = sort?.id === column.id ? sort.direction : null
                const Icon =
                  direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ChevronsUpDown
                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={
                      column.sortBy
                        ? direction === 'asc'
                          ? 'ascending'
                          : direction === 'desc'
                            ? 'descending'
                            : 'none'
                        : undefined
                    }
                    className={cx(
                      'px-4 py-3 font-medium',
                      column.numeric ? 'text-end' : 'text-start',
                    )}
                  >
                    {column.sortBy ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.id)}
                        className="inline-flex items-center gap-1.5 rounded-md hover:text-fg"
                      >
                        {column.header}
                        <Icon size={14} aria-hidden="true" />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr className="border-t border-line">
                <td colSpan={columnCount}>
                  {empty ?? <p className="p-6 text-center text-muted">No results.</p>}
                </td>
              </tr>
            )}
            {visible.map((row) => {
              const id = getRowId(row)
              const isSelected = selected.has(id)
              return (
                <tr
                  key={id}
                  className={cx(
                    'border-t border-line',
                    isSelected ? 'bg-raised' : 'hover:bg-raised/60',
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${getRowLabel?.(row) ?? id}`}
                        className="size-5 accent-accent"
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cx('px-4 py-3', column.numeric && 'text-end tabular-nums')}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Showing {sorted.length === 0 ? 0 : start + 1}–{start + visible.length} of {sorted.length}
        </p>
        <Pagination page={current} pageCount={pageCount} onPageChange={setPage} />
      </div>
    </div>
  )
}
