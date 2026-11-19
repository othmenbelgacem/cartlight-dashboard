import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'
import { DropdownMenu } from './DropdownMenu'
import { Modal } from './Overlays'
import { Tooltip } from './Tooltip'

function ModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete order?">
        <p>This cannot be undone.</p>
      </Modal>
    </>
  )
}

describe('overlays', () => {
  it('opens a modal with a title and closes it with the close button', async () => {
    render(<ModalDemo />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog', { name: 'Delete order?' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('describes a button with its tooltip text', () => {
    render(
      <Tooltip label="Copy link">
        <button type="button">Share</button>
      </Tooltip>,
    )
    expect(screen.getByRole('button', { name: 'Share' })).toHaveAccessibleDescription('Copy link')
  })

  it('runs the chosen menu item with the keyboard and returns focus', async () => {
    const chosen: string[] = []
    render(
      <DropdownMenu
        label="Order actions"
        items={[
          { label: 'Edit', onSelect: () => chosen.push('Edit') },
          { label: 'Delete', onSelect: () => chosen.push('Delete') },
        ]}
      >
        Actions
      </DropdownMenu>,
    )
    const trigger = screen.getByRole('button', { name: 'Order actions' })
    await userEvent.click(trigger)
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(chosen).toEqual(['Delete'])
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes the menu with Escape', async () => {
    render(
      <DropdownMenu label="Order actions" items={[{ label: 'Edit', onSelect: () => {} }]}>
        Actions
      </DropdownMenu>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Order actions' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
