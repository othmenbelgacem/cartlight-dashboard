import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

describe('page titles', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.pushState({}, '', '/')
  })

  it('shows the page name in the browser tab and updates it on navigation', async () => {
    render(<App />)
    await waitFor(() => expect(document.title).toBe('Overview | Cartlight'))
    await userEvent.click(screen.getByRole('link', { name: 'Orders' }))
    await waitFor(() => expect(document.title).toBe('Orders | Cartlight'))
  })
})
