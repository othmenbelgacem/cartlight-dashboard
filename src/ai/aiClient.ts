import { answerFor } from './scriptedAnswers'

export type AiMessage = { role: 'user' | 'assistant'; content: string }

/** Anything that can answer a conversation. The panel only needs this one function. */
export type AiClient = {
  reply: (history: AiMessage[]) => Promise<string>
}

/** Answers from the sample data, after a short pause so it feels like thinking. It never uses the network. */
export function createScriptedClient(options: { delayMs?: number } = {}): AiClient {
  const delayMs = options.delayMs ?? 600
  return {
    async reply(history) {
      const question =
        [...history].reverse().find((message) => message.role === 'user')?.content ?? ''
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      return answerFor(question)
    },
  }
}

/**
 * The assistant the app uses. This is the ONE place to connect your own AI service.
 *
 * Replace the line below with a client of your own. It receives the whole conversation and
 * returns the text of the next answer. Call YOUR OWN server from here, and keep any API key on
 * that server. Never put a secret key in code that runs in the browser.
 *
 * Example (not active):
 *
 *   export const aiClient: AiClient = {
 *     async reply(history) {
 *       const response = await fetch('/api/assistant', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify({ messages: history }),
 *       })
 *       const data = await response.json()
 *       return data.text
 *     },
 *   }
 */
export const aiClient: AiClient = createScriptedClient()
