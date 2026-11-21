import { lazy, Suspense } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Avatar } from '../components/ui/Avatar'
import { BentoGrid, BentoTile } from '../components/ui/Card'
import { OrderStatusBadge } from '../components/ui/OrderStatusBadge'
import { Skeleton } from '../components/ui/States'
import { dailySeries, kpis, recentOrders, salesByCategory, topProducts } from '../data/stats'
import { formatPercent, formatTnd } from '../lib/format'
import { SeasonCommandCenter } from './overview/SeasonCommandCenter'

// The chart library is large, so it loads in the background while the numbers appear first.
const RevenueChart = lazy(() =>
  import('../components/charts/charts').then((m) => ({ default: m.RevenueChart })),
)
const CategoryDonut = lazy(() =>
  import('../components/charts/charts').then((m) => ({ default: m.CategoryDonut })),
)
const Sparkline = lazy(() =>
  import('../components/charts/charts').then((m) => ({ default: m.Sparkline })),
)

const h2 = 'font-display text-xl font-bold'

type KpiTileProps = {
  label: string
  value: string
  change: number
  spark: number[]
}

function KpiTile({ label, value, change, spark }: KpiTileProps) {
  const up = change >= 0
  const Arrow = up ? ArrowUpRight : ArrowDownRight
  return (
    <BentoTile size="small">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold tabular-nums">{value}</p>
      <p className={`mt-1 flex items-center gap-1 text-sm ${up ? 'text-link' : 'text-hot'}`}>
        <Arrow size={16} aria-hidden="true" />
        <span>{formatPercent(change)}</span>
        <span className="text-muted">vs the 15 days before</span>
      </p>
      <div className="mt-3">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <Sparkline values={spark} label={`${label}, last 14 days`} />
        </Suspense>
      </div>
    </BentoTile>
  )
}

export default function Overview() {
  const bestRevenue = topProducts[0]?.revenue ?? 1

  return (
    <div>
      <h1 className="font-display text-4xl font-bold tracking-tight">Overview</h1>
      <p className="mt-2 max-w-xl text-muted">
        How the shop did over the last 30 days, and how close you are to the season goal.
      </p>

      <BentoGrid className="mt-8">
        <SeasonCommandCenter />

        <h2 className="sr-only md:col-span-6 lg:col-span-12">Key numbers</h2>
        <KpiTile
          label="Revenue"
          value={formatTnd(kpis.revenue.total)}
          change={kpis.revenue.change}
          spark={kpis.revenue.spark}
        />
        <KpiTile
          label="Orders"
          value={String(kpis.orders.total)}
          change={kpis.orders.change}
          spark={kpis.orders.spark}
        />
        <KpiTile
          label="Items sold"
          value={String(kpis.items.total)}
          change={kpis.items.change}
          spark={kpis.items.spark}
        />
        <KpiTile
          label="Average order"
          value={formatTnd(kpis.average.total)}
          change={kpis.average.change}
          spark={kpis.average.spark}
        />

        <BentoTile size="wide">
          <h2 className={h2}>Revenue</h2>
          <p className="mt-1 mb-4 text-sm text-muted">Per day, last 30 days</p>
          <Suspense fallback={<Skeleton className="h-72 w-full" />}>
            <RevenueChart data={dailySeries} />
          </Suspense>
        </BentoTile>

        <BentoTile size="medium">
          <h2 className={h2}>Sales by category</h2>
          <div className="mt-4">
            <Suspense fallback={<Skeleton className="h-72 w-full" />}>
              <CategoryDonut data={salesByCategory} />
            </Suspense>
          </div>
        </BentoTile>

        <BentoTile size="medium">
          <h2 className={h2}>Top products</h2>
          <ol className="mt-4 grid gap-4">
            {topProducts.map((product, index) => (
              <li key={product.id}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">
                    {index + 1}. {product.name}
                  </span>
                  <span className="text-muted tabular-nums">{formatTnd(product.revenue)}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-line" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-link"
                    style={{ width: `${(product.revenue / bestRevenue) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">{product.units} sold</p>
              </li>
            ))}
          </ol>
        </BentoTile>

        <BentoTile size="wide">
          <div className="flex items-center justify-between gap-4">
            <h2 className={h2}>Recent orders</h2>
            <Link to="/orders" className="text-sm text-link underline underline-offset-4">
              View all orders
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-sm">
              <caption className="sr-only">Recent orders</caption>
              <thead className="text-muted">
                <tr>
                  <th scope="col" className="py-2 pe-4 text-start font-medium">
                    Order
                  </th>
                  <th scope="col" className="px-4 py-2 text-start font-medium">
                    Customer
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-line">
                    <td className="py-3 pe-4 font-medium">{order.id}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-3">
                        <Avatar name={order.customerName} size="sm" />
                        {order.customerName}
                      </span>
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
        </BentoTile>
      </BentoGrid>
    </div>
  )
}
