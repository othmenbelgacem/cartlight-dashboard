import { useState } from 'react'
import { SearchX } from 'lucide-react'
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
import {
  DEFAULT_FILTERS,
  filterOrders,
  type OrderFilters,
  type RangeFilter,
  type StatusFilter,
} from './orders/filterOrders'

// The sample data ends on this day, so "last 7 days" is counted back from it.
const TODAY = seedOrders[0].date
const customerName = (customerId: string) => getCustomer(customerId)?.name ?? 'Unknown customer'

export default function Orders() {
  const toast = useToast()
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
      <h1 className="font-display text-4xl font-bold tracking-tight">Orders</h1>
      <p className="mt-2 max-w-xl text-muted">
        Search, filter and update orders. Select several rows to change their status together.
      </p>

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
          <DataTable
            caption="Orders"
            columns={columns}
            rows={visible}
            getRowId={(order) => order.id}
            getRowLabel={(order) => `order ${order.id}`}
            pageSize={10}
            selectable
            bulkActions={(ids, clear) => (
              <>
                <Button size="sm" variant="secondary" onClick={() => markAll(ids, 'packed', clear)}>
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
