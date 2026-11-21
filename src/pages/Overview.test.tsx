import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { kpis, season } from '../data/stats'
import { formatTnd } from '../lib/format'

describe('overview page', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.pushState({}, '', '/')
  })

  it('shows the season command center with the goal progress and countdown', async () => {
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Season sales goal' })).toHaveAttribute(
      'aria-valuenow',
      String(season.percent),
    )
    expect(screen.getByRole('timer')).toBeInTheDocument()
  })

  it('shows the key numbers', async () => {
    render(<App />)
    await screen.findByRole('heading', { name: 'Key numbers' })
    expect(screen.getAllByText(formatTnd(kpis.revenue.total)).length).toBeGreaterThan(0)
    expect(screen.getByText(String(kpis.orders.total))).toBeInTheDocument()
  })

  it('lists the five newest orders', async () => {
    render(<App />)
    const table = await screen.findByRole('table', { name: 'Recent orders' })
    expect(within(table).getAllByRole('row')).toHaveLength(6)
    expect(within(table).getByText('#1042')).toBeInTheDocument()
  })
})
