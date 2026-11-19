import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cx } from '../../lib/cx'

type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

/** Page numbers to show: first, last, and the pages around the current one. */
function pageItems(page: number, pageCount: number): Array<number | 'gap'> {
  const numbers = [...new Set([1, pageCount, page - 1, page, page + 1])]
    .filter((n) => n >= 1 && n <= pageCount)
    .sort((a, b) => a - b)
  const items: Array<number | 'gap'> = []
  numbers.forEach((n, index) => {
    if (index > 0 && n - numbers[index - 1] > 1) items.push('gap')
    items.push(n)
  })
  return items
}

const BUTTON =
  'inline-flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors'
const STEP = `${BUTTON} text-muted hover:bg-raised hover:text-fg disabled:pointer-events-none disabled:opacity-40`

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={STEP}
      >
        <ChevronLeft size={18} className="rtl:-scale-x-100" />
      </button>

      <p className="px-2 text-sm text-muted sm:hidden">
        Page {page} of {pageCount}
      </p>
      <ul className="hidden items-center gap-1 sm:flex">
        {pageItems(page, pageCount).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
                className={cx(
                  BUTTON,
                  item === page
                    ? 'bg-accent text-on-accent'
                    : 'text-muted hover:bg-raised hover:text-fg',
                )}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className={STEP}
      >
        <ChevronRight size={18} className="rtl:-scale-x-100" />
      </button>
    </nav>
  )
}
