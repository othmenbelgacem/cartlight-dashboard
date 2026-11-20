import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'
import { Countdown } from './Countdown'
import { Snowfall } from './Snowfall'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('countdown', () => {
  it('shows the time left and keeps ticking', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 19, 0, 0, 0))
    render(<Countdown target={new Date(2026, 10, 20, 0, 0, 0)} />)
    expect(screen.getByRole('timer')).toHaveAccessibleName('1 day, 0 hours, 0 minutes left')
    act(() => {
      vi.advanceTimersByTime(3_600_000)
    })
    expect(screen.getByRole('timer')).toHaveAccessibleName('0 days, 23 hours, 0 minutes left')
  })

  it('shows the finished message once the date has passed', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 11, 26))
    render(<Countdown target={new Date(2026, 11, 25)} doneLabel="Merry Christmas!" />)
    expect(screen.getByRole('timer')).toHaveTextContent('Merry Christmas!')
  })
})

describe('snowfall', () => {
  it('draws the flakes', () => {
    const { container } = render(<Snowfall />)
    expect(container.querySelectorAll('span').length).toBe(48)
  })

  it('draws nothing for people who prefer reduced motion', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const { container } = render(<Snowfall />)
    expect(container).toBeEmptyDOMElement()
  })

  it('can be switched on only in the holiday theme', async () => {
    localStorage.clear()
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.queryByRole('button', { name: 'Snow' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Holiday' }))
    const snow = screen.getByRole('button', { name: 'Snow' })
    expect(snow).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(snow)
    expect(snow).toHaveAttribute('aria-pressed', 'true')
    expect(document.querySelector('.animate-snow')).not.toBeNull()
  })
})
