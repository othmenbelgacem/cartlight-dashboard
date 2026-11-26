import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import AssistantPanel from './AssistantPanel'
import type { AiClient } from './aiClient'

const echo: AiClient = {
  reply: async (history) => `You asked: ${history[history.length - 1].content}`,
}

function renderPanel(client: AiClient = echo) {
  render(<AssistantPanel open onClose={() => {}} client={client} typewriter={false} />)
  return screen.getByRole('dialog', { name: 'Assistant' })
}

const log = () => screen.getByRole('log', { name: 'Conversation' })

describe('assistant panel', () => {
  it('starts with suggestions and says it is a demo', () => {
    const panel = renderPanel()
    expect(within(panel).getByText(/Demo assistant/)).toBeInTheDocument()
    expect(within(panel).getAllByRole('button', { name: /\?|Summarize/ }).length).toBeGreaterThan(3)
    expect(within(log()).queryAllByText(/You asked/)).toHaveLength(0)
  })

  it('answers a suggested question', async () => {
    renderPanel()
    await userEvent.click(screen.getByRole('button', { name: 'What sold best?' }))
    expect(await within(log()).findByText('What sold best?')).toBeInTheDocument()
    expect(
      (await within(log()).findAllByText('You asked: What sold best?')).length,
    ).toBeGreaterThan(0)
  })

  it('sends what is typed with Enter, and empties the box', async () => {
    renderPanel()
    const box = screen.getByRole('textbox', { name: 'Your message' })
    const send = screen.getByRole('button', { name: 'Send' })
    expect(send).toBeDisabled()
    await userEvent.type(box, 'Hello there{Enter}')
    expect((await within(log()).findAllByText('You asked: Hello there')).length).toBeGreaterThan(0)
    expect(box).toHaveValue('')
    expect(send).toBeDisabled()
  })

  it('shows that it is thinking while waiting for an answer', async () => {
    let finish: (text: string) => void = () => {}
    const slow: AiClient = { reply: () => new Promise((resolve) => (finish = resolve)) }
    renderPanel(slow)
    await userEvent.click(screen.getByRole('button', { name: 'Summarize this week' }))
    expect(await screen.findByText('Assistant is thinking…')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
    finish('Here you go.')
    expect((await within(log()).findAllByText('Here you go.')).length).toBeGreaterThan(0)
    expect(screen.queryByText('Assistant is thinking…')).not.toBeInTheDocument()
  })

  it('says sorry when the answer fails, and keeps working', async () => {
    const broken: AiClient = {
      reply: async () => {
        throw new Error('offline')
      },
    }
    renderPanel(broken)
    await userEvent.type(screen.getByRole('textbox', { name: 'Your message' }), 'Hi{Enter}')
    expect((await within(log()).findAllByText(/something went wrong/)).length).toBeGreaterThan(0)
    expect(screen.getByRole('textbox', { name: 'Your message' })).toBeEnabled()
  })

  it('starts a new conversation on request', async () => {
    renderPanel()
    await userEvent.click(screen.getByRole('button', { name: 'What sold best?' }))
    await within(log()).findAllByText('You asked: What sold best?')
    await userEvent.click(screen.getByRole('button', { name: 'Start a new conversation' }))
    expect(within(log()).queryByText('What sold best?')).not.toBeInTheDocument()
  })
})

describe('assistant in the app', () => {
  it('opens from the top bar and gives a real answer from the sample data', async () => {
    localStorage.clear()
    window.history.pushState({}, '', '/')
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Open assistant' }))
    const panel = await screen.findByRole('dialog', { name: 'Assistant' })
    await userEvent.click(
      within(panel).getByRole('button', { name: 'Which products are low on stock?' }),
    )
    expect(
      await within(panel).findAllByText(/Brass lantern/, {}, { timeout: 3000 }),
    ).not.toHaveLength(0)
  })

  it('opens from the command palette and keeps the conversation after closing', async () => {
    localStorage.clear()
    window.history.pushState({}, '', '/')
    render(<App />)
    await userEvent.keyboard('{Control>}k{/Control}')
    await userEvent.keyboard('assistant{Enter}')
    const panel = await screen.findByRole('dialog', { name: 'Assistant' })
    await userEvent.click(within(panel).getByRole('button', { name: 'What sold best?' }))
    await within(panel).findAllByText(/best sellers/, {}, { timeout: 3000 })
    await userEvent.click(within(panel).getByRole('button', { name: 'Close' }))
    await userEvent.click(screen.getByRole('button', { name: 'Open assistant' }))
    const again = await screen.findByRole('dialog', { name: 'Assistant' })
    expect(within(again).getAllByText(/best sellers/).length).toBeGreaterThan(0)
  })
})
