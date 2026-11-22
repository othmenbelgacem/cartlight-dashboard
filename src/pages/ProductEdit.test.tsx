import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'

async function openProducts() {
  localStorage.clear()
  window.history.pushState({}, '', '/products')
  render(<App />)
  await screen.findByRole('heading', { name: 'Products', level: 1 })
}

const toasts = () => screen.getByRole('region', { name: 'Notifications' })

describe('product edit form', () => {
  it('opens a product with its variants', async () => {
    await openProducts()
    await userEvent.click(screen.getByRole('button', { name: 'Edit Brass lantern' }))
    const drawer = screen.getByRole('dialog', { name: 'Edit Brass lantern' })
    expect(within(drawer).getByLabelText('Name')).toHaveValue('Brass lantern')
    const variants = within(drawer).getByRole('table', { name: 'Variants of Brass lantern' })
    expect(within(variants).getAllByRole('row')).toHaveLength(4)
  })

  it('explains mistakes, moves focus to the first one, and clears them when fixed', async () => {
    await openProducts()
    await userEvent.click(screen.getByRole('button', { name: 'Edit Brass lantern' }))
    const drawer = screen.getByRole('dialog')
    await userEvent.clear(within(drawer).getByLabelText('Name'))
    await userEvent.clear(within(drawer).getByLabelText('Price (TND)'))
    await userEvent.click(within(drawer).getByRole('button', { name: 'Save changes' }))

    expect(within(drawer).getByRole('alert')).toHaveTextContent(
      'Fix 2 fields to continue: Name, Price.',
    )
    expect(within(drawer).getByLabelText('Name')).toHaveFocus()
    expect(within(drawer).getByLabelText('Name')).toHaveAccessibleDescription(
      'Enter a product name.',
    )
    expect(within(drawer).getByLabelText('Price (TND)')).toBeInvalid()

    await userEvent.type(within(drawer).getByLabelText('Name'), 'Brass lamp')
    expect(within(drawer).getByRole('alert')).toHaveTextContent('Fix 1 field to continue: Price.')
  })

  it('saves a corrected product and updates the card', async () => {
    await openProducts()
    await userEvent.click(screen.getByRole('button', { name: 'Edit Brass lantern' }))
    const drawer = screen.getByRole('dialog')
    await userEvent.clear(within(drawer).getByLabelText('Price (TND)'))
    await userEvent.type(within(drawer).getByLabelText('Price (TND)'), '80')
    await userEvent.clear(within(drawer).getByLabelText('Stock'))
    await userEvent.type(within(drawer).getByLabelText('Stock'), '15')
    await userEvent.click(within(drawer).getByRole('button', { name: 'Save changes' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(within(toasts()).getByText('Brass lantern saved')).toBeInTheDocument()
    const card = screen.getByRole('article', { name: 'Brass lantern' })
    expect(within(card).getByText('80.000 TND')).toBeInTheDocument()
    expect(within(card).getByText('15 in stock')).toBeInTheDocument()
    expect(screen.getByText('12 products, 2 low on stock, 0 out of stock.')).toBeInTheDocument()
  })

  it('adds a new product', async () => {
    await openProducts()
    await userEvent.click(screen.getByRole('button', { name: 'Add product' }))
    const drawer = screen.getByRole('dialog', { name: 'Add product' })
    expect(within(drawer).queryByRole('table')).not.toBeInTheDocument()
    await userEvent.type(within(drawer).getByLabelText('Name'), 'Linen napkins')
    await userEvent.type(within(drawer).getByLabelText('Price (TND)'), '24.5')
    await userEvent.clear(within(drawer).getByLabelText('Stock'))
    await userEvent.type(within(drawer).getByLabelText('Stock'), '4')
    await userEvent.click(within(drawer).getByRole('button', { name: 'Add product' }))

    expect(within(toasts()).getByText('Linen napkins added')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(13)
    expect(screen.getByText('13 products, 3 low on stock, 1 out of stock.')).toBeInTheDocument()
  })
})
