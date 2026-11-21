import type { Order, OrderStatus } from '../../data/types'

export type StatusFilter = OrderStatus | 'all'
export type RangeFilter = 'all' | '7' | '14' | '30'

export type OrderFilters = { query: string; status: StatusFilter; range: RangeFilter }

export const DEFAULT_FILTERS: OrderFilters = { query: '', status: 'all', range: 'all' }

const DAY = 86_400_000

/**
 * Keeps the orders that match the search text, the status and the date range.
 * `today` is an ISO date such as "2026-11-18". "Last 7 days" includes today.
 */
export function filterOrders(
  orders: Order[],
  filters: OrderFilters,
  customerName: (customerId: string) => string,
  today: string,
): Order[] {
  const needle = filters.query.trim().toLowerCase()
  const cutoff =
    filters.range === 'all' ? null : Date.parse(today) - (Number(filters.range) - 1) * DAY

  return orders.filter((order) => {
    if (filters.status !== 'all' && order.status !== filters.status) return false
    if (cutoff !== null && Date.parse(order.date) < cutoff) return false
    if (needle && !`${order.id} ${customerName(order.customerId)}`.toLowerCase().includes(needle)) {
      return false
    }
    return true
  })
}
