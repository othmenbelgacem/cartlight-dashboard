import { useState, type ComponentType } from 'react'
import { Bell, Check, Gift, Package, ShoppingBag, Users, type LucideProps } from 'lucide-react'
import { Link } from 'react-router'
import { Button, IconButton } from '../components/ui/Button'
import { Drawer } from '../components/ui/Overlays'
import { EmptyState } from '../components/ui/States'
import type { NotificationKind } from '../data/notifications'
import { cx } from '../lib/cx'
import { formatDaysAgo } from '../lib/format'
import { useNotifications } from './useNotifications'

const ICONS: Record<NotificationKind, ComponentType<LucideProps>> = {
  order: ShoppingBag,
  stock: Package,
  customer: Users,
  season: Gift,
}

/** The bell in the top bar, and the panel it opens. */
export function NotificationsCenter() {
  const { items, unread, isRead, markRead, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="relative rounded-full border border-line bg-surface p-2.5 text-muted transition-colors hover:text-fg"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -end-1 -top-1 grid min-w-5 place-items-center rounded-full bg-hot px-1 text-xs font-medium text-on-hot"
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Notifications"
        footer={
          <Button variant="secondary" disabled={unread === 0} onClick={markAllRead}>
            <Check size={16} />
            Mark all as read
          </Button>
        }
      >
        {items.length === 0 ? (
          <EmptyState
            icon={<Bell size={24} />}
            title="You are all caught up"
            description="New orders and stock warnings will show up here."
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted" aria-live="polite">
              {unread === 0 ? 'Everything is read.' : `${unread} unread of ${items.length}.`}
            </p>
            <ul className="grid gap-2">
              {items.map((item) => {
                const Icon = ICONS[item.kind]
                const unreadItem = !isRead(item.id)
                return (
                  <li
                    key={item.id}
                    className={cx(
                      'flex items-start gap-1 rounded-2xl border border-line',
                      unreadItem ? 'bg-raised' : 'bg-surface',
                    )}
                  >
                    <Link
                      to={item.to}
                      onClick={() => {
                        markRead(item.id)
                        setOpen(false)
                      }}
                      className="flex min-w-0 flex-1 items-start gap-3 rounded-2xl p-3"
                    >
                      <span className="mt-0.5 rounded-full border border-line bg-surface p-2 text-muted">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cx(
                            'block text-sm',
                            unreadItem ? 'font-semibold' : 'font-medium',
                          )}
                        >
                          {item.title}
                        </span>
                        <span className="block text-sm text-muted">{item.detail}</span>
                        <span className="block text-xs text-muted">
                          {formatDaysAgo(item.daysAgo)}
                          {unreadItem && <span className="sr-only">. Unread</span>}
                        </span>
                      </span>
                      {unreadItem && (
                        <span
                          aria-hidden="true"
                          className="mt-2 size-2.5 shrink-0 rounded-full bg-link"
                        />
                      )}
                    </Link>
                    {unreadItem && (
                      <IconButton
                        label={`Mark "${item.title}" as read`}
                        className="m-2"
                        onClick={() => markRead(item.id)}
                      >
                        <Check size={16} />
                      </IconButton>
                    )}
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </Drawer>
    </>
  )
}
