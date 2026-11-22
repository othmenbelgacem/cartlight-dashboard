import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'

async function openProfile(id: string) {
  localStorage.clear()
  window.history.pushState({}, '', `/customers/${id}`)
  render(<App />)
}

describe('customer profile', () => {
  it('shows the customer, their numbers and their order history', async () => {
    await openProfile('c-01')
    expect(
      await screen.findByRole('heading', { name: 'Amel Trabelsi', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByText(/amel.trabelsi@example.com/)).toBeInTheDocument()
    expect(screen.getByText('Total spent')).toBeInTheDocument()
    const history = screen.getByRole('table', { name: 'Orders by Amel Trabelsi' })
    expect(within(history).getAllByRole('row').length).toBeGreaterThan(1)
  })

  it('explains the segment in words', async () => {
    await openProfile('c-04')
    await screen.findByRole('heading', { name: 'Karim Jlassi', level: 1 })
    expect(screen.getByText('Loyal')).toBeInTheDocument()
    expect(screen.getByText('Ordered in the last 10 days')).toBeInTheDocument()
  })

  it('shows the customer in the breadcrumb and the browser tab, with a way back', async () => {
    await openProfile('c-01')
    await screen.findByRole('heading', { name: 'Amel Trabelsi', level: 1 })
    const trail = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(within(trail).getByRole('link', { name: 'Customers' })).toHaveAttribute(
      'href',
      '/customers',
    )
    expect(within(trail).getByText('Amel Trabelsi')).toHaveAttribute('aria-current', 'page')
    await waitFor(() => expect(document.title).toBe('Amel Trabelsi | Cartlight'))
    await userEvent.click(screen.getByRole('link', { name: 'All customers' }))
    expect(await screen.findByRole('table', { name: 'Customers' })).toBeInTheDocument()
  })

  it('says so when the customer does not exist', async () => {
    await openProfile('c-99')
    expect(await screen.findByRole('heading', { name: 'Customer not found' })).toBeInTheDocument()
    await waitFor(() => expect(document.title).toBe('Customer not found | Cartlight'))
  })
})
