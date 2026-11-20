import { useEffect, useState } from 'react'
import { cx } from '../../lib/cx'

type CountdownProps = {
  /** The moment to count down to. */
  target: Date
  /** Shown once the moment has passed. */
  doneLabel?: string
  className?: string
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

/** Days, hours, minutes and seconds left until `target`. Updates every second. */
export function Countdown({ target, doneLabel = 'It’s here!', className }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now())
  const remaining = target.getTime() - now
  const done = remaining <= 0

  useEffect(() => {
    if (done) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [done])

  if (done) {
    return (
      <p role="timer" className={cx('font-display text-2xl font-bold', className)}>
        {doneLabel}
      </p>
    )
  }

  const total = Math.floor(remaining / 1000)
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const units = [
    ['Days', days],
    ['Hours', hours],
    ['Minutes', minutes],
    ['Seconds', seconds],
  ] as const

  return (
    <div
      role="timer"
      aria-label={`${plural(days, 'day')}, ${plural(hours, 'hour')}, ${plural(minutes, 'minute')} left`}
      className={cx('grid grid-cols-4 gap-3', className)}
    >
      {units.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-line bg-raised px-2 py-3 text-center">
          <div className="font-display text-3xl font-bold tabular-nums">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-xs text-muted">{label}</div>
        </div>
      ))}
    </div>
  )
}
