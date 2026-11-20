import { customers } from './customers'
import { products } from './products'
import type { Order, OrderItem, OrderStatus } from './types'

const DAY = 86_400_000
// A fixed "today", so the sample data never changes and tests stay stable.
const TODAY = Date.UTC(2026, 10, 18)

function isoDate(daysAgo: number) {
  return new Date(TODAY - daysAgo * DAY).toISOString().slice(0, 10)
}

function statusFor(daysAgo: number, index: number): OrderStatus {
  if (index % 9 === 8) return 'cancelled'
  if (daysAgo < 2) return 'new'
  if (daysAgo < 4) return 'packed'
  if (daysAgo < 7) return 'shipped'
  return 'delivered'
}

function itemsFor(index: number): OrderItem[] {
  const items: OrderItem[] = [
    { productId: products[(index * 7) % products.length].id, quantity: 1 + (index % 3) },
  ]
  if (index % 2 === 0) {
    items.push({ productId: products[(index * 3 + 1) % products.length].id, quantity: 1 })
  }
  return items
}

function totalOf(items: OrderItem[]) {
  const sum = items.reduce((total, item) => {
    const product = products.find((candidate) => candidate.id === item.productId)
    return total + (product ? product.price * item.quantity : 0)
  }, 0)
  return Math.round(sum * 1000) / 1000
}

/** 24 orders over the last 30 days, newest first. Order numbers start at #1042. */
export const orders: Order[] = Array.from({ length: 24 }, (_, index) => {
  const daysAgo = Math.floor(index * 1.25)
  const items = itemsFor(index)
  return {
    id: `#${1042 - index}`,
    customerId: customers[(index * 5 + 3) % customers.length].id,
    items,
    status: statusFor(daysAgo, index),
    date: isoDate(daysAgo),
    total: totalOf(items),
  }
})
