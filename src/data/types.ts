export type ProductStatus = 'active' | 'draft' | 'archived'

export type Product = {
  id: string
  name: string
  category: 'Kitchen' | 'Home' | 'Beauty' | 'Food' | 'Fashion'
  /** Price in Tunisian dinar (TND). */
  price: number
  stock: number
  status: ProductStatus
}

export type CustomerSegment = 'new' | 'loyal' | 'at-risk'

export type Customer = {
  id: string
  name: string
  email: string
  city: string
  segment: CustomerSegment
  /** ISO date, for example 2026-03-14. */
  joined: string
}

export type OrderStatus = 'new' | 'packed' | 'shipped' | 'delivered' | 'cancelled'

export type OrderItem = { productId: string; quantity: number }

export type Order = {
  id: string
  customerId: string
  items: OrderItem[]
  status: OrderStatus
  /** ISO date, for example 2026-11-18. */
  date: string
  /** Sum of price × quantity for all items, in TND. */
  total: number
}
