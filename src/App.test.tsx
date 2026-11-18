import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('theme and direction controls', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
    document.documentElement.dir = 'ltr'
  })

  it('switches the theme and remembers it', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Holiday' }))
    expect(document.documentElement.dataset.theme).toBe('holiday')
    expect(localStorage.getItem('cartlight.theme')).toBe('holiday')
    expect(screen.getByRole('button', { name: 'Holiday' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches to right-to-left and back', async () => {
    render(<App />)
    const toggle = screen.getByRole('button', { name: 'Right-to-left' })
    await userEvent.click(toggle)
    expect(document.documentElement.dir).toBe('rtl')
    await userEvent.click(toggle)
    expect(document.documentElement.dir).toBe('ltr')
  })
})
