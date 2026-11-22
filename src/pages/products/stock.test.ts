import { describe, expect, it } from 'vitest'
import { LOW_STOCK_LIMIT, stockLevel } from './stock'

describe('stock levels', () => {
  it('calls zero out of stock', () => {
    expect(stockLevel(0)).toBe('out')
  })

  it('calls the last few low, up to and including the limit', () => {
    expect(stockLevel(1)).toBe('low')
    expect(stockLevel(LOW_STOCK_LIMIT)).toBe('low')
  })

  it('calls anything above the limit fine', () => {
    expect(stockLevel(LOW_STOCK_LIMIT + 1)).toBe('ok')
  })
})
