import { useState } from 'react'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Select, Textarea } from '../../components/ui/fields'
import { Drawer } from '../../components/ui/Overlays'
import { OrderStatusBadge } from '../../components/ui/OrderStatusBadge'
import { getCustomer, getProduct } from '../../data'
import type { Order, OrderStatus } from '../../data/types'
import { formatShortDate, formatTnd } from '../../lib/format'

const STATUSES: OrderStatus[] = ['new', 'packed', 'shipped', 'delivered', 'cancelled']

type OrderDrawerProps = {
  /** The order to show, or null to keep the drawer closed. */
  order: Order | null
  onClose: () => void
  onSave: (orderId: string, status: OrderStatus) => void
}

/** Shows one order and lets the shop change its status. */
export function OrderDrawer({ order, onClose, onSave }: OrderDrawerProps) {
  // The page gives this component a new key for each order, so the form starts fresh every time.
  const [status, setStatus] = useState<OrderStatus>(order?.status ?? 'new')
  const customer = order ? getCustomer(order.customerId) : undefined

  return (
    <Drawer
      open={order !== null}
      onClose={onClose}
      title={order ? `Order ${order.id}` : 'Order'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => order && onSave(order.id, status)}>Save changes</Button>
        </>
      }
    >
      {order && (
        <div className="grid gap-6">
          <div className="flex items-center gap-3">
            <Avatar name={customer?.name ?? 'Unknown customer'} />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{customer?.name ?? 'Unknown customer'}</p>
              <p className="truncate text-sm text-muted">
                {customer ? `${customer.email} · ${customer.city}` : ''}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold">Items</h3>
            <ul className="mt-2 divide-y divide-line text-sm">
              {order.items.map((item) => {
                const product = getProduct(item.productId)
                return (
                  <li key={item.productId} className="flex justify-between gap-4 py-2.5">
                    <span>
                      {item.quantity} × {product?.name ?? 'Unknown product'}
                    </span>
                    <span className="text-muted tabular-nums">
                      {formatTnd((product?.price ?? 0) * item.quantity)}
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="mt-2 flex justify-between border-t border-line pt-3 font-medium">
              <span>Total, placed on {formatShortDate(order.date)}</span>
              <span className="tabular-nums">{formatTnd(order.total)}</span>
            </p>
          </div>

          <Select
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value as OrderStatus)}
          >
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </Select>
          <Textarea label="Note for the team" placeholder="Anything the packer should know?" />
        </div>
      )}
    </Drawer>
  )
}
