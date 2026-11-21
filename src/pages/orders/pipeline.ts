import type { Order, OrderStatus } from '../../data/types'

/** The board columns, from first to last step. Cancelled orders are not on the board. */
export const PIPELINE_STATUSES = [
  'new',
  'packed',
  'shipped',
  'delivered',
] as const satisfies readonly OrderStatus[]

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number]

export type PipelineColumn = { status: PipelineStatus; orders: Order[]; total: number }

export function isPipelineStatus(value: string): value is PipelineStatus {
  return (PIPELINE_STATUSES as readonly string[]).includes(value)
}

export function statusLabel(status: OrderStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

/** Sorts orders into the board columns and adds up each column's value. */
export function groupByStatus(orders: Order[]): PipelineColumn[] {
  return PIPELINE_STATUSES.map((status) => {
    const inColumn = orders.filter((order) => order.status === status)
    const total = inColumn.reduce((sum, order) => sum + order.total, 0)
    return { status, orders: inColumn, total: Math.round(total * 1000) / 1000 }
  })
}
