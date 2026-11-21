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
import { formatShortDate, formatTnd } from '../../lib/format'
import { prefersReducedMotion } from '../../lib/motion'
import { useDirection } from '../../lib/useDirection'

// Colours come from the theme variables, so every chart follows the active theme.
const AXIS_TICK = { fill: 'var(--muted)', fontSize: 12 }
const SLICE_COLOURS = ['var(--accent)', 'var(--link)', 'var(--hot)', 'var(--fg)', 'var(--control)']

type TooltipProps = {
  active?: boolean
  payload?: ReadonlyArray<{ value?: number | string }>
  label?: string | number
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-sm shadow-lg">
      <p className="text-muted">{formatShortDate(String(label))}</p>
      <p className="font-medium tabular-nums">{formatTnd(Number(payload[0].value))}</p>
    </div>
  )
}

/** Daily revenue as an area chart. Mirrors itself in right-to-left layouts. */
export function RevenueChart({ data }: { data: DailyPoint[] }) {
  const rtl = useDirection() === 'rtl'
  return (
    <div className="h-72 w-full" role="img" aria-label="Daily revenue for the last 30 days">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
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
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--control)' }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--link)"
            strokeWidth={2.5}
            fill="url(#revenue-fill)"
            isAnimationActive={!prefersReducedMotion()}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
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
