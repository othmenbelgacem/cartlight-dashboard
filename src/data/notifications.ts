import { getCustomer, orders, products } from '.'
import { customerRows } from './customerStats'
import { season } from './stats'
import { stockLevel } from '../pages/products/stock'
import { formatCount, formatTnd } from '../lib/format'

export type NotificationKind = 'order' | 'stock' | 'customer' | 'season'

export type AppNotification = {
  /** Stays the same every time, so "read" can be remembered. */
  id: string
  kind: NotificationKind
  title: string
  detail: string
  /** How many days before the sample data's last day this happened. */
  daysAgo: number
  /** The page that explains it. */
  to: string
}

const DAY = 86_400_000
const TODAY = Date.parse(orders[0].date)
const MAX_ITEMS = 10

/** Works out what the shop owner should hear about, from the sample data. */
export function buildNotifications(): AppNotification[] {
  const items: AppNotification[] = []

  for (const order of orders.filter((candidate) => candidate.status === 'new').slice(0, 4)) {
    const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0)
    items.push({
      id: `order-${order.id}`,
      kind: 'order',
      title: `New order ${order.id} from ${getCustomer(order.customerId)?.name ?? 'a customer'}`,
      detail: `${formatTnd(order.total)}, ${formatCount(quantity)} item${quantity === 1 ? '' : 's'}`,
      daysAgo: Math.round((TODAY - Date.parse(order.date)) / DAY),
      to: '/orders',
    })
  }

  // Emptiest first, so an item that is out of stock comes before one that is only running low.
  for (const product of [...products].sort((a, b) => a.stock - b.stock)) {
    const level = stockLevel(product.stock)
    if (level === 'ok' || product.status === 'archived') continue
    items.push({
      id: `stock-${product.id}`,
      kind: 'stock',
      title: level === 'out' ? `${product.name} is out of stock` : `${product.name} is running low`,
      detail:
        level === 'out' ? 'Customers cannot order it right now.' : `Only ${product.stock} left.`,
      daysAgo: 0,
      to: '/products',
    })
  }

  for (const row of customerRows
    .filter((candidate) => candidate.segment === 'at-risk')
    .slice(0, 3)) {
    items.push({
      id: `customer-${row.id}`,
      kind: 'customer',
      title: `${row.name} has not ordered for ${row.daysSinceLastOrder ?? 'many'} days`,
      detail: `They have spent ${formatTnd(row.spent)} so far.`,
      daysAgo: 0,
      to: `/customers/${row.id}`,
    })
  }

  if (season.percent >= 50) {
    items.push({
      id: 'season-goal',
      kind: 'season',
      title: `Christmas goal: ${season.percent}% reached`,
      detail: `${formatTnd(season.sold)} of ${formatTnd(season.goal)} sold.`,
      daysAgo: 0,
      to: '/',
    })
  }

  // Newest first. Items from the same day keep the order above.
  return items.sort((a, b) => a.daysAgo - b.daysAgo).slice(0, MAX_ITEMS)
}

export const notifications: AppNotification[] = buildNotifications()
