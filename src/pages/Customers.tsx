import { useState } from 'react'
import { SearchX } from 'lucide-react'
import { Link } from 'react-router'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DataTable, type Column } from '../components/ui/DataTable'
import { Input } from '../components/ui/fields'
import { EmptyState } from '../components/ui/States'
import { SEGMENT_HELP, SEGMENT_LABEL, customerRows, type CustomerRow } from '../data/customerStats'
import { formatShortDate, formatTnd } from '../lib/format'
import { SegmentBadge } from './customers/SegmentBadge'
import { filterCustomers, type SegmentFilter } from './customers/filterCustomers'

const SEGMENTS: SegmentFilter[] = ['all', 'new', 'loyal', 'at-risk']

const columns: Column<CustomerRow>[] = [
  {
    id: 'name',
    header: 'Customer',
    cell: (row) => (
      <span className="flex items-center gap-3">
        <Avatar name={row.name} size="sm" />
        <span className="min-w-0">
          <Link
            to={`/customers/${row.id}`}
            className="font-medium text-link underline-offset-4 hover:underline"
          >
            {row.name}
          </Link>
          <span className="block truncate text-xs text-muted">{row.email}</span>
        </span>
      </span>
    ),
    sortBy: (row) => row.name,
  },
  { id: 'city', header: 'City', cell: (row) => row.city, sortBy: (row) => row.city },
  {
    id: 'segment',
    header: 'Segment',
    cell: (row) => <SegmentBadge segment={row.segment} />,
    sortBy: (row) => row.segment,
  },
  {
    id: 'orders',
    header: 'Orders',
    cell: (row) => row.orders,
    sortBy: (row) => row.orders,
    numeric: true,
  },
  {
    id: 'spent',
    header: 'Spent',
    cell: (row) => formatTnd(row.spent),
    sortBy: (row) => row.spent,
    numeric: true,
  },
  {
    id: 'last',
    header: 'Last order',
    cell: (row) => (row.lastOrder ? formatShortDate(row.lastOrder) : '—'),
    sortBy: (row) => row.lastOrder ?? '',
  },
]

export default function Customers() {
  const [query, setQuery] = useState('')
  const [segment, setSegment] = useState<SegmentFilter>('all')

  const visible = filterCustomers(customerRows, query, segment)
  const count = (id: SegmentFilter) =>
    id === 'all' ? customerRows.length : customerRows.filter((row) => row.segment === id).length

  return (
    <div>
      <h1 className="font-display text-4xl font-bold tracking-tight">Customers</h1>
      <p className="mt-2 max-w-xl text-muted">
        Everyone who has ordered, grouped by how they are doing. Open a customer to see their
        orders.
      </p>

      <div
        role="group"
        aria-label="Segment"
        className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {SEGMENTS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={segment === id}
            onClick={() => setSegment(id)}
            className={`rounded-2xl border border-line bg-surface p-4 text-start transition-shadow ${
              segment === id ? 'ring-2 ring-link' : 'hover:bg-raised'
            }`}
          >
            <span className="block font-display text-3xl font-bold tabular-nums">{count(id)}</span>
            <span className="block text-sm font-medium">
              {id === 'all' ? 'All customers' : SEGMENT_LABEL[id]}
            </span>
            <span className="block text-xs text-muted">
              {id === 'all' ? 'Everyone' : SEGMENT_HELP[id]}
            </span>
          </button>
        ))}
      </div>

      <Card className="mt-6">
        <Input
          label="Search customers"
          type="search"
          placeholder="Name, email or city"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-md"
        />
        <div className="mt-6">
          <DataTable
            caption="Customers"
            columns={columns}
            rows={visible}
            getRowId={(row) => row.id}
            pageSize={8}
            empty={
              <EmptyState
                icon={<SearchX size={24} />}
                headingLevel={2}
                title="No customers match"
                description="Try a different search, or show everyone."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuery('')
                      setSegment('all')
                    }}
                  >
                    Show all customers
                  </Button>
                }
              />
            }
          />
        </div>
      </Card>
    </div>
  )
}
