import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { type CategorySales, type DailyPoint } from '../../data/stats'
import { formatCount, formatShortDate, formatTnd } from '../../lib/format'
import { prefersReducedMotion } from '../../lib/motion'
import { useDirection } from '../../lib/useDirection'

// Colours come from the theme variables, so every chart follows the active theme.
const AXIS_TICK = { fill: 'var(--muted)', fontSize: 12 }
const SLICE_COLOURS = ['var(--accent)', 'var(--link)', 'var(--hot)', 'var(--fg)', 'var(--control)']

type TooltipProps = {
  active?: boolean
  payload?: ReadonlyArray<{ value?: number | string }>
  label?: string | number
  format: (value: number) => string
}

function ChartTooltip({ active, payload, label, format }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-sm shadow-lg">
      <p className="text-muted">{formatShortDate(String(label))}</p>
      <p className="font-medium tabular-nums">{format(Number(payload[0].value))}</p>
    </div>
  )
}

type TrendProps = {
  data: Array<{ date: string; value: number }>
  /** Describes the chart for screen readers. */
  label: string
  format: (value: number) => string
  /** Needs to be different for every chart on the same page. */
  gradientId: string
}

/** A daily trend as an area chart. Mirrors itself in right-to-left layouts. */
function AreaTrend({ data, label, format, gradientId }: TrendProps) {
  const rtl = useDirection() === 'rtl'
  return (
    <div className="h-72 w-full" role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--line)" />
          <XAxis
            dataKey="date"
            reversed={rtl}
            tickFormatter={formatShortDate}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            minTickGap={28}
          />
          <YAxis
            orientation={rtl ? 'right' : 'left'}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            content={<ChartTooltip format={format} />}
            cursor={{ stroke: 'var(--control)' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--link)"
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            isAnimationActive={!prefersReducedMotion()}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/** Daily revenue as an area chart. */
export function RevenueChart({ data }: { data: DailyPoint[] }) {
  return (
    <AreaTrend
      data={data.map((point) => ({ date: point.date, value: point.revenue }))}
      label="Daily revenue for the last 30 days"
      format={formatTnd}
      gradientId="revenue-fill"
    />
  )
}

/** Daily visitors as an area chart. */
export function TrafficChart({
  data,
  label,
}: {
  data: Array<{ date: string; visits: number }>
  label: string
}) {
  return (
    <AreaTrend
      data={data.map((point) => ({ date: point.date, value: point.visits }))}
      label={label}
      format={(value) => `${formatCount(value)} visitors`}
      gradientId="traffic-fill"
    />
  )
}

/** A tiny line without axes, for trends inside number cards. */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const rtl = useDirection() === 'rtl'
  const data = values.map((value, index) => ({ index, value }))
  return (
    <div className="h-10 w-full" role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
          <XAxis dataKey="index" hide reversed={rtl} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--link)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={!prefersReducedMotion()}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/** Sales split by category. The list under the donut carries the exact numbers. */
export function CategoryDonut({ data }: { data: CategorySales[] }) {
  const slices = data.map((item, index) => ({
    ...item,
    fill: SLICE_COLOURS[index % SLICE_COLOURS.length],
  }))
  return (
    <div>
      <div className="h-44 w-full" role="img" aria-label="Sales by category, as a donut chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="95%"
              paddingAngle={2}
              stroke="var(--surface)"
              strokeWidth={3}
              isAnimationActive={!prefersReducedMotion()}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 grid gap-2 text-sm">
        {slices.map((slice) => (
          <li key={slice.name} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: slice.fill }}
            />
            <span className="flex-1">{slice.name}</span>
            <span className="text-muted tabular-nums">{formatTnd(slice.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
