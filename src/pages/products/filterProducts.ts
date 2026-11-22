import type { Product, ProductStatus } from '../../data/types'
import { stockLevel, type StockLevel } from './stock'

export type ProductFilters = {
  query: string
  category: Product['category'] | 'all'
  status: ProductStatus | 'all'
  stock: StockLevel | 'all'
}

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  query: '',
  category: 'all',
  status: 'all',
  stock: 'all',
}

/** Keeps the products that match the search text, category, status and stock level. */
export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const needle = filters.query.trim().toLowerCase()
  return products.filter((product) => {
    if (filters.category !== 'all' && product.category !== filters.category) return false
    if (filters.status !== 'all' && product.status !== filters.status) return false
    if (filters.stock !== 'all' && stockLevel(product.stock) !== filters.stock) return false
    if (needle && !`${product.name} ${product.category}`.toLowerCase().includes(needle))
      return false
    return true
  })
}
