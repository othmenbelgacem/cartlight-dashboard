import { describe, expect, it } from 'vitest'
import { products } from '../../data'
import { DEFAULT_PRODUCT_FILTERS, filterProducts } from './filterProducts'

describe('filterProducts', () => {
  it('returns everything when no filter is set', () => {
    expect(filterProducts(products, DEFAULT_PRODUCT_FILTERS)).toHaveLength(products.length)
  })

  it('searches the name and the category, ignoring case', () => {
    const byName = filterProducts(products, { ...DEFAULT_PRODUCT_FILTERS, query: 'LANTERN' })
    expect(byName.map((product) => product.name)).toEqual(['Brass lantern'])
    const byCategory = filterProducts(products, { ...DEFAULT_PRODUCT_FILTERS, query: 'beauty' })
    expect(byCategory.every((product) => product.category === 'Beauty')).toBe(true)
  })

  it('filters by category, status and stock level', () => {
    const food = filterProducts(products, { ...DEFAULT_PRODUCT_FILTERS, category: 'Food' })
    expect(food.length).toBeGreaterThan(0)
    expect(food.every((product) => product.category === 'Food')).toBe(true)

    const drafts = filterProducts(products, { ...DEFAULT_PRODUCT_FILTERS, status: 'draft' })
    expect(drafts.every((product) => product.status === 'draft')).toBe(true)

    const low = filterProducts(products, { ...DEFAULT_PRODUCT_FILTERS, stock: 'low' })
    expect(low.map((product) => product.name).sort()).toEqual([
      'Argan oil, 100 ml',
      'Rose water, 250 ml',
    ])

    const out = filterProducts(products, { ...DEFAULT_PRODUCT_FILTERS, stock: 'out' })
    expect(out.map((product) => product.name)).toEqual(['Brass lantern'])
  })
})
