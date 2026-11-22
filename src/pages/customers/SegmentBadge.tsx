import { Badge } from '../../components/ui/Badge'
import { SEGMENT_LABEL } from '../../data/customerStats'
import type { CustomerSegment } from '../../data/types'

const TONES = { new: 'accent', loyal: 'success', 'at-risk': 'danger' } as const

/** A label for where a customer stands: new, loyal or at risk. */
export function SegmentBadge({ segment }: { segment: CustomerSegment }) {
  return <Badge tone={TONES[segment]}>{SEGMENT_LABEL[segment]}</Badge>
}
