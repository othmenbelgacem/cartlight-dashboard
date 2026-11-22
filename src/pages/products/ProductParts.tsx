import { Badge } from '../../components/ui/Badge'
import type { ProductStatus } from '../../data/types'
import { cx } from '../../lib/cx'
import { stockLevel } from './stock'

const STATUS_TONE = { active: 'success', draft: 'accent', archived: 'neutral' } as const

/** A label for whether a product is on sale, still a draft, or archived. */
export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge tone={STATUS_TONE[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  )
}

// The bar is full at this many items.
const FULL_BAR_AT = 60

/** How much of a product is left, in words and as a bar. The words always say it, colour never has to. */
export function StockMeter({ stock }: { stock: number }) {
  const level = stockLevel(stock)
  const text =
    level === 'out' ? 'Out of stock' : level === 'low' ? `Only ${stock} left` : `${stock} in stock`

  return (
    <div>
      <p
        className={cx(
          'text-sm tabular-nums',
          level === 'ok' ? 'text-muted' : 'font-medium text-hot',
        )}
      >
        {text}
      </p>
      <div aria-hidden="true" className="mt-1.5 h-1.5 rounded-full bg-line">
        <div
          className={cx('h-full rounded-full', level === 'ok' ? 'bg-link' : 'bg-hot')}
          style={{ width: `${Math.min(stock / FULL_BAR_AT, 1) * 100}%` }}
        />
      </div>
    </div>
  )
}
