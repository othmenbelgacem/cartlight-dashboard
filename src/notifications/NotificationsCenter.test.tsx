import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { notifications } from '../data/notifications'

const total = notifications.length
const bell = (name: string | RegExp) => screen.getByRole('button', { name })

function openApp() {
  window.history.pushState({}, '', '/')
  render(<App />)
}

async function openPanel() {
  await userEvent.click(bell(/^Notifications/))
  return screen.getByRole('dialog', { name: 'Notifications' })
}

describe('notifications center', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows on the bell how many are unread', () => {
    openApp()
    expect(bell(`Notifications, ${total} unread`)).toBeInTheDocument()
  })

  it('lists every notification with its time, and marks unread ones in words', async () => {
    openApp()
    const panel = await openPanel()
    expect(within(panel).getByText(`${total} unread of ${total}.`)).toBeInTheDocument()
    expect(within(panel).getAllByRole('link')).toHaveLength(total)
    expect(
      within(panel).getByRole('link', { name: /New order #1042 from Karim Jlassi.*Unread/ }),
    ).toBeInTheDocument()
  })

  it('marks one as read without leaving the panel', async () => {
    openApp()
    const panel = await openPanel()
    const first = notifications[0]
    await userEvent.click(
      within(panel).getByRole('button', { name: `Mark "${first.title}" as read` }),
    )
    expect(bell(`Notifications, ${total - 1} unread`)).toBeInTheDocument()
    expect(
      within(panel).queryByRole('button', { name: `Mark "${first.title}" as read` }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Notifications' })).toBeInTheDocument()
  })

  it('marks everything as read', async () => {
    openApp()
    const panel = await openPanel()
    await userEvent.click(within(panel).getByRole('button', { name: 'Mark all as read' }))
    expect(bell('Notifications')).toBeInTheDocument()
    expect(within(panel).getByText('Everything is read.')).toBeInTheDocument()
    expect(within(panel).getByRole('button', { name: 'Mark all as read' })).toBeDisabled()
  })

  it('opens the related page, closes the panel and marks it read', async () => {
    openApp()
    const panel = await openPanel()
    await userEvent.click(within(panel).getByRole('link', { name: /New order #1042/ }))
    expect(await screen.findByRole('heading', { name: 'Orders', level: 1 })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(bell(`Notifications, ${total - 1} unread`)).toBeInTheDocument()
  })

  it('remembers what was read after a reload', async () => {
    openApp()
    const panel = await openPanel()
    await userEvent.click(within(panel).getByRole('button', { name: 'Mark all as read' }))
    cleanup()
    openApp()
    await waitFor(() => expect(bell('Notifications')).toBeInTheDocument())
  })
})
