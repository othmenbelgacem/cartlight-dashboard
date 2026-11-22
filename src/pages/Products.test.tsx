import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'

async function openProducts(path = '/products') {
  localStorage.clear()
  window.history.pushState({}, '', path)
  render(<App />)
  await screen.findByRole('heading', { name: 'Products', level: 1 })
}

describe('products page', () => {
  it('shows every product as a card', async () => {
    await openProducts()
    expect(screen.getAllByRole('article')).toHaveLength(12)
    expect(screen.getByText('12 products, 2 low on stock, 1 out of stock.')).toBeInTheDocument()
  })

  it('searches by name', async () => {
    await openProducts()
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search products' }), 'lantern')
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(1)
    expect(within(cards[0]).getByText('Brass lantern')).toBeInTheDocument()
  })

  it('shows low stock and out of stock in words', async () => {
    await openProducts()
    await userEvent.selectOptions(screen.getByLabelText('Stock'), 'low')
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByText('Only 7 left')).toBeInTheDocument()
    await userEvent.selectOptions(screen.getByLabelText('Stock'), 'out')
    expect(within(screen.getByRole('article')).getByText('Out of stock')).toBeInTheDocument()
  })

  it('shows a friendly message when nothing matches', async () => {
    await openProducts()
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search products' }), 'zzzz')
    expect(screen.getByRole('heading', { name: 'No products match' })).toBeInTheDocument()
    await userEvent.click(screen.getAllByRole('button', { name: 'Clear filters' })[0])
    expect(screen.getAllByRole('article')).toHaveLength(12)
  })

  it('switches to a sortable list', async () => {
    await openProducts()
    await userEvent.click(screen.getByRole('button', { name: 'List' }))
    const table = await screen.findByRole('table', { name: 'Products' })
    expect(within(table).getAllByRole('row')).toHaveLength(9)
    expect(screen.getByText('Showing 1–8 of 12')).toBeInTheDocument()
    await userEvent.click(within(table).getByRole('button', { name: 'Price' }))
    expect(within(table).getAllByRole('row')[1]).toHaveTextContent('Date syrup jar')
  })
})
