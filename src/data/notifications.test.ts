import { describe, expect, it } from 'vitest'
import { orders } from '.'
import { customerRows } from './customerStats'
import { buildNotifications, notifications } from './notifications'

describe('notifications', () => {
  it('has a unique, repeatable id for each one', () => {
    expect(new Set(notifications.map((item) => item.id)).size).toBe(notifications.length)
    expect(buildNotifications().map((item) => item.id)).toEqual(
      notifications.map((item) => item.id),
    )
  })

  it('tells about new orders, and only new ones', () => {
    const fresh = orders.filter((order) => order.status === 'new').slice(0, 4)
    const found = notifications.filter((item) => item.kind === 'order')
    expect(found.map((item) => item.id)).toEqual(fresh.map((order) => `order-${order.id}`))
    expect(found.every((item) => item.to === '/orders')).toBe(true)
  })

  it('warns about stock, with products that are out before products that are running low', () => {
    const stock = notifications.filter((item) => item.kind === 'stock')
    expect(stock[0].title).toMatch(/out of stock/)
    expect(stock.length).toBeGreaterThan(1)
    expect(stock.every((item) => item.to === '/products')).toBe(true)
  })

  it('names customers who are at risk, and links to their profile', () => {
    const atRisk = customerRows.filter((row) => row.segment === 'at-risk')
    const found = notifications.filter((item) => item.kind === 'customer')
    expect(found.length).toBe(Math.min(3, atRisk.length))
    for (const item of found) {
      expect(item.to).toMatch(/^\/customers\/c-\d+$/)
      expect(atRisk.some((row) => item.title.startsWith(row.name))).toBe(true)
    }
  })

  it('lists the newest first and stays short', () => {
    const days = notifications.map((item) => item.daysAgo)
    expect([...days].sort((a, b) => a - b)).toEqual(days)
    expect(notifications.length).toBeLessThanOrEqual(10)
  })
})
