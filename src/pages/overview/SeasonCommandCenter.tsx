import { useState } from 'react'
import { BentoTile } from '../../components/ui/Card'
import { Countdown } from '../../components/ui/Countdown'
import { season } from '../../data/stats'
import { formatShortDate, formatTnd } from '../../lib/format'

const CHRISTMAS = new Date(2026, 11, 25)
const DAY = 86_400_000

/** The signature widget: a shop-window arch that fills with light as the season goal gets closer. */
export function SeasonCommandCenter({ now }: { now?: Date }) {
  const [loadedAt] = useState(() => new Date())
  const current = now ?? loadedAt
  const daysLeft = Math.max(1, Math.ceil((CHRISTMAS.getTime() - current.getTime()) / DAY))
  const dailyTarget = Math.max(0, season.goal - season.sold) / daysLeft

  return (
    <BentoTile size="full" className="relative overflow-hidden md:p-8">
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="font-display text-xl font-bold">Season command center</h2>
          <p className="mt-1 text-muted">Christmas sales season. Goal: {formatTnd(season.goal)}.</p>

          <Countdown className="mt-5 max-w-lg" target={CHRISTMAS} doneLabel="Merry Christmas!" />

          <dl className="mt-6 grid gap-5 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-muted">Sold so far</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">
                {formatTnd(season.sold)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Daily target</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">
                {formatTnd(dailyTarget)}
                <span className="block font-sans text-xs font-normal text-muted">
                  a day for the next {daysLeft} days
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Best day so far</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">
                {formatTnd(season.bestDay.revenue)}
                <span className="block font-sans text-xs font-normal text-muted">
                  {formatShortDate(season.bestDay.date)}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex items-end gap-6 justify-self-center md:justify-self-end">
          <div>
            <p className="font-display text-6xl font-bold tabular-nums">{season.percent}%</p>
            <p className="text-sm text-muted">of the goal</p>
          </div>
          <div
            role="progressbar"
            aria-label="Season sales goal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={season.percent}
            className="relative h-60 w-44 shrink-0 overflow-hidden rounded-t-full border-4 border-accent bg-raised shadow-[0_0_80px_16px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
          >
            <div
              className="absolute inset-x-0 bottom-0 bg-linear-to-t from-accent to-accent/60 transition-[height] duration-700"
              style={{ height: `${season.percent}%` }}
            />
          </div>
        </div>
      </div>
    </BentoTile>
  )
}
