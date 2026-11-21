import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../../App'

async function openBoard() {
  localStorage.clear()
  window.history.pushState({}, '', '/orders?view=board')
  render(<App />)
  await screen.findByRole('heading', { name: 'New' })
}

const column = (name: string) => screen.getByRole('region', { name })

describe('orders board', () => {
  it('shows one column for each step of the pipeline', async () => {
    await openBoard()
    for (const name of ['New', 'Packed', 'Shipped', 'Delivered']) {
      expect(column(name)).toBeInTheDocument()
    }
    expect(within(column('New')).getByText('#1042')).toBeInTheDocument()
  })

  it('switches between the list and the board', async () => {
    await openBoard()
    expect(screen.getByRole('button', { name: 'Board' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'List' }))
    expect(await screen.findByRole('table', { name: 'Orders' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('moves a card with its menu, using only the keyboard', async () => {
    await openBoard()
    expect(within(column('New')).getByText('#1042')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Move order #1042' }))
    await userEvent.keyboard('{Enter}')
    expect(within(column('Packed')).getByText('#1042')).toBeInTheDocument()
    expect(within(column('New')).queryByText('#1042')).not.toBeInTheDocument()
    expect(
      within(screen.getByRole('region', { name: 'Notifications' })).getByText(
        'Order #1042 moved to Packed',
      ),
    ).toBeInTheDocument()
  })

  it('removes a cancelled order from the board', async () => {
    await openBoard()
    await userEvent.click(screen.getByRole('button', { name: 'Move order #1042' }))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Cancel order' }))
    expect(screen.queryByText('#1042')).not.toBeInTheDocument()
  })

  it('opens the order details from a card', async () => {
    await openBoard()
    await userEvent.click(screen.getByRole('button', { name: 'View order #1042' }))
    expect(screen.getByRole('dialog', { name: 'Order #1042' })).toBeInTheDocument()
  })
})
