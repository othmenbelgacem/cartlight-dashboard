import { describe, expect, it } from 'vitest'
import { orders } from '.'
import { dailySeries, kpis, recentOrders, salesByCategory, season, topProducts } from './stats'

describe('dashboard numbers', () => {
  const sold = orders.filter((order) => order.status !== 'cancelled')

  it('covers 30 days and adds up to the revenue number', () => {
    expect(dailySeries).toHaveLength(30)
    const total = dailySeries.reduce((sum, day) => sum + day.revenue, 0)
    expect(total).toBeCloseTo(kpis.revenue.total, 3)
    expect(kpis.orders.total).toBe(sold.length)
  })

  it('does not count cancelled orders', () => {
    const everything = orders.reduce((sum, order) => sum + order.total, 0)
    expect(kpis.revenue.total).toBeLessThan(everything)
  })

  it('splits sales by category without losing money', () => {
    const total = salesByCategory.reduce((sum, item) => sum + item.value, 0)
    expect(total).toBeCloseTo(kpis.revenue.total, 3)
  })

  it('ranks the top five products by revenue', () => {
    expect(topProducts).toHaveLength(5)
    const revenues = topProducts.map((product) => product.revenue)
    expect([...revenues].sort((a, b) => b - a)).toEqual(revenues)
  })

  it('shows season progress as a percent between 0 and 100', () => {
    expect(season.percent).toBeGreaterThan(0)
    expect(season.percent).toBeLessThanOrEqual(100)
    expect(season.bestDay.revenue).toBe(Math.max(...dailySeries.map((day) => day.revenue)))
  })

  it('lists the five newest orders with customer names', () => {
    expect(recentOrders.map((order) => order.id)).toEqual(orders.slice(0, 5).map((o) => o.id))
    expect(recentOrders.every((order) => order.customerName !== 'Unknown customer')).toBe(true)
  })
})
