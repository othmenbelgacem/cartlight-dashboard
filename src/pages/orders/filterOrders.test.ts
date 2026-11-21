import { describe, expect, it } from 'vitest'
import { getCustomer, orders } from '../../data'
import { DEFAULT_FILTERS, filterOrders } from './filterOrders'

const name = (id: string) => getCustomer(id)?.name ?? ''
const TODAY = orders[0].date

describe('filterOrders', () => {
  it('returns everything when no filter is set', () => {
    expect(filterOrders(orders, DEFAULT_FILTERS, name, TODAY)).toHaveLength(orders.length)
  })

  it('finds orders by customer name or order number, ignoring case', () => {
    const byName = filterOrders(orders, { ...DEFAULT_FILTERS, query: 'AMEL' }, name, TODAY)
    expect(byName.length).toBeGreaterThan(0)
    expect(byName.every((order) => name(order.customerId).includes('Amel'))).toBe(true)
    const byNumber = filterOrders(orders, { ...DEFAULT_FILTERS, query: '#1042' }, name, TODAY)
    expect(byNumber.map((order) => order.id)).toEqual(['#1042'])
  })

  it('filters by status', () => {
    const cancelled = filterOrders(orders, { ...DEFAULT_FILTERS, status: 'cancelled' }, name, TODAY)
    expect(cancelled.length).toBeGreaterThan(0)
    expect(cancelled.every((order) => order.status === 'cancelled')).toBe(true)
  })

  it('counts "last 7 days" back from today, including today', () => {
    const week = filterOrders(orders, { ...DEFAULT_FILTERS, range: '7' }, name, TODAY)
    const oldest = Date.parse(TODAY) - 6 * 86_400_000
    expect(week.length).toBeGreaterThan(0)
    expect(week.length).toBeLessThan(orders.length)
    expect(week.every((order) => Date.parse(order.date) >= oldest)).toBe(true)
  })

  it('combines all the filters', () => {
    const result = filterOrders(
      orders,
      { query: 'a', status: 'delivered', range: '30' },
      name,
      TODAY,
    )
    expect(result.every((order) => order.status === 'delivered')).toBe(true)
  })
})
