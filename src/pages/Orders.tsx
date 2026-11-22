import { useState } from 'react'
import { Kanban, List, SearchX } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DataTable, type Column } from '../components/ui/DataTable'
import { Input, Select } from '../components/ui/fields'
import { OrderStatusBadge } from '../components/ui/OrderStatusBadge'
import { EmptyState } from '../components/ui/States'
import { useToast } from '../components/ui/toast-context'
import { getCustomer, orders as seedOrders } from '../data'
import type { Order, OrderStatus } from '../data/types'
import { formatShortDate, formatTnd } from '../lib/format'
import { OrderDrawer } from './orders/OrderDrawer'
import { PipelineBoard } from './orders/PipelineBoard'
import {
  DEFAULT_FILTERS,
  filterOrders,
  type OrderFilters,
  type RangeFilter,
  type StatusFilter,
} from './orders/filterOrders'
import { statusLabel } from './orders/pipeline'

// The sample data ends on this day, so "last 7 days" is counted back from it.
const TODAY = seedOrders[0].date
const customerName = (customerId: string) => getCustomer(customerId)?.name ?? 'Unknown customer'

const VIEWS = [
  { id: 'list', label: 'List', Icon: List },
  { id: 'board', label: 'Board', Icon: Kanban },
] as const

export default function Orders() {
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const view = params.get('view') === 'board' ? 'board' : 'list'
  const [orders, setOrders] = useState<Order[]>(seedOrders)
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS)
  const [openId, setOpenId] = useState<string | null>(null)

  const visible = filterOrders(orders, filters, customerName, TODAY)
  const openOrder = orders.find((order) => order.id === openId) ?? null
  const filtersActive = filters.query !== '' || filters.status !== 'all' || filters.range !== 'all'

  function setStatus(ids: string[], status: OrderStatus) {
    setOrders((list) =>
      list.map((order) => (ids.includes(order.id) ? { ...order, status } : order)),
    )
  }

  function moveOrder(id: string, status: OrderStatus) {
    const order = orders.find((candidate) => candidate.id === id)
    if (!order || order.status === status) return
    setStatus([id], status)
    toast({ title: `Order ${id} moved to ${statusLabel(status)}` })
  }

  function markAll(ids: string[], status: OrderStatus, clear: () => void) {
    setStatus(ids, status)
    clear()
    toast({ title: `${ids.length} order${ids.length === 1 ? '' : 's'} marked as ${status}` })
  }

  const columns: Column<Order>[] = [
    {
      id: 'id',
      header: 'Order',
      cell: (order) => <span className="font-medium">{order.id}</span>,
      sortBy: (order) => order.id,
    },
    {
      id: 'customer',
      header: 'Customer',
      cell: (order) => (
        <span className="flex items-center gap-3">
          <Avatar name={customerName(order.customerId)} size="sm" />
          {customerName(order.customerId)}
        </span>
      ),
      sortBy: (order) => customerName(order.customerId),
    },
    {
      id: 'date',
      header: 'Date',
      cell: (order) => formatShortDate(order.date),
      sortBy: (order) => order.date,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (order) => <OrderStatusBadge status={order.status} />,
      sortBy: (order) => order.status,
    },
    {
      id: 'items',
      header: 'Items',
      cell: (order) => order.items.reduce((sum, item) => sum + item.quantity, 0),
      sortBy: (order) => order.items.reduce((sum, item) => sum + item.quantity, 0),
      numeric: true,
    },
    {
      id: 'total',
      header: 'Total',
      cell: (order) => formatTnd(order.total),
      sortBy: (order) => order.total,
      numeric: true,
    },
    {
      id: 'details',
      header: 'Details',
      cell: (order) => (
        <Button
          variant="ghost"
          size="sm"
          aria-label={`View order ${order.id}`}
          onClick={() => setOpenId(order.id)}
        >
          View
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Orders</h1>
          <p className="mt-2 max-w-xl text-muted">
            Search, filter and update orders. Use the board to move them along the pipeline.
          </p>
        </div>
        <div
          role="group"
          aria-label="View"
          className="flex rounded-full border border-line bg-surface p-0.5"
        >
          {VIEWS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setParams(id === 'board' ? { view: 'board' } : {}, { replace: true })}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                view === id ? 'bg-accent text-on-accent' : 'text-muted hover:text-fg'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <Card className="mt-8">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
          <Input
            label="Search orders"
            type="search"
            placeholder="Order number or customer"
            value={filters.query}
            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
          />
          <Select
            label="Status"
            value={filters.status}
            onChange={(event) =>
              setFilters({ ...filters, status: event.target.value as StatusFilter })
            }
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Select
            label="Date"
            value={filters.range}
            onChange={(event) =>
              setFilters({ ...filters, range: event.target.value as RangeFilter })
            }
          >
            <option value="all">All time</option>
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </Select>
          <Button
            variant="ghost"
            disabled={!filtersActive}
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            Clear filters
          </Button>
        </div>

        <div className="mt-6">
          {view === 'board' ? (
            <>
              <p className="mb-4 text-sm text-muted">
                Drag a card to another column, or use the ⋯ menu on a card. Cancelled orders are not
                shown here.
              </p>
              <PipelineBoard orders={visible} onMove={moveOrder} onOpen={setOpenId} />
            </>
          ) : (
            <DataTable
              caption="Orders"
              columns={columns}
              rows={visible}
              getRowId={(order) => order.id}
              getRowLabel={(order) => `order ${order.id}`}
              pageSize={10}
              selectable
              selectionHint="Tick rows to update several orders together."
              bulkActions={(ids, clear) => (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => markAll(ids, 'packed', clear)}
                  >
                    Mark as packed
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => markAll(ids, 'shipped', clear)}
                  >
                    Mark as shipped
                  </Button>
                </>
              )}
              empty={
                <EmptyState
                  icon={<SearchX size={24} />}
                  headingLevel={2}
                  title="No orders match"
                  description="Try a different search, or clear the filters."
                  action={
                    <Button variant="secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>
                      Clear filters
                    </Button>
                  }
                />
              }
            />
          )}
        </div>
      </Card>

      <OrderDrawer
        key={openOrder?.id ?? 'closed'}
        order={openOrder}
        onClose={() => setOpenId(null)}
        onSave={(id, status) => {
          setStatus([id], status)
          setOpenId(null)
          toast({ title: `Order ${id} updated`, description: `Status is now ${status}.` })
        }}
      />
    </div>
  )
}
