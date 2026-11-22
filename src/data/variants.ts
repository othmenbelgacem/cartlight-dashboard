import type { Product } from './types'

export type ProductVariant = { sku: string; option: string; price: number; stock: number }

// Each category sells in a few versions. `factor` scales the price, `share` splits the stock.
const OPTIONS: Record<
  Product['category'],
  Array<{ option: string; factor: number; share: number }>
> = {
  Kitchen: [
    { option: 'Standard', factor: 1, share: 0.6 },
    { option: 'Large', factor: 1.25, share: 0.4 },
  ],
  Home: [
    { option: 'Small', factor: 0.85, share: 0.3 },
    { option: 'Medium', factor: 1, share: 0.45 },
    { option: 'Large', factor: 1.2, share: 0.25 },
  ],
  Beauty: [
    { option: 'Travel size', factor: 0.6, share: 0.35 },
    { option: 'Standard', factor: 1, share: 0.65 },
  ],
  Food: [
    { option: 'Single', factor: 1, share: 0.55 },
    { option: 'Pack of 3', factor: 2.7, share: 0.45 },
  ],
  Fashion: [
    { option: 'Sand', factor: 1, share: 0.4 },
    { option: 'Olive', factor: 1, share: 0.35 },
    { option: 'Ink', factor: 1, share: 0.25 },
  ],
}

/** The versions of a product. Their stock always adds up to the product's stock. */
export function variantsFor(product: Product): ProductVariant[] {
  const options = OPTIONS[product.category]
  let remaining = Math.max(0, product.stock)

  return options.map(({ option, factor, share }, index) => {
    const isLast = index === options.length - 1
    const stock = isLast ? remaining : Math.floor(product.stock * share)
    remaining -= stock
    return {
      sku: `${product.id.toUpperCase()}-${index + 1}`,
      option,
      price: Math.round(product.price * factor * 1000) / 1000,
      stock,
    }
  })
}
