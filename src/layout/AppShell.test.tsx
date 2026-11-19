import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

describe('app shell', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.pushState({}, '', '/')
  })

  it('navigates between pages from the sidebar', async () => {
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Overview' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', { name: 'Orders' }))
    expect(await screen.findByRole('heading', { name: 'Orders' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Orders' })).toHaveAttribute('aria-current', 'page')
  })

  it('shows a friendly page for unknown addresses', async () => {
    window.history.pushState({}, '', '/nope')
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('opens the mobile menu and closes it with Escape', async () => {
    render(<App />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('collapses and expands the sidebar', async () => {
    render(<App />)
    const button = screen.getByRole('button', { name: 'Collapse sidebar' })
    expect(button).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })
})
