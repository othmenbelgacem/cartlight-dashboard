import { useState } from 'react'
import { LayoutGrid, List, SearchX } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DataTable, type Column } from '../components/ui/DataTable'
import { Input, Select } from '../components/ui/fields'
import { EmptyState } from '../components/ui/States'
import { products } from '../data'
import type { Product, ProductStatus } from '../data/types'
import { formatTnd } from '../lib/format'
import { ProductArt } from './products/ProductArt'
import { ProductStatusBadge, StockMeter } from './products/ProductParts'
import {
  DEFAULT_PRODUCT_FILTERS,
  filterProducts,
  type ProductFilters,
} from './products/filterProducts'
import { stockLevel, type StockLevel } from './products/stock'

const VIEWS = [
  { id: 'grid', label: 'Grid', Icon: LayoutGrid },
  { id: 'list', label: 'List', Icon: List },
] as const

const CATEGORIES: Product['category'][] = ['Kitchen', 'Home', 'Beauty', 'Food', 'Fashion']

function ProductCard({ product }: { product: Product }) {
  const headingId = `product-${product.id}`
  return (
    <li>
      <article
        aria-labelledby={headingId}
        className="overflow-hidden rounded-tile border border-line bg-surface shadow-[0_14px_28px_-20px_color-mix(in_oklab,var(--fg)_35%,transparent)]"
      >
        <ProductArt product={product} />
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            <Badge>{product.category}</Badge>
            <ProductStatusBadge status={product.status} />
          </div>
          <h2 id={headingId} className="mt-3 font-display text-lg font-bold">
            {product.name}
          </h2>
          <p className="mt-1 font-medium tabular-nums">{formatTnd(product.price)}</p>
          <div className="mt-3">
            <StockMeter stock={product.stock} />
          </div>
        </div>
      </article>
    </li>
  )
}

export default function Products() {
  const [params, setParams] = useSearchParams()
  const view = params.get('view') === 'list' ? 'list' : 'grid'
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_PRODUCT_FILTERS)

  const visible = filterProducts(products, filters)
  const low = products.filter((product) => stockLevel(product.stock) === 'low').length
  const out = products.filter((product) => stockLevel(product.stock) === 'out').length
  const filtersActive =
    filters.query !== '' ||
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.stock !== 'all'

  const columns: Column<Product>[] = [
    {
      id: 'name',
      header: 'Product',
      cell: (product) => (
        <span className="flex items-center gap-3">
          <span className="w-14 shrink-0 overflow-hidden rounded-lg">
            <ProductArt product={product} />
          </span>
          <span className="font-medium">{product.name}</span>
        </span>
      ),
      sortBy: (product) => product.name,
    },
    {
      id: 'category',
      header: 'Category',
      cell: (product) => product.category,
      sortBy: (product) => product.category,
    },
    {
      id: 'price',
      header: 'Price',
      cell: (product) => formatTnd(product.price),
      sortBy: (product) => product.price,
      numeric: true,
    },
    {
      id: 'stock',
      header: 'Stock',
      cell: (product) => (
        <div className="min-w-32">
          <StockMeter stock={product.stock} />
        </div>
      ),
      sortBy: (product) => product.stock,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (product) => <ProductStatusBadge status={product.status} />,
      sortBy: (product) => product.status,
    },
  ]

  const empty = (
    <EmptyState
      icon={<SearchX size={24} />}
      headingLevel={2}
      title="No products match"
      description="Try a different search, or clear the filters."
      action={
        <Button variant="secondary" onClick={() => setFilters(DEFAULT_PRODUCT_FILTERS)}>
          Clear filters
        </Button>
      }
    />
  )

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Products</h1>
          <p className="mt-2 max-w-xl text-muted">
            {products.length} products, {low} low on stock, {out} out of stock.
          </p>
        </div>
        <div
          role="group"
          aria-label="View"
          className="flex rounded-full border border-line bg-surface p-0.5"
        >
          {VIEWS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setParams(id === 'list' ? { view: 'list' } : {}, { replace: true })}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                view === id ? 'bg-accent text-on-accent' : 'text-muted hover:text-fg'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <Card className="mt-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto] lg:items-end">
          <Input
            label="Search products"
            type="search"
            placeholder="Name or category"
            value={filters.query}
            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
          />
          <Select
            label="Category"
            value={filters.category}
            onChange={(event) =>
              setFilters({ ...filters, category: event.target.value as ProductFilters['category'] })
            }
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Select
            label="Status"
            value={filters.status}
            onChange={(event) =>
              setFilters({ ...filters, status: event.target.value as ProductStatus | 'all' })
            }
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </Select>
          <Select
            label="Stock"
            value={filters.stock}
            onChange={(event) =>
              setFilters({ ...filters, stock: event.target.value as StockLevel | 'all' })
            }
          >
            <option value="all">Any stock</option>
            <option value="ok">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </Select>
          <Button
            variant="ghost"
            disabled={!filtersActive}
            onClick={() => setFilters(DEFAULT_PRODUCT_FILTERS)}
          >
            Clear filters
          </Button>
        </div>

        <div className="mt-6">
          {view === 'grid' ? (
            visible.length === 0 ? (
              empty
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ul>
            )
          ) : (
            <DataTable
              caption="Products"
              columns={columns}
              rows={visible}
              getRowId={(product) => product.id}
              pageSize={8}
              empty={empty}
            />
          )}
        </div>
      </Card>
    </div>
  )
}
