import { lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router'
import { BentoGrid, BentoTile } from '../components/ui/Card'
import { Skeleton } from '../components/ui/States'
import {
  RANGES,
  WEEKDAY_NAMES,
  busiestSlot,
  changeBetween,
  funnelFor,
  reportFor,
  visitHeat,
  type RangeDays,
} from '../data/analytics'
import { formatCount, formatPercent, formatRate, formatTnd } from '../lib/format'
import { Funnel } from './analytics/Funnel'
import { Heatmap } from './analytics/Heatmap'

// The chart library is large, so it loads in the background while the numbers appear first.
const TrafficChart = lazy(() =>
  import('../components/charts/charts').then((m) => ({ default: m.TrafficChart })),
)

const h2 = 'font-display text-xl font-bold'

function StatTile({
  label,
  value,
  change,
}: {
  label: string
  value: string
  change: number | null
}) {
  return (
    <BentoTile size="small">
      <dl>
        <dt className="text-sm text-muted">{label}</dt>
        <dd className="mt-1 font-display text-3xl font-bold tabular-nums">{value}</dd>
        <dd
          className={`mt-1 text-sm ${change === null ? 'text-muted' : change >= 0 ? 'text-link' : 'text-hot'}`}
        >
          {change === null
            ? 'No earlier period to compare'
            : `${formatPercent(change)} vs the period before`}
        </dd>
      </dl>
    </BentoTile>
  )
}

export default function Analytics() {
  const [params, setParams] = useSearchParams()
  const requested = Number(params.get('range'))
  const range = (RANGES as number[]).includes(requested) ? (requested as RangeDays) : 30

  const { points, stats, previous } = reportFor(range)
  const funnel = funnelFor(points)
  const busiest = busiestSlot(visitHeat)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-2 max-w-xl text-muted">
            Who visits the shop, what they do, and when they come.
          </p>
        </div>
        <div
          role="group"
          aria-label="Date range"
          className="flex rounded-full border border-line bg-surface p-0.5"
        >
          {RANGES.map((days) => (
            <button
              key={days}
              type="button"
              aria-pressed={range === days}
              onClick={() =>
                setParams(days === 30 ? {} : { range: String(days) }, { replace: true })
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                range === days ? 'bg-accent text-on-accent' : 'text-muted hover:text-fg'
              }`}
            >
              Last {days} days
            </button>
          ))}
        </div>
      </div>

      <BentoGrid className="mt-8">
        <h2 className="sr-only md:col-span-6 lg:col-span-12">Key numbers</h2>
        <StatTile
          label="Visitors"
          value={formatCount(stats.visits)}
          change={changeBetween(stats.visits, previous?.visits)}
        />
        <StatTile
          label="Conversion rate"
          value={formatRate(stats.conversion)}
          change={changeBetween(stats.conversion, previous?.conversion)}
        />
        <StatTile
          label="Orders"
          value={formatCount(stats.orders)}
          change={changeBetween(stats.orders, previous?.orders)}
        />
        <StatTile
          label="Revenue"
          value={formatTnd(stats.revenue)}
          change={changeBetween(stats.revenue, previous?.revenue)}
        />

        <BentoTile size="wide">
          <h2 className={h2}>Visitors</h2>
          <p className="mt-1 mb-4 text-sm text-muted">Per day, last {range} days</p>
          <Suspense fallback={<Skeleton className="h-72 w-full" />}>
            <TrafficChart data={points} label={`Daily visitors for the last ${range} days`} />
          </Suspense>
        </BentoTile>

        <BentoTile size="medium">
          <h2 className={h2}>Shopping journey</h2>
          <p className="mt-1 mb-4 text-sm text-muted">From visit to order, last {range} days</p>
          <Funnel steps={funnel} />
        </BentoTile>

        <BentoTile size="full">
          <h2 className={h2}>When visitors come</h2>
          <p className="mt-1 mb-4 text-sm text-muted">
            The busiest time is {WEEKDAY_NAMES[busiest.dayIndex]} at {busiest.hour}:00, with{' '}
            {formatCount(busiest.visits)} visitors in the last 30 days. This chart always covers the
            last 30 days.
          </p>
          <Heatmap heat={visitHeat} />
        </BentoTile>
      </BentoGrid>
    </div>
  )
}
