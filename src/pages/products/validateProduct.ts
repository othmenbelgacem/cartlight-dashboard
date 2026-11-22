import type { Product, ProductStatus } from '../../data/types'

/** What the form holds while someone types. Numbers stay as text until the form is valid. */
export type ProductFormValues = {
  name: string
  category: Product['category']
  price: string
  stock: string
  status: ProductStatus
  description: string
}

export type ProductField = 'name' | 'price' | 'stock' | 'description'
export type ProductErrors = Partial<Record<ProductField, string>>

/** The order of the fields on screen, so the first mistake can get the keyboard focus. */
export const FIELD_ORDER: ProductField[] = ['name', 'price', 'stock', 'description']

export const FIELD_LABELS: Record<ProductField, string> = {
  name: 'Name',
  price: 'Price',
  stock: 'Stock',
  description: 'Description',
}

export const NAME_MAX = 60
export const DESCRIPTION_MAX = 200

export const EMPTY_VALUES: ProductFormValues = {
  name: '',
  category: 'Home',
  price: '',
  stock: '0',
  status: 'draft',
  description: '',
}

export function toFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    category: product.category,
    price: String(product.price),
    stock: String(product.stock),
    status: product.status,
    description: product.description ?? '',
  }
}

/** Checks the form and returns a plain-language message for every field that needs fixing. */
export function validateProduct(values: ProductFormValues): ProductErrors {
  const errors: ProductErrors = {}

  const name = values.name.trim()
  if (name === '') errors.name = 'Enter a product name.'
  else if (name.length < 3) errors.name = 'Use at least 3 characters.'
  else if (name.length > NAME_MAX) errors.name = `Use ${NAME_MAX} characters or fewer.`

  const priceText = values.price.trim()
  const price = Number(priceText)
  if (priceText === '') errors.price = 'Enter a price.'
  else if (Number.isNaN(price)) errors.price = 'Enter a number, for example 24.500.'
  else if (price <= 0) errors.price = 'The price must be more than 0.'
  else if (price > 100000) errors.price = 'The price must be 100,000 or less.'
  else if (!/^\d+(\.\d{1,3})?$/.test(priceText)) errors.price = 'Use at most 3 decimals.'

  const stockText = values.stock.trim()
  const stock = Number(stockText)
  if (stockText === '') errors.stock = 'Enter the stock.'
  else if (Number.isNaN(stock) || !Number.isInteger(stock)) errors.stock = 'Use a whole number.'
  else if (stock < 0) errors.stock = 'Stock cannot be negative.'

  if (values.description.length > DESCRIPTION_MAX) {
    errors.description = `Use ${DESCRIPTION_MAX} characters or fewer.`
  }

  return errors
}

/** Turns a valid form into a product. Call it only when validateProduct found no errors. */
export function parseProduct(values: ProductFormValues, id: string): Product {
  const description = values.description.trim()
  return {
    id,
    name: values.name.trim(),
    category: values.category,
    price: Math.round(Number(values.price) * 1000) / 1000,
    stock: Number(values.stock),
    status: values.status,
    ...(description ? { description } : {}),
  }
}
