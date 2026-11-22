import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { Ellipsis, Trash2 } from 'lucide-react'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { DropdownMenu, type MenuItem } from '../../components/ui/DropdownMenu'
import { getCustomer } from '../../data'
import type { Order, OrderStatus } from '../../data/types'
import { cx } from '../../lib/cx'
import { formatShortDate, formatTnd } from '../../lib/format'
import {
  PIPELINE_STATUSES,
  groupByStatus,
  isPipelineStatus,
  statusLabel,
  type PipelineStatus,
} from './pipeline'

type CardViewProps = {
  order: Order
  /** False for the copy that follows the pointer while dragging. */
  interactive?: boolean
  dragging?: boolean
  onMove?: (orderId: string, status: OrderStatus) => void
  onOpen?: (orderId: string) => void
}

function OrderCardView({
  order,
  interactive = true,
  dragging = false,
  onMove,
  onOpen,
}: CardViewProps) {
  const customer = getCustomer(order.customerId)?.name ?? 'Unknown customer'
  const items = order.items.reduce((sum, item) => sum + item.quantity, 0)

  // The Move menu is the keyboard and screen-reader way to do what dragging does.
  const moves: MenuItem[] = [
    ...PIPELINE_STATUSES.filter((status) => status !== order.status).map((status) => ({
      label: `Move to ${statusLabel(status)}`,
      onSelect: () => onMove?.(order.id, status),
    })),
    {
      label: 'Cancel order',
      icon: <Trash2 size={16} />,
      danger: true,
      onSelect: () => onMove?.(order.id, 'cancelled'),
    },
  ]

  return (
    <div
      className={cx(
        'rounded-2xl border border-line bg-surface p-4 shadow-[0_10px_20px_-16px_color-mix(in_oklab,var(--fg)_40%,transparent)]',
        dragging && 'rotate-2 shadow-xl',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{order.id}</span>
        <span className="text-xs text-muted">{formatShortDate(order.date)}</span>
      </div>
      <div className="mt-3 flex items-center gap-2.5">
        <Avatar name={customer} size="sm" />
        <span className="min-w-0 truncate text-sm">{customer}</span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium tabular-nums">{formatTnd(order.total)}</p>
          <p className="text-xs text-muted">
            {items} item{items === 1 ? '' : 's'}
          </p>
        </div>
        {interactive && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              aria-label={`View order ${order.id}`}
              onClick={() => onOpen?.(order.id)}
            >
              View
            </Button>
            <DropdownMenu label={`Move order ${order.id}`} items={moves} triggerClassName="px-2.5!">
              <Ellipsis size={16} />
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  )
}

function DraggableCard(props: CardViewProps) {
  const { setNodeRef, listeners, isDragging } = useDraggable({ id: props.order.id })
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      className={cx('cursor-grab touch-manipulation', isDragging && 'opacity-40')}
    >
      <OrderCardView {...props} />
    </div>
  )
}

type ColumnProps = {
  status: PipelineStatus
  orders: Order[]
  total: number
  onMove: (orderId: string, status: OrderStatus) => void
  onOpen: (orderId: string) => void
}

const COLUMN_LIMIT = 6

function Column({ status, orders, total, onMove, onOpen }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? orders : orders.slice(0, COLUMN_LIMIT)
  const headingId = `column-${status}`

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      className={cx(
        'rounded-2xl border border-line bg-raised/50 p-3 transition-shadow',
        isOver && 'ring-2 ring-link',
      )}
    >
      <header className="flex items-baseline justify-between gap-2 px-1 pb-3">
        <h2 id={headingId} className="font-display text-lg font-bold">
          {statusLabel(status)}
        </h2>
        <p className="text-xs text-muted tabular-nums">
          {orders.length} · {formatTnd(total)}
        </p>
      </header>
      <div className="grid min-h-32 content-start gap-3">
        {orders.length === 0 && (
          <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-sm text-muted">
            No orders
          </p>
        )}
        {shown.map((order) => (
          <DraggableCard key={order.id} order={order} onMove={onMove} onOpen={onOpen} />
        ))}
        {orders.length > COLUMN_LIMIT && (
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'Show fewer' : `Show ${orders.length - COLUMN_LIMIT} more`}
          </Button>
        )}
      </div>
    </section>
  )
}

type PipelineBoardProps = {
  orders: Order[]
  /** Called when a card is dropped in another column or moved with its menu. */
  onMove: (orderId: string, status: OrderStatus) => void
  onOpen: (orderId: string) => void
}

/** Orders as cards in columns, one column per step. Drag a card, or use its Move menu. */
export function PipelineBoard({ orders, onMove, onOpen }: PipelineBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    // A small distance before dragging starts keeps clicks on the card's buttons working.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  )
  const columns = groupByStatus(orders)
  const activeOrder = orders.find((order) => order.id === activeId)

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const target = event.over?.id
    if (typeof target === 'string' && isPipelineStatus(target)) {
      onMove(String(event.active.id), target)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={(event) => setActiveId(String(event.active.id))}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <Column key={column.status} {...column} onMove={onMove} onOpen={onOpen} />
        ))}
      </div>
      <DragOverlay>
        {activeOrder ? <OrderCardView order={activeOrder} interactive={false} dragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}
