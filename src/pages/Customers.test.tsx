import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'

async function openCustomers() {
  localStorage.clear()
  window.history.pushState({}, '', '/customers')
  render(<App />)
  await screen.findByRole('table', { name: 'Customers' })
}

const bodyRows = () =>
  within(screen.getByRole('table', { name: 'Customers' }))
    .getAllByRole('row')
    .slice(1)

describe('customers page', () => {
  it('lists the customers eight at a time', async () => {
    await openCustomers()
    expect(bodyRows()).toHaveLength(8)
    expect(screen.getByText('Showing 1–8 of 12')).toBeInTheDocument()
  })

  it('filters by segment with the buttons above the table', async () => {
    await openCustomers()
    const atRisk = screen.getByRole('button', { name: /At risk/ })
    expect(atRisk).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(atRisk)
    expect(atRisk).toHaveAttribute('aria-pressed', 'true')
    const rows = bodyRows()
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((row) => within(row).getByText('At risk'))).toBe(true)
  })

  it('searches and shows a friendly message when nothing matches', async () => {
    await openCustomers()
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search customers' }), 'amel')
    expect(bodyRows()).toHaveLength(1)
    await userEvent.clear(screen.getByRole('searchbox', { name: 'Search customers' }))
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search customers' }), 'zzzz')
    expect(screen.getByRole('heading', { name: 'No customers match' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Show all customers' }))
    expect(bodyRows()).toHaveLength(8)
  })

  it('opens a customer profile from the list', async () => {
    await openCustomers()
    await userEvent.click(screen.getByRole('link', { name: 'Amel Trabelsi' }))
    expect(
      await screen.findByRole('heading', { name: 'Amel Trabelsi', level: 1 }),
    ).toBeInTheDocument()
  })
})
