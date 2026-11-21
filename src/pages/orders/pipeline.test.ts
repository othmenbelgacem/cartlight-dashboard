import { describe, expect, it } from 'vitest'
import { orders } from '../../data'
import { PIPELINE_STATUSES, groupByStatus, isPipelineStatus } from './pipeline'

describe('pipeline columns', () => {
  const columns = groupByStatus(orders)

  it('has one column per step, in order', () => {
    expect(columns.map((column) => column.status)).toEqual([...PIPELINE_STATUSES])
  })

  it('puts every order that is not cancelled in exactly one column', () => {
    const inColumns = columns.reduce((sum, column) => sum + column.orders.length, 0)
    expect(inColumns).toBe(orders.filter((order) => order.status !== 'cancelled').length)
    for (const column of columns) {
      expect(column.orders.every((order) => order.status === column.status)).toBe(true)
    }
  })

  it('adds up the value of each column', () => {
    for (const column of columns) {
      const expected = column.orders.reduce((sum, order) => sum + order.total, 0)
      expect(column.total).toBeCloseTo(expected, 3)
    }
  })

  it('knows which statuses belong on the board', () => {
    expect(isPipelineStatus('packed')).toBe(true)
    expect(isPipelineStatus('cancelled')).toBe(false)
  })
})
