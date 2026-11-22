import { customers, orders } from '.'
import type { Customer, CustomerSegment, Order } from './types'

const DAY = 86_400_000
const round3 = (value: number) => Math.round(value * 1000) / 1000

/** A customer who joined this many days ago or fewer counts as new. */
export const NEW_WITHIN_DAYS = 30
/** A customer with no order for this many days or more counts as at risk. */
export const AT_RISK_AFTER_DAYS = 10

// The sample data ends on this day, so "days ago" is counted back from it.
const TODAY = Date.parse(orders[0].date)

export const SEGMENT_LABEL: Record<CustomerSegment, string> = {
  new: 'New',
  loyal: 'Loyal',
  'at-risk': 'At risk',
}

export const SEGMENT_HELP: Record<CustomerSegment, string> = {
  new: `Joined in the last ${NEW_WITHIN_DAYS} days`,
  loyal: `Ordered in the last ${AT_RISK_AFTER_DAYS} days`,
  'at-risk': `No order for ${AT_RISK_AFTER_DAYS} days or more`,
}

export type CustomerStats = {
  /** Orders that were not cancelled. */
  orders: number
  spent: number
  average: number
  lastOrder: string | null
  daysSinceLastOrder: number | null
  segment: CustomerSegment
}

/** All orders of one customer, newest first, including cancelled ones. */
export function ordersOf(customerId: string): Order[] {
  return orders.filter((order) => order.customerId === customerId)
}

/** Totals for one customer, and the segment worked out from their history. */
export function statsFor(customer: Customer): CustomerStats {
  const active = ordersOf(customer.id).filter((order) => order.status !== 'cancelled')
  const spent = round3(active.reduce((sum, order) => sum + order.total, 0))
  const lastOrder = active[0]?.date ?? null
  const daysSinceLastOrder = lastOrder ? Math.round((TODAY - Date.parse(lastOrder)) / DAY) : null
  const joinedDaysAgo = Math.round((TODAY - Date.parse(customer.joined)) / DAY)

  let segment: CustomerSegment = 'loyal'
  if (joinedDaysAgo <= NEW_WITHIN_DAYS) segment = 'new'
  else if (daysSinceLastOrder === null || daysSinceLastOrder >= AT_RISK_AFTER_DAYS) {
    segment = 'at-risk'
  }

  return {
    orders: active.length,
    spent,
    average: active.length === 0 ? 0 : round3(spent / active.length),
    lastOrder,
    daysSinceLastOrder,
    segment,
  }
}

export type CustomerRow = Customer & CustomerStats

export const customerRows: CustomerRow[] = customers.map((customer) => ({
  ...customer,
  ...statsFor(customer),
}))
