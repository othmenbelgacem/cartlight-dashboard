import { WEEKDAYS, WEEKDAY_NAMES } from '../../data/analytics'
import { formatCount } from '../../lib/format'

/** The busy and quiet times of the week. Darker means more visitors, and every cell also holds its number for screen readers. */
export function Heatmap({ heat }: { heat: number[][] }) {
  const max = Math.max(...heat.flat(), 1)

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] border-separate border-spacing-1 text-xs">
          <caption className="sr-only">Visitors by weekday and hour of the day</caption>
          <thead>
            <tr>
              <td />
              {Array.from({ length: 24 }, (_, hour) => (
                <th key={hour} scope="col" className="font-normal text-muted tabular-nums">
                  <span className={hour % 3 === 0 ? '' : 'sr-only'}>{hour}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heat.map((row, dayIndex) => (
              <tr key={WEEKDAYS[dayIndex]}>
                <th scope="row" className="pe-2 text-start font-medium">
                  {WEEKDAYS[dayIndex]}
                </th>
                {row.map((visits, hour) => (
                  <td
                    key={hour}
                    title={`${WEEKDAY_NAMES[dayIndex]} ${hour}:00, ${formatCount(visits)} visitors`}
                    className="h-7 rounded-md"
                    style={{
                      backgroundColor: `color-mix(in oklab, var(--accent) ${Math.round((visits / max) * 90)}%, var(--raised))`,
                    }}
                  >
                    <span className="sr-only">{visits}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted">
        <span>Fewer visitors</span>
        <span
          aria-hidden="true"
          className="h-2.5 w-32 rounded-full"
          style={{
            background:
              'linear-gradient(to right, var(--raised), color-mix(in oklab, var(--accent) 90%, var(--raised)))',
          }}
        />
        <span>More visitors</span>
      </div>
    </div>
  )
}
