import { describe, expect, it } from 'vitest'
import { customers, getCustomer, getProduct, orders, products } from '.'

describe('sample data', () => {
  it('has unique ids', () => {
    for (const list of [products, customers, orders]) {
      expect(new Set(list.map((item) => item.id)).size).toBe(list.length)
    }
  })

  it('links every order to a real customer and real products', () => {
    for (const order of orders) {
      expect(getCustomer(order.customerId), order.id).toBeDefined()
      for (const item of order.items) {
        expect(getProduct(item.productId), `${order.id} ${item.productId}`).toBeDefined()
        expect(item.quantity).toBeGreaterThan(0)
      }
    }
  })

  it('calculates order totals from product prices', () => {
    for (const order of orders) {
      const expected = order.items.reduce(
        (sum, item) => sum + (getProduct(item.productId)?.price ?? 0) * item.quantity,
        0,
      )
      expect(order.total).toBeCloseTo(expected, 3)
      expect(order.total).toBeGreaterThan(0)
    }
  })

  it('covers every order status and customer segment', () => {
    expect(new Set(orders.map((order) => order.status))).toEqual(
      new Set(['new', 'packed', 'shipped', 'delivered', 'cancelled']),
    )
    expect(new Set(customers.map((customer) => customer.segment))).toEqual(
      new Set(['new', 'loyal', 'at-risk']),
    )
  })

  it('lists orders newest first', () => {
    const dates = orders.map((order) => order.date)
    expect([...dates].sort().reverse()).toEqual(dates)
  })
})
