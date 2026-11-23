import { describe, expect, it } from 'vitest'
import {
  RANGES,
  busiestSlot,
  changeBetween,
  funnelFor,
  reportFor,
  trafficSeries,
  visitHeat,
} from './analytics'
import { dailySeries, kpis } from './stats'

describe('analytics data', () => {
  it('has a visitor count for each of the 30 days, next to the real orders', () => {
    expect(trafficSeries).toHaveLength(30)
    expect(trafficSeries.every((point) => point.visits > 0)).toBe(true)
    expect(trafficSeries.map((point) => point.orders)).toEqual(dailySeries.map((day) => day.orders))
  })

  it('is repeatable: the same numbers every time', () => {
    expect(reportFor(30).stats).toEqual(reportFor(30).stats)
  })

  it('uses the real orders and revenue for the full range', () => {
    const { stats } = reportFor(30)
    expect(stats.orders).toBe(kpis.orders.total)
    expect(stats.revenue).toBeCloseTo(kpis.revenue.total, 3)
  })

  it('shorter ranges are part of the longer ones', () => {
    const week = reportFor(7).stats
    const month = reportFor(30).stats
    expect(week.visits).toBeLessThan(month.visits)
    expect(week.orders).toBeLessThanOrEqual(month.orders)
  })

  it('compares with the period before only when the data goes back that far', () => {
    expect(reportFor(7).previous).not.toBeNull()
    expect(reportFor(14).previous).not.toBeNull()
    expect(reportFor(30).previous).toBeNull()
  })

  it('works out the change between two numbers', () => {
    expect(changeBetween(110, 100)).toBeCloseTo(10)
    expect(changeBetween(90, 100)).toBeCloseTo(-10)
    expect(changeBetween(5, 0)).toBeNull()
    expect(changeBetween(5, undefined)).toBeNull()
  })
})

describe('shopping journey', () => {
  it('never grows from one step to the next, for every range', () => {
    for (const days of RANGES) {
      const counts = funnelFor(reportFor(days).points).map((step) => step.count)
      for (let i = 1; i < counts.length; i += 1) {
        expect(counts[i]).toBeLessThanOrEqual(counts[i - 1])
      }
    }
  })

  it('starts with all the visitors and ends with the real orders', () => {
    const { points, stats } = reportFor(30)
    const steps = funnelFor(points)
    expect(steps[0].count).toBe(stats.visits)
    expect(steps[steps.length - 1].count).toBe(stats.orders)
    expect(steps.map((step) => step.id)).toEqual([
      'visits',
      'views',
      'carts',
      'checkouts',
      'orders',
    ])
  })
})

describe('visitor heatmap', () => {
  it('has seven days of 24 hours', () => {
    expect(visitHeat).toHaveLength(7)
    expect(visitHeat.every((row) => row.length === 24)).toBe(true)
  })

  it('adds up to about the 30-day visitors', () => {
    const total = visitHeat.flat().reduce((sum, value) => sum + value, 0)
    expect(Math.abs(total - reportFor(30).stats.visits)).toBeLessThan(10)
  })

  it('is busier in the evening than at night, and busier on Saturday than on Tuesday', () => {
    const day = (row: number[]) => row.reduce((sum, value) => sum + value, 0)
    expect(visitHeat[5][20]).toBeGreaterThan(visitHeat[5][3])
    expect(day(visitHeat[5])).toBeGreaterThan(day(visitHeat[1]))
  })

  it('finds the busiest slot', () => {
    const best = busiestSlot(visitHeat)
    expect(best.visits).toBe(Math.max(...visitHeat.flat()))
    expect(visitHeat[best.dayIndex][best.hour]).toBe(best.visits)
  })
})
