import type { FunnelStep } from '../../data/analytics'
import { formatCount, formatRate } from '../../lib/format'

/** Each step of the shopping journey as a bar, with how many people dropped off before it. */
export function Funnel({ steps }: { steps: FunnelStep[] }) {
  const top = steps[0]?.count || 1

  return (
    <ol className="grid gap-4">
      {steps.map((step, index) => {
        const previous = steps[index - 1]
        const kept = previous && previous.count > 0 ? (step.count / previous.count) * 100 : 100
        return (
          <li key={step.id}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium">{step.label}</span>
              <span className="tabular-nums">{formatCount(step.count)}</span>
            </div>
            <div aria-hidden="true" className="mt-1.5 h-2 rounded-full bg-line">
              <div
                className="h-full rounded-full bg-link"
                style={{ width: `${Math.max((step.count / top) * 100, 1)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted">
              {previous
                ? `${formatRate(kept)} of the step before`
                : 'Everyone who visited the shop'}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
