import { describe, expect, it } from 'vitest'
import { orders } from '.'
import {
  AT_RISK_AFTER_DAYS,
  NEW_WITHIN_DAYS,
  customerRows,
  ordersOf,
  statsFor,
} from './customerStats'
import { kpis } from './stats'

describe('customer numbers', () => {
  it('adds up to the shop revenue', () => {
    const total = customerRows.reduce((sum, row) => sum + row.spent, 0)
    expect(total).toBeCloseTo(kpis.revenue.total, 3)
  })

  it('does not count cancelled orders in the totals but keeps them in the history', () => {
    const withCancelled = customerRows.find((row) =>
      ordersOf(row.id).some((order) => order.status === 'cancelled'),
    )!
    expect(ordersOf(withCancelled.id).length).toBeGreaterThan(withCancelled.orders)
    expect(statsFor(withCancelled).orders).toBe(withCancelled.orders)
  })

  it('gives every order to exactly one customer', () => {
    const total = customerRows.reduce((sum, row) => sum + ordersOf(row.id).length, 0)
    expect(total).toBe(orders.length)
  })

  it('works out segments from the history, using the written rules', () => {
    for (const row of customerRows) {
      const joinedDays = Math.round(
        (Date.parse(orders[0].date) - Date.parse(row.joined)) / 86_400_000,
      )
      if (joinedDays <= NEW_WITHIN_DAYS) {
        expect(row.segment, row.name).toBe('new')
      } else if ((row.daysSinceLastOrder ?? Infinity) >= AT_RISK_AFTER_DAYS) {
        expect(row.segment, row.name).toBe('at-risk')
      } else {
        expect(row.segment, row.name).toBe('loyal')
      }
    }
  })

  it('uses all three segments in the sample data', () => {
    expect(new Set(customerRows.map((row) => row.segment))).toEqual(
      new Set(['new', 'loyal', 'at-risk']),
    )
  })
})
