import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

describe('command palette', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.pushState({}, '', '/')
    delete document.documentElement.dataset.theme
  })

  it('opens with Ctrl+K and jumps to a page', async () => {
    render(<App />)
    await userEvent.keyboard('{Control>}k{/Control}')
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()
    await userEvent.keyboard('orders{Enter}')
    expect(await screen.findByRole('heading', { name: 'Orders' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('switches the theme from the palette', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Open command palette' }))
    await userEvent.keyboard('dark{Enter}')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('moves with the arrow keys and says when nothing matches', async () => {
    render(<App />)
    await userEvent.keyboard('{Control>}k{/Control}')
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('zzzz')
    expect(screen.getByText(/No match for/)).toBeInTheDocument()
  })
})
