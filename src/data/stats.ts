import { getCustomer, getProduct, orders } from '.'
import type { Order } from './types'

const DAY = 86_400_000
const round3 = (value: number) => Math.round(value * 1000) / 1000
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)
const quantityOf = (order: Order) => sum(order.items.map((item) => item.quantity))

// Cancelled orders never count towards sales.
const active = orders.filter((order) => order.status !== 'cancelled')
const latestDate = orders[0].date

function shiftDate(iso: string, days: number) {
  return new Date(Date.parse(iso) + days * DAY).toISOString().slice(0, 10)
}

export type DailyPoint = { date: string; revenue: number; orders: number; items: number }

/** One point per day for the last 30 days. Days without orders are 0. */
export const dailySeries: DailyPoint[] = Array.from({ length: 30 }, (_, index) => {
  const date = shiftDate(latestDate, index - 29)
  const day = active.filter((order) => order.date === date)
  return {
    date,
    revenue: round3(sum(day.map((order) => order.total))),
    orders: day.length,
    items: sum(day.map(quantityOf)),
  }
})

const recentHalf = dailySeries.slice(15)
const priorHalf = dailySeries.slice(0, 15)

/** Percent change: the last 15 days compared with the 15 days before. */
function change(key: 'revenue' | 'orders' | 'items') {
  const prior = sum(priorHalf.map((point) => point[key]))
  return prior === 0 ? 0 : ((sum(recentHalf.map((point) => point[key])) - prior) / prior) * 100
}

function averageOrder(points: DailyPoint[]) {
  const count = sum(points.map((point) => point.orders))
  return count === 0 ? 0 : sum(points.map((point) => point.revenue)) / count
}

const lastTwoWeeks = (key: 'revenue' | 'orders' | 'items') =>
  dailySeries.slice(-14).map((point) => point[key])

const revenueTotal = round3(sum(active.map((order) => order.total)))

export const kpis = {
  revenue: { total: revenueTotal, change: change('revenue'), spark: lastTwoWeeks('revenue') },
  orders: { total: active.length, change: change('orders'), spark: lastTwoWeeks('orders') },
  items: {
    total: sum(active.map(quantityOf)),
    change: change('items'),
    spark: lastTwoWeeks('items'),
  },
  average: {
    total: round3(revenueTotal / active.length),
    change:
      averageOrder(priorHalf) === 0
        ? 0
        : ((averageOrder(recentHalf) - averageOrder(priorHalf)) / averageOrder(priorHalf)) * 100,
    // The totals of the 14 newest orders, oldest first.
    spark: active
      .slice(0, 14)
      .reverse()
      .map((order) => order.total),
  },
}

export type CategorySales = { name: string; value: number }

export const salesByCategory: CategorySales[] = (() => {
  const totals = new Map<string, number>()
  for (const order of active) {
    for (const item of order.items) {
      const product = getProduct(item.productId)
      if (product) {
        totals.set(
          product.category,
          (totals.get(product.category) ?? 0) + product.price * item.quantity,
        )
      }
    }
  }
  return [...totals]
    .map(([name, value]) => ({ name, value: round3(value) }))
    .sort((a, b) => b.value - a.value)
})()

export type TopProduct = { id: string; name: string; units: number; revenue: number }

export const topProducts: TopProduct[] = (() => {
  const totals = new Map<string, TopProduct>()
  for (const order of active) {
    for (const item of order.items) {
      const product = getProduct(item.productId)
      if (!product) continue
      const entry = totals.get(product.id) ?? {
        id: product.id,
        name: product.name,
        units: 0,
        revenue: 0,
      }
      entry.units += item.quantity
      entry.revenue = round3(entry.revenue + product.price * item.quantity)
      totals.set(product.id, entry)
    }
  }
  return [...totals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
})()

export const recentOrders = orders.slice(0, 5).map((order) => ({
  ...order,
  customerName: getCustomer(order.customerId)?.name ?? 'Unknown customer',
}))

/** The goal for the Christmas sales season, in TND. */
export const SEASON_GOAL = 3500

export const season = {
  goal: SEASON_GOAL,
  sold: revenueTotal,
  percent: Math.min(100, Math.round((revenueTotal / SEASON_GOAL) * 100)),
  bestDay: dailySeries.reduce((best, point) => (point.revenue > best.revenue ? point : best)),
}
