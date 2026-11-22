/** At or below this number, a product counts as low on stock. */
export const LOW_STOCK_LIMIT = 10

export type StockLevel = 'out' | 'low' | 'ok'

export function stockLevel(stock: number): StockLevel {
  if (stock <= 0) return 'out'
  return stock <= LOW_STOCK_LIMIT ? 'low' : 'ok'
}
