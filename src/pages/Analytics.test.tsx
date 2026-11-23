import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { reportFor } from '../data/analytics'
import { formatCount } from '../lib/format'

async function openAnalytics(path = '/analytics') {
  localStorage.clear()
  window.history.pushState({}, '', path)
  render(<App />)
  await screen.findByRole('heading', { name: 'Analytics', level: 1 })
}

// The number card with this label, so the same number elsewhere on the page does not get in the way.
const card = (label: string) => within(screen.getByText(label, { selector: 'dt' }).closest('dl')!)

describe('analytics page', () => {
  it('starts with the last 30 days', async () => {
    await openAnalytics()
    expect(screen.getByRole('button', { name: 'Last 30 days' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(card('Visitors').getByText(formatCount(reportFor(30).stats.visits))).toBeInTheDocument()
    expect(screen.getAllByText('No earlier period to compare')).toHaveLength(4)
  })

  it('changes every number when another range is chosen', async () => {
    await openAnalytics()
    await userEvent.click(screen.getByRole('button', { name: 'Last 7 days' }))
    expect(screen.getByRole('button', { name: 'Last 7 days' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(card('Visitors').getByText(formatCount(reportFor(7).stats.visits))).toBeInTheDocument()
    expect(screen.getAllByText(/vs the period before/).length).toBeGreaterThan(0)
  })

  it('remembers the range in the address', async () => {
    await openAnalytics('/analytics?range=14')
    expect(screen.getByRole('button', { name: 'Last 14 days' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(card('Visitors').getByText(formatCount(reportFor(14).stats.visits))).toBeInTheDocument()
  })

  it('shows the shopping journey from visitors to orders', async () => {
    await openAnalytics()
    const journey = screen.getByRole('heading', { name: 'Shopping journey' }).closest('section')!
    const steps = within(journey).getAllByRole('listitem')
    expect(steps).toHaveLength(5)
    expect(steps[0]).toHaveTextContent('Visitors')
    expect(steps[4]).toHaveTextContent('Placed an order')
    expect(steps[4]).toHaveTextContent(String(reportFor(30).stats.orders))
  })

  it('shows when visitors come, as a table with a busiest-time sentence', async () => {
    await openAnalytics()
    expect(screen.getByText(/The busiest time is Saturday at 20:00/)).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'Visitors by weekday and hour of the day' })
    expect(within(table).getAllByRole('row')).toHaveLength(8)
    expect(within(table).getByRole('rowheader', { name: 'Sat' })).toBeInTheDocument()
  })
})
