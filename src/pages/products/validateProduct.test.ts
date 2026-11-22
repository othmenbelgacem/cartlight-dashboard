import { describe, expect, it } from 'vitest'
import {
  EMPTY_VALUES,
  parseProduct,
  toFormValues,
  validateProduct,
  type ProductFormValues,
} from './validateProduct'

const valid: ProductFormValues = {
  name: 'Olive wood spoon',
  category: 'Kitchen',
  price: '12.500',
  stock: '8',
  status: 'active',
  description: '',
}

describe('validateProduct', () => {
  it('accepts a complete, correct form', () => {
    expect(validateProduct(valid)).toEqual({})
  })

  it('asks for every required field on an empty form', () => {
    const errors = validateProduct(EMPTY_VALUES)
    expect(errors.name).toBe('Enter a product name.')
    expect(errors.price).toBe('Enter a price.')
    expect(errors.stock).toBeUndefined()
  })

  it('checks the name length', () => {
    expect(validateProduct({ ...valid, name: 'ab' }).name).toBe('Use at least 3 characters.')
    expect(validateProduct({ ...valid, name: 'a'.repeat(61) }).name).toMatch(/60 characters/)
    expect(validateProduct({ ...valid, name: '  ab  ' }).name).toBeDefined()
  })

  it('checks the price', () => {
    expect(validateProduct({ ...valid, price: 'abc' }).price).toMatch(/number/)
    expect(validateProduct({ ...valid, price: '0' }).price).toBe('The price must be more than 0.')
    expect(validateProduct({ ...valid, price: '-4' }).price).toBe('The price must be more than 0.')
    expect(validateProduct({ ...valid, price: '1.2345' }).price).toBe('Use at most 3 decimals.')
    expect(validateProduct({ ...valid, price: '100001' }).price).toMatch(/100,000/)
    expect(validateProduct({ ...valid, price: '19' }).price).toBeUndefined()
  })

  it('checks the stock', () => {
    expect(validateProduct({ ...valid, stock: '' }).stock).toBe('Enter the stock.')
    expect(validateProduct({ ...valid, stock: '2.5' }).stock).toBe('Use a whole number.')
    expect(validateProduct({ ...valid, stock: '-1' }).stock).toBe('Stock cannot be negative.')
    expect(validateProduct({ ...valid, stock: '0' }).stock).toBeUndefined()
  })

  it('limits the description', () => {
    expect(validateProduct({ ...valid, description: 'x'.repeat(201) }).description).toMatch(/200/)
  })
})

describe('parseProduct', () => {
  it('turns a valid form into a product and back', () => {
    const product = parseProduct(
      { ...valid, name: '  Olive wood spoon ', description: ' Hand made ' },
      'p-13',
    )
    expect(product).toEqual({
      id: 'p-13',
      name: 'Olive wood spoon',
      category: 'Kitchen',
      price: 12.5,
      stock: 8,
      status: 'active',
      description: 'Hand made',
    })
    expect(toFormValues(product)).toMatchObject({
      name: 'Olive wood spoon',
      price: '12.5',
      stock: '8',
    })
  })

  it('leaves the description out when it is empty', () => {
    expect(parseProduct(valid, 'p-13')).not.toHaveProperty('description')
  })
})
