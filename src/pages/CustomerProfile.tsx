import { ArrowLeft, Package } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Avatar } from '../components/ui/Avatar'
import { BentoGrid, BentoTile } from '../components/ui/Card'
import { OrderStatusBadge } from '../components/ui/OrderStatusBadge'
import { EmptyState } from '../components/ui/States'
import { SEGMENT_HELP, ordersOf, statsFor } from '../data/customerStats'
import { getCustomer } from '../data'
import { formatLongDate, formatShortDate, formatTnd } from '../lib/format'
import { SegmentBadge } from './customers/SegmentBadge'

const h2 = 'font-display text-xl font-bold'

function daysAgo(days: number | null) {
  if (days === null) return 'No orders yet'
  if (days === 0) return 'Today'
  return `${days} day${days === 1 ? '' : 's'} ago`
}

const backLink = (
  <Link
    to="/customers"
    className="inline-flex items-center gap-2 text-sm text-link underline underline-offset-4"
  >
    <ArrowLeft size={16} className="rtl:-scale-x-100" />
    All customers
  </Link>
)

export default function CustomerProfile() {
  const { id = '' } = useParams()
  const customer = getCustomer(id)

  if (!customer) {
    return (
      <section>
        {backLink}
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">Customer not found</h1>
        <p className="mt-2 max-w-xl text-muted">
          There is no customer with this address. Go back to the list and pick someone from there.
        </p>
      </section>
    )
  }

  const stats = statsFor(customer)
  const history = ordersOf(customer.id)

  return (
    <div>
      {backLink}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Avatar name={customer.name} size="lg" />
        <div className="min-w-0">
          <h1 className="font-display text-4xl font-bold tracking-tight">{customer.name}</h1>
          <p className="mt-1 text-muted">
            {customer.email} · {customer.city} · Customer since {formatLongDate(customer.joined)}
          </p>
        </div>
        <div className="ms-auto text-end">
          <SegmentBadge segment={stats.segment} />
          <p className="mt-1 text-sm text-muted">{SEGMENT_HELP[stats.segment]}</p>
        </div>
      </div>

      <BentoGrid className="mt-8">
        <h2 className="sr-only md:col-span-6 lg:col-span-12">Key numbers</h2>
        <BentoTile size="small">
          <dl>
            <dt className="text-sm text-muted">Total spent</dt>
            <dd className="mt-1 font-display text-2xl font-bold tabular-nums">
              {formatTnd(stats.spent)}
            </dd>
          </dl>
        </BentoTile>
        <BentoTile size="small">
          <dl>
            <dt className="text-sm text-muted">Orders</dt>
            <dd className="mt-1 font-display text-2xl font-bold tabular-nums">{stats.orders}</dd>
          </dl>
        </BentoTile>
        <BentoTile size="small">
          <dl>
            <dt className="text-sm text-muted">Average order</dt>
            <dd className="mt-1 font-display text-2xl font-bold tabular-nums">
              {formatTnd(stats.average)}
            </dd>
          </dl>
        </BentoTile>
        <BentoTile size="small">
          <dl>
            <dt className="text-sm text-muted">Last order</dt>
            <dd className="mt-1 font-display text-2xl font-bold">
              {daysAgo(stats.daysSinceLastOrder)}
              {stats.lastOrder && (
                <span className="block font-sans text-xs font-normal text-muted">
                  {formatShortDate(stats.lastOrder)}
                </span>
              )}
            </dd>
          </dl>
        </BentoTile>

        <BentoTile size="full">
          <h2 className={h2}>Order history</h2>
          {history.length === 0 ? (
            <EmptyState
              icon={<Package size={24} />}
              title="No orders yet"
              description="Orders from this customer will show up here."
            />
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[30rem] border-collapse text-sm">
                <caption className="sr-only">Orders by {customer.name}</caption>
                <thead className="text-muted">
                  <tr>
                    <th scope="col" className="py-2 pe-4 text-start font-medium">
                      Order
                    </th>
                    <th scope="col" className="px-4 py-2 text-start font-medium">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-2 text-end font-medium">
                      Items
                    </th>
                    <th scope="col" className="px-4 py-2 text-start font-medium">
                      Status
                    </th>
                    <th scope="col" className="py-2 ps-4 text-end font-medium">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((order) => (
                    <tr key={order.id} className="border-t border-line">
                      <td className="py-3 pe-4 font-medium">{order.id}</td>
                      <td className="px-4 py-3">{formatShortDate(order.date)}</td>
                      <td className="px-4 py-3 text-end tabular-nums">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-3 ps-4 text-end tabular-nums">{formatTnd(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </BentoTile>
      </BentoGrid>
    </div>
  )
}
