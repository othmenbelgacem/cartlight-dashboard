import { customers } from './customers'
import { orders } from './orders'
import { products } from './products'

export { customers, orders, products }
export type * from './types'

export const getCustomer = (id: string) => customers.find((customer) => customer.id === id)
export const getProduct = (id: string) => products.find((product) => product.id === id)
