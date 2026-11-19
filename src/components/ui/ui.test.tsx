import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { Switch } from './Choices'
import { Input } from './fields'

describe('ui components', () => {
  it('connects an input to its label, hint and error', () => {
    render(<Input label="Email" error="Enter a complete email address." />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Enter a complete email address.')
  })

  it('toggles a switch with the mouse', async () => {
    render(<Switch label="Season mode" />)
    const toggle = screen.getByRole('switch', { name: 'Season mode' })
    expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    expect(toggle).toBeChecked()
  })

  it('shows initials in an avatar', () => {
    render(<Avatar name="Othmen Belgacem" />)
    expect(screen.getByRole('img', { name: 'Othmen Belgacem' })).toHaveTextContent('OB')
  })

  it('does not fire clicks when a button is disabled', async () => {
    let clicks = 0
    render(
      <Button disabled onClick={() => (clicks += 1)}>
        Save
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(clicks).toBe(0)
  })
})
