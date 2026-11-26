import { orders, products } from '../data'
import { reportFor, changeBetween } from '../data/analytics'
import { customerRows } from '../data/customerStats'
import { SEASON_END, season, topProducts } from '../data/stats'
import { formatCount, formatPercent, formatRate, formatShortDate, formatTnd } from '../lib/format'
import { stockLevel } from '../pages/products/stock'

const DAY = 86_400_000

/** What to say when the question is not about anything the demo knows. */
export const FALLBACK_ANSWER =
  'I can answer questions about sales, orders, products, customers and the season goal. Pick one of the suggestions, or ask about one of those.'

function bestSellers() {
  const lines = topProducts.map(
    (product, index) =>
      `${index + 1}. ${product.name}: ${formatTnd(product.revenue)}, ${product.units} sold`,
  )
  return `Your best sellers over the last 30 days:\n${lines.join('\n')}`
}

function seasonProgress(now: Date) {
  const daysLeft = Math.max(1, Math.ceil((SEASON_END.getTime() - now.getTime()) / DAY))
  const perDay = Math.max(0, season.goal - season.sold) / daysLeft
  return (
    `You have sold ${formatTnd(season.sold)} of the ${formatTnd(season.goal)} Christmas goal (${season.percent}%).\n` +
    `With ${daysLeft} days left, you need about ${formatTnd(perDay)} a day to reach it.\n` +
    `Your best day so far was ${formatShortDate(season.bestDay.date)}, with ${formatTnd(season.bestDay.revenue)}.`
  )
}

function lowStock() {
  const out = products.filter((product) => stockLevel(product.stock) === 'out')
  const low = products.filter((product) => stockLevel(product.stock) === 'low')
  if (out.length === 0 && low.length === 0) return 'Every product has plenty of stock.'
  const parts: string[] = []
  if (out.length > 0) parts.push(`Out of stock: ${out.map((product) => product.name).join(', ')}.`)
  if (low.length > 0) {
    parts.push(
      `Running low: ${low.map((product) => `${product.name} (${product.stock} left)`).join(', ')}.`,
    )
  }
  return `${parts.join('\n')}\nIt is worth reordering these before the Christmas rush.`
}

function atRiskCustomers() {
  const atRisk = customerRows.filter((row) => row.segment === 'at-risk')
  if (atRisk.length === 0) return 'No customer is at risk right now.'
  const lines = atRisk.map(
    (row) =>
      `${row.name}: no order for ${row.daysSinceLastOrder ?? 'many'} days, ${formatTnd(row.spent)} spent`,
  )
  return `${atRisk.length} customers have not ordered for a while:\n${lines.join('\n')}\nA small discount message could bring them back.`
}

function waitingOrders() {
  const fresh = orders.filter((order) => order.status === 'new')
  const packed = orders.filter((order) => order.status === 'packed')
  const ids = (list: typeof orders) => list.map((order) => order.id).join(', ') || 'none'
  return (
    `${fresh.length + packed.length} orders still need work.\n` +
    `New (${fresh.length}): ${ids(fresh)}\n` +
    `Packed, ready to ship (${packed.length}): ${ids(packed)}`
  )
}

function weekSummary() {
  const { stats, previous } = reportFor(7)
  const change = (now: number, before: number | undefined) => {
    const value = changeBetween(now, before)
    return value === null ? '' : ` (${formatPercent(value)} vs the week before)`
  }
  return (
    `The last 7 days:\n` +
    `${formatCount(stats.visits)} visitors${change(stats.visits, previous?.visits)}\n` +
    `${stats.orders} orders${change(stats.orders, previous?.orders)}\n` +
    `${formatTnd(stats.revenue)} in revenue${change(stats.revenue, previous?.revenue)}\n` +
    `Conversion rate: ${formatRate(stats.conversion)}`
  )
}

// The first topic whose words appear in the question wins, so the order matters.
const TOPICS: Array<{ words: RegExp; answer: (now: Date) => string }> = [
  { words: /stock|inventory|running out|reorder/i, answer: lowStock },
  { words: /risk|churn|win back|come back|lost customer/i, answer: atRiskCustomers },
  { words: /season|goal|christmas|target/i, answer: seasonProgress },
  { words: /best|top|sold|sell|popular/i, answer: bestSellers },
  { words: /ship|pending|waiting|pack|fulfil|deliver/i, answer: waitingOrders },
  { words: /week|summar|visitor|traffic|conversion|how .*doing/i, answer: weekSummary },
]

/** Looks at the question and answers it from the sample data. No network, no AI. */
export function answerFor(question: string, now: Date = new Date()): string {
  const topic = TOPICS.find(({ words }) => words.test(question))
  return topic ? topic.answer(now) : FALLBACK_ANSWER
}

/** The questions shown as buttons. Each one is answered by a topic above. */
export const SUGGESTIONS = [
  'What sold best?',
  'How is the season goal going?',
  'Which products are low on stock?',
  'Which customers are at risk?',
  'How many orders are waiting to ship?',
  'Summarize this week',
]
