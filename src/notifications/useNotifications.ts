import { useEffect, useState } from 'react'
import { notifications } from '../data/notifications'

const KEY = 'cartlight.notifications.read'

function readSaved(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

/** The notifications, which ones were read, and how to read them. What was read is remembered. */
export function useNotifications() {
  const [read, setRead] = useState<Set<string>>(() => new Set(readSaved()))

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify([...read]))
    } catch {
      // Storage can be blocked (private mode). Everything still works without saving.
    }
  }, [read])

  const unread = notifications.filter((item) => !read.has(item.id)).length

  return {
    items: notifications,
    unread,
    isRead: (id: string) => read.has(id),
    markRead: (id: string) => setRead((current) => new Set(current).add(id)),
    markAllRead: () => setRead(new Set(notifications.map((item) => item.id))),
  }
}
