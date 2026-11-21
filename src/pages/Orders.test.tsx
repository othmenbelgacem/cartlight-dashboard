import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

function bodyRows() {
  return within(screen.getByRole('table', { name: 'Orders' }))
    .getAllByRole('row')
    .slice(1)
}

async function openOrdersPage() {
  localStorage.clear()
  window.history.pushState({}, '', '/orders')
  render(<App />)
  await screen.findByRole('table', { name: 'Orders' })
}

describe('orders page', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
  })

  it('lists the orders ten at a time', async () => {
    await openOrdersPage()
    expect(bodyRows()).toHaveLength(10)
    expect(screen.getByText('Showing 1–10 of 24')).toBeInTheDocument()
  })

  it('searches by customer name', async () => {
    await openOrdersPage()
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search orders' }), 'amel')
    const rows = bodyRows()
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((row) => row.textContent?.includes('Amel Trabelsi'))).toBe(true)
  })

  it('filters by status and shows a friendly message when nothing matches', async () => {
    await openOrdersPage()
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'cancelled')
    expect(bodyRows().every((row) => row.textContent?.includes('Cancelled'))).toBe(true)
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search orders' }), 'zzzz')
    expect(screen.getByText('No orders match')).toBeInTheDocument()
    await userEvent.click(screen.getAllByRole('button', { name: 'Clear filters' })[0])
    expect(bodyRows()).toHaveLength(10)
  })

  it('changes the status of the selected orders together', async () => {
    await openOrdersPage()
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select order #1042' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select order #1041' }))
    expect(screen.getByText('2 selected')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Mark as shipped' }))
    expect(screen.getByRole('status')).toHaveTextContent('2 orders marked as shipped')
    expect(within(bodyRows()[0]).getByText('Shipped')).toBeInTheDocument()
    expect(screen.queryByText(/\d selected/)).not.toBeInTheDocument()
  })

  it('opens an order, changes its status and saves', async () => {
    await openOrdersPage()
    await userEvent.click(screen.getByRole('button', { name: 'View order #1042' }))
    const drawer = screen.getByRole('dialog', { name: 'Order #1042' })
    expect(within(drawer).getByText(/Total, placed on/)).toBeInTheDocument()
    await userEvent.selectOptions(within(drawer).getByLabelText('Status'), 'delivered')
    await userEvent.click(within(drawer).getByRole('button', { name: 'Save changes' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Order #1042 updated')
    expect(within(bodyRows()[0]).getByText('Delivered')).toBeInTheDocument()
  })
})
