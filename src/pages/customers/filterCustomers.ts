import type { CustomerRow } from '../../data/customerStats'
import type { CustomerSegment } from '../../data/types'

export type SegmentFilter = CustomerSegment | 'all'

/** Keeps the customers in the chosen segment whose name, email or city contains the search text. */
export function filterCustomers(
  rows: CustomerRow[],
  query: string,
  segment: SegmentFilter,
): CustomerRow[] {
  const needle = query.trim().toLowerCase()
  return rows.filter((row) => {
    if (segment !== 'all' && row.segment !== segment) return false
    if (needle && !`${row.name} ${row.email} ${row.city}`.toLowerCase().includes(needle)) {
      return false
    }
    return true
  })
}
