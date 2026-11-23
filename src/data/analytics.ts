import { dailySeries, type DailyPoint } from './stats'

// Visitors are made-up numbers (there is no real website behind the sample shop).
// They are repeatable, with more visitors at the weekend and a slow climb towards Christmas.
const BASE_VISITS = 34
const WEEKDAY_FACTOR = [1.15, 0.95, 0.9, 0.95, 1.0, 1.1, 1.25] // Sunday first, as JavaScript counts

function hash(text: string) {
  let value = 0
  for (const character of text) value = (value * 31 + (character.codePointAt(0) ?? 0)) >>> 0
  return value
}

export type TrafficPoint = DailyPoint & { visits: number }

/** The last 30 days: real orders and revenue, plus made-up visitors. */
export const trafficSeries: TrafficPoint[] = dailySeries.map((point, index) => {
  const weekday = new Date(`${point.date}T00:00:00Z`).getUTCDay()
  const noise = (hash(point.date) % 17) - 8 // between -8 and +8 percent
  const visits = BASE_VISITS * WEEKDAY_FACTOR[weekday] * (1 + index * 0.008) * (1 + noise / 100)
  return { ...point, visits: Math.round(visits) }
})

export type RangeDays = 7 | 14 | 30
export const RANGES: RangeDays[] = [7, 14, 30]

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

export type RangeStats = {
  visits: number
  orders: number
  revenue: number
  /** Orders as a percent of visitors. */
  conversion: number
}

function statsOf(points: TrafficPoint[]): RangeStats {
  const visits = sum(points.map((point) => point.visits))
  const orders = sum(points.map((point) => point.orders))
  return {
    visits,
    orders,
    revenue: Math.round(sum(points.map((point) => point.revenue)) * 1000) / 1000,
    conversion: visits === 0 ? 0 : (orders / visits) * 100,
  }
}

export type RangeReport = {
  points: TrafficPoint[]
  stats: RangeStats
  /** The period of the same length just before, or null when the sample data does not go back that far. */
  previous: RangeStats | null
}

export function reportFor(days: RangeDays): RangeReport {
  const points = trafficSeries.slice(-days)
  const earlier = trafficSeries.slice(-2 * days, -days)
  return {
    points,
    stats: statsOf(points),
    previous: earlier.length === days ? statsOf(earlier) : null,
  }
}

/** Percent change from `before` to `now`, or null when there is nothing to compare with. */
export function changeBetween(now: number, before: number | undefined): number | null {
  if (before === undefined || before === 0) return null
  return ((now - before) / before) * 100
}

// Of 100 visitors, about this many do each next step. The last step is real: the orders.
export const FUNNEL_RATES = { views: 0.52, carts: 0.24, checkouts: 0.42 }

export type FunnelStep = { id: string; label: string; count: number }

/** Visitors, product views, carts, checkouts and orders for a period. */
export function funnelFor(points: TrafficPoint[]): FunnelStep[] {
  const visits = sum(points.map((point) => point.visits))
  const views = Math.round(visits * FUNNEL_RATES.views)
  const carts = Math.round(views * FUNNEL_RATES.carts)
  const checkouts = Math.round(carts * FUNNEL_RATES.checkouts)
  const orders = Math.min(sum(points.map((point) => point.orders)), checkouts)
  return [
    { id: 'visits', label: 'Visitors', count: visits },
    { id: 'views', label: 'Viewed a product', count: views },
    { id: 'carts', label: 'Added to cart', count: carts },
    { id: 'checkouts', label: 'Started checkout', count: checkouts },
    { id: 'orders', label: 'Placed an order', count: orders },
  ]
}

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
export const WEEKDAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

// How busy each hour is (0 to 23) and how busy each day is (Monday first).
const HOUR_PROFILE = [
  2, 1, 1, 1, 1, 2, 4, 7, 10, 12, 13, 14, 16, 15, 13, 12, 13, 15, 18, 22, 24, 20, 12, 5,
]
const DAY_PROFILE = [0.92, 0.88, 0.9, 1, 1.12, 1.32, 1.2]

/** Visits for each weekday (Monday first) and hour over the last 30 days. They add up to the 30-day visits. */
export const visitHeat: number[][] = (() => {
  const raw = DAY_PROFILE.map((day) => HOUR_PROFILE.map((hour) => day * hour))
  const total = sum(trafficSeries.map((point) => point.visits))
  const scale = total / sum(raw.map(sum))
  return raw.map((row) => row.map((value) => Math.round(value * scale)))
})()

export type BusiestSlot = { dayIndex: number; hour: number; visits: number }

export function busiestSlot(heat: number[][]): BusiestSlot {
  let best: BusiestSlot = { dayIndex: 0, hour: 0, visits: -1 }
  heat.forEach((row, dayIndex) =>
    row.forEach((visits, hour) => {
      if (visits > best.visits) best = { dayIndex, hour, visits }
    }),
  )
  return best
}
