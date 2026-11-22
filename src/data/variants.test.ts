import { describe, expect, it } from 'vitest'
import { products } from '.'
import { variantsFor } from './variants'

describe('product variants', () => {
  it('splits the stock without losing or inventing items', () => {
    for (const product of products) {
      const total = variantsFor(product).reduce((sum, variant) => sum + variant.stock, 0)
      expect(total, product.name).toBe(product.stock)
    }
  })

  it('gives every variant a unique code and a positive price', () => {
    const codes = products.flatMap((product) => variantsFor(product).map((variant) => variant.sku))
    expect(new Set(codes).size).toBe(codes.length)
    for (const product of products) {
      expect(variantsFor(product).every((variant) => variant.price > 0)).toBe(true)
    }
  })

  it('has no stock in any variant when the product is out of stock', () => {
    const lantern = products.find((product) => product.stock === 0)!
    expect(variantsFor(lantern).every((variant) => variant.stock === 0)).toBe(true)
  })
})
