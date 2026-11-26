import { describe, expect, it } from 'vitest'
import { customerRows } from '../data/customerStats'
import { season, topProducts } from '../data/stats'
import { formatTnd } from '../lib/format'
import { FALLBACK_ANSWER, SUGGESTIONS, answerFor } from './scriptedAnswers'

// A fixed day, so the "days left" in the answers never changes between test runs.
const NOW = new Date(2026, 10, 25, 12, 0, 0)

describe('scripted answers', () => {
  it('answers every suggested question with something real, not the fallback', () => {
    for (const question of SUGGESTIONS) {
      expect(answerFor(question, NOW), question).not.toBe(FALLBACK_ANSWER)
    }
  })

  it('names the best sellers in order', () => {
    const answer = answerFor('What sold best?', NOW)
    expect(answer).toContain(`1. ${topProducts[0].name}`)
    expect(answer).toContain(formatTnd(topProducts[0].revenue))
    expect(answer.indexOf(topProducts[0].name)).toBeLessThan(answer.indexOf(topProducts[1].name))
  })

  it('reports the season goal and the daily target from the same numbers as the Overview', () => {
    const answer = answerFor('How is the season goal going?', NOW)
    expect(answer).toContain(`${season.percent}%`)
    expect(answer).toContain(formatTnd(season.sold))
    expect(answer).toContain('With 30 days left')
  })

  it('lists the products that are low or out of stock', () => {
    const answer = answerFor('Which products are low on stock?', NOW)
    expect(answer).toContain('Brass lantern')
    expect(answer).toContain('Argan oil, 100 ml (7 left)')
  })

  it('lists every customer at risk, and nobody else', () => {
    const answer = answerFor('Which customers are at risk?', NOW)
    for (const row of customerRows) {
      if (row.segment === 'at-risk') expect(answer).toContain(row.name)
      else expect(answer).not.toContain(row.name)
    }
  })

  it('counts the orders that still need work', () => {
    const answer = answerFor('How many orders are waiting to ship?', NOW)
    expect(answer).toMatch(/\d+ orders still need work/)
    expect(answer).toContain('#1042')
  })

  it('summarizes the week with the change against the week before', () => {
    const answer = answerFor('Summarize this week', NOW)
    expect(answer).toContain('The last 7 days')
    expect(answer).toMatch(/visitors \([+−]/)
  })

  it('picks the topic from the words, so "best this week" is about sales, not the weekly summary', () => {
    expect(answerFor('What sold best this week?', NOW)).toContain('best sellers')
  })

  it('admits what it does not know', () => {
    expect(answerFor('What is the meaning of life?', NOW)).toBe(FALLBACK_ANSWER)
    expect(answerFor('', NOW)).toBe(FALLBACK_ANSWER)
  })
})
