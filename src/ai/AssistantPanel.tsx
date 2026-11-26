import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { RotateCcw, Send } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Drawer } from '../components/ui/Overlays'
import { cx } from '../lib/cx'
import { prefersReducedMotion } from '../lib/motion'
import { aiClient, type AiClient, type AiMessage } from './aiClient'
import { SUGGESTIONS } from './scriptedAnswers'

type ChatMessage = AiMessage & { id: number; typing: boolean }

type BubbleProps = { text: string; typing: boolean; onDone: () => void }

/** An answer that appears letter by letter. Screen readers get the whole text at once. */
function AssistantBubble({ text, typing, onDone }: BubbleProps) {
  const [length, setLength] = useState(() => (typing && !prefersReducedMotion() ? 0 : text.length))

  useEffect(() => {
    if (length >= text.length) {
      if (typing) onDone()
      return
    }
    const timer = window.setTimeout(
      () => setLength((value) => Math.min(text.length, value + 3)),
      16,
    )
    return () => window.clearTimeout(timer)
  }, [length, text, typing, onDone])

  return (
    <p className="me-auto max-w-[92%] rounded-2xl rounded-es-md border border-line bg-raised px-4 py-2.5 text-sm whitespace-pre-line">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, length)}</span>
    </p>
  )
}

type AssistantPanelProps = {
  open: boolean
  onClose: () => void
  /** Who answers. Defaults to the client in aiClient.ts. */
  client?: AiClient
  /** Set to false to show answers at once instead of typing them out. */
  typewriter?: boolean
}

/** A chat drawer for asking questions about the shop. */
export default function AssistantPanel({
  open,
  onClose,
  client = aiClient,
  typewriter = true,
}: AssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const nextId = useRef(1)
  const endRef = useRef<HTMLDivElement>(null)
  const inputId = useId()

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: 'end' })
  }, [messages, pending])

  async function send(text: string) {
    const question = text.trim()
    if (question === '' || pending) return
    const asked: ChatMessage = {
      id: nextId.current++,
      role: 'user',
      content: question,
      typing: false,
    }
    const history = [...messages, asked]
    setMessages(history)
    setDraft('')
    setPending(true)
    try {
      const answer = await client.reply(history.map(({ role, content }) => ({ role, content })))
      setMessages((list) => [
        ...list,
        { id: nextId.current++, role: 'assistant', content: answer, typing: typewriter },
      ])
    } catch {
      setMessages((list) => [
        ...list,
        {
          id: nextId.current++,
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          typing: false,
        },
      ])
    } finally {
      setPending(false)
    }
  }

  function finishTyping(id: number) {
    setMessages((list) =>
      list.map((message) => (message.id === id ? { ...message, typing: false } : message)),
    )
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    void send(draft)
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Assistant"
      footer={
        <form onSubmit={submit} className="flex w-full items-center gap-2">
          <label htmlFor={inputId} className="sr-only">
            Your message
          </label>
          <input
            id={inputId}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about your shop…"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-xl border border-control bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted"
          />
          <Button type="submit" disabled={pending || draft.trim() === ''}>
            <Send size={16} className="rtl:-scale-x-100" />
            Send
          </Button>
        </form>
      }
    >
      <div className="grid gap-5">
        <p className="rounded-xl border border-line bg-raised p-3 text-sm text-muted">
          Demo assistant: it answers from the sample data. To connect your own AI service, edit{' '}
          <code className="font-mono text-fg">src/ai/aiClient.ts</code>.
        </p>

        <div role="log" aria-label="Conversation" className="grid gap-3">
          {messages.length === 0 && (
            <p className="text-sm text-muted">
              Ask about sales, orders, products or customers. Pick a question below to start.
            </p>
          )}
          {messages.map((message) =>
            message.role === 'user' ? (
              <p
                key={message.id}
                className="ms-auto max-w-[85%] rounded-2xl rounded-ee-md bg-accent px-4 py-2.5 text-sm text-on-accent"
              >
                {message.content}
              </p>
            ) : (
              <AssistantBubble
                key={message.id}
                text={message.content}
                typing={message.typing}
                onDone={() => finishTyping(message.id)}
              />
            ),
          )}
        </div>

        {pending && (
          <p role="status" className="text-sm text-muted">
            Assistant is thinking…
          </p>
        )}

        <div>
          <p className="text-sm font-medium">Suggested questions</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((question) => (
              <li key={question}>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => void send(question)}
                  className={cx(
                    'rounded-full border border-line bg-surface px-3 py-1.5 text-start text-sm transition-colors hover:bg-raised',
                    'disabled:pointer-events-none disabled:opacity-50',
                  )}
                >
                  {question}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {messages.length > 0 && (
          <div>
            <Button variant="ghost" size="sm" disabled={pending} onClick={() => setMessages([])}>
              <RotateCcw size={14} />
              Start a new conversation
            </Button>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </Drawer>
  )
}
