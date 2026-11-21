import type { OrderStatus } from '../../data/types'
import { Badge } from './Badge'

const TONES = {
  new: 'accent',
  packed: 'neutral',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
} as const

/** A coloured label for an order status. The word is always shown, so colour is never the only clue. */
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={TONES[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}
