import { useState } from 'react'
import { ArrowRight, ChevronDown, Copy, PackageOpen, Pencil, Plus, Trash2 } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button, IconButton } from '../components/ui/Button'
import { BentoGrid, BentoTile } from '../components/ui/Card'
import { Checkbox, Radio, Switch } from '../components/ui/Choices'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DropdownMenu } from '../components/ui/DropdownMenu'
import { Input, Select, Textarea } from '../components/ui/fields'
import { Drawer, Modal } from '../components/ui/Overlays'
import { EmptyState, Skeleton } from '../components/ui/States'
import { Tabs } from '../components/ui/Tabs'
import { useToast } from '../components/ui/toast-context'
import { Tooltip } from '../components/ui/Tooltip'

const h2 = 'font-display text-xl font-bold'

type DemoOrder = {
  id: string
  customer: string
  status: 'New' | 'Packed' | 'Shipped' | 'Cancelled'
  total: number
  date: string
}

const STATUS_TONE = {
  New: 'accent',
  Packed: 'neutral',
  Shipped: 'info',
  Cancelled: 'danger',
} as const

const ORDERS: DemoOrder[] = [
  { id: '#1042', customer: 'Amel Trabelsi', status: 'New', total: 89.5, date: '2026-11-18' },
  { id: '#1041', customer: 'Sami Gharbi', status: 'Packed', total: 142, date: '2026-11-18' },
  { id: '#1040', customer: 'Nour Haddad', status: 'Shipped', total: 36.9, date: '2026-11-17' },
  { id: '#1039', customer: 'Karim Jlassi', status: 'New', total: 215.75, date: '2026-11-17' },
  { id: '#1038', customer: 'Hela Mansouri', status: 'Shipped', total: 64, date: '2026-11-16' },
  {
    id: '#1037',
    customer: 'Bilel Ben Salah',
    status: 'Cancelled',
    total: 18.5,
    date: '2026-11-16',
  },
  { id: '#1036', customer: 'Ines Cherif', status: 'Packed', total: 120, date: '2026-11-15' },
  { id: '#1035', customer: 'Youssef Mejri', status: 'Shipped', total: 77.2, date: '2026-11-15' },
  { id: '#1034', customer: 'Rim Dridi', status: 'New', total: 305, date: '2026-11-14' },
  { id: '#1033', customer: 'Walid Sassi', status: 'Shipped', total: 49.9, date: '2026-11-14' },
  { id: '#1032', customer: 'Salma Ayari', status: 'Packed', total: 95, date: '2026-11-13' },
  { id: '#1031', customer: 'Hatem Bouzid', status: 'Shipped', total: 28, date: '2026-11-13' },
]

const COLUMNS: Column<DemoOrder>[] = [
  {
    id: 'id',
    header: 'Order',
    cell: (row) => <span className="font-medium">{row.id}</span>,
    sortBy: (row) => row.id,
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: (row) => (
      <span className="flex items-center gap-3">
        <Avatar name={row.customer} size="sm" />
        {row.customer}
      </span>
    ),
    sortBy: (row) => row.customer,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge>,
    sortBy: (row) => row.status,
  },
  { id: 'date', header: 'Date', cell: (row) => row.date, sortBy: (row) => row.date },
  {
    id: 'total',
    header: 'Total',
    cell: (row) => `${row.total.toFixed(3)} TND`,
    sortBy: (row) => row.total,
    numeric: true,
  },
]

export default function Components() {
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastAction, setLastAction] = useState('none yet')
  const toast = useToast()

  return (
    <div>
      <h1 className="font-display text-4xl font-bold tracking-tight">Components</h1>
      <p className="mt-2 max-w-xl text-muted">
        Every reusable piece, shown in the current theme and direction. This page grows with each
        slice of Sprint 1.
      </p>

      <BentoGrid className="mt-8">
        <BentoTile size="wide">
          <h2 className={h2}>Buttons</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button>
              Save changes
              <ArrowRight size={16} className="rtl:-scale-x-100" />
            </Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="ghost">Skip</Button>
            <Button variant="danger">Delete order</Button>
            <Button disabled>Disabled</Button>
            <Button size="sm">Small</Button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <IconButton label="Add product">
              <Plus size={20} />
            </IconButton>
            <IconButton label="Delete">
              <Trash2 size={20} />
            </IconButton>
            <span className="text-sm text-muted">
              Icon buttons always carry a label for screen readers.
            </span>
          </div>
        </BentoTile>

        <BentoTile size="medium">
          <h2 className={h2}>Badges and avatars</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>Draft</Badge>
            <Badge tone="accent">New</Badge>
            <Badge tone="info">Shipped</Badge>
            <Badge tone="danger">Cancelled</Badge>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Avatar name="Othmen Belgacem" size="sm" />
            <Avatar name="Amel Trabelsi" />
            <Avatar name="Sami" size="lg" />
          </div>
        </BentoTile>

        <BentoTile size="large">
          <h2 className={h2}>Form fields</h2>
          <div className="mt-4 grid gap-4">
            <Input
              label="Store name"
              placeholder="Cartlight Shop"
              hint="Shown on invoices and emails."
            />
            <Input label="Email" defaultValue="hello@" error="Enter a complete email address." />
            <Select label="Currency" defaultValue="TND">
              <option value="TND">Tunisian dinar (TND)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">US dollar (USD)</option>
            </Select>
            <Textarea label="Order note" placeholder="Anything the packer should know?" />
          </div>
        </BentoTile>

        <BentoTile size="large">
          <h2 className={h2}>Choices</h2>
          <div className="mt-4 grid gap-5">
            <div className="grid gap-3">
              <Checkbox label="Email me about new orders" defaultChecked />
              <Checkbox label="Send a weekly summary" />
            </div>
            <fieldset className="grid gap-3">
              <legend className="mb-1 text-sm font-medium">Delivery speed</legend>
              <Radio name="speed" label="Standard" defaultChecked />
              <Radio name="speed" label="Express" />
              <Radio name="speed" label="Pickup in store" />
            </fieldset>
            <div className="grid gap-3">
              <Switch label="Season mode" defaultChecked />
              <Switch label="Low stock alerts" />
            </div>
          </div>
        </BentoTile>

        <BentoTile size="large">
          <h2 className={h2}>Tooltip and menu</h2>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Tooltip label="Copies the order link">
              <Button variant="secondary">Hover or focus me</Button>
            </Tooltip>
            <DropdownMenu
              label="Order actions"
              items={[
                {
                  label: 'Edit',
                  icon: <Pencil size={16} />,
                  onSelect: () => setLastAction('Edit'),
                },
                {
                  label: 'Duplicate',
                  icon: <Copy size={16} />,
                  onSelect: () => setLastAction('Duplicate'),
                },
                {
                  label: 'Delete',
                  icon: <Trash2 size={16} />,
                  danger: true,
                  onSelect: () => setLastAction('Delete'),
                },
              ]}
            >
              Actions
              <ChevronDown size={16} />
            </DropdownMenu>
          </div>
          <p className="mt-4 text-sm text-muted">Last menu action: {lastAction}</p>
          <p className="mt-1 text-sm text-muted">
            Menu keys: arrows to move, Enter to choose, Escape to close.
          </p>
        </BentoTile>

        <BentoTile size="large">
          <h2 className={h2}>Modal and drawer</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="danger" onClick={() => setModalOpen(true)}>
              Delete order…
            </Button>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open order details
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted">
            Press Escape or click outside to close. The drawer slides in from the end side.
          </p>
        </BentoTile>

        <BentoTile size="large">
          <h2 className={h2}>Tabs</h2>
          <div className="mt-4">
            <Tabs
              label="Order sections"
              tabs={[
                {
                  id: 'items',
                  label: 'Items',
                  content: <p className="text-muted">3 items, packed in 2 boxes.</p>,
                },
                {
                  id: 'delivery',
                  label: 'Delivery',
                  content: (
                    <p className="text-muted">Express delivery to Tunis, arriving Friday.</p>
                  ),
                },
                {
                  id: 'history',
                  label: 'History',
                  content: <p className="text-muted">Created today at 09:14 by the storefront.</p>,
                },
              ]}
            />
          </div>
          <p className="mt-4 text-sm text-muted">Arrow keys move between tabs (reversed in RTL).</p>
        </BentoTile>

        <BentoTile size="large">
          <h2 className={h2}>Toasts</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() =>
                toast({ title: 'Order saved', description: 'Order #1042 was updated.' })
              }
            >
              Show a toast
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  title: 'Could not save',
                  description: 'Check your connection and try again.',
                  tone: 'danger',
                })
              }
            >
              Show an error toast
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted">
            Toasts disappear after 5 seconds and are announced to screen readers.
          </p>
        </BentoTile>

        <BentoTile size="large">
          <h2 className={h2}>Loading placeholder</h2>
          <div className="mt-4 flex items-center gap-4" role="status" aria-label="Loading">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </BentoTile>

        <BentoTile size="large">
          <h2 className={h2}>Empty state</h2>
          <EmptyState
            icon={<PackageOpen size={24} />}
            title="No orders yet"
            description="Orders show up here as soon as customers check out."
            action={<Button variant="secondary">Add a test order</Button>}
          />
        </BentoTile>

        <BentoTile size="full">
          <h2 className={h2}>Data table</h2>
          <p className="mt-1 mb-4 text-sm text-muted">
            Click a column header to sort. Select rows with the checkboxes. 12 sample orders, 5 per
            page.
          </p>
          <DataTable
            caption="Recent orders"
            columns={COLUMNS}
            rows={ORDERS}
            getRowId={(row) => row.id}
            getRowLabel={(row) => `order ${row.id}`}
            pageSize={5}
            selectable
          />
        </BentoTile>
      </BentoGrid>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete order #1042?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setModalOpen(false)}>
              Delete order
            </Button>
          </>
        }
      >
        <p className="text-muted">
          The order is removed from the pipeline and the customer is not notified. This cannot be
          undone.
        </p>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Order #1042"
        footer={<Button onClick={() => setDrawerOpen(false)}>Done</Button>}
      >
        <div className="flex items-center gap-3">
          <Avatar name="Amel Trabelsi" />
          <div>
            <p className="font-medium">Amel Trabelsi</p>
            <p className="text-sm text-muted">Tunis, Tunisia</p>
          </div>
          <Badge tone="accent" className="ms-auto">
            New
          </Badge>
        </div>
        <div className="mt-6 grid gap-4">
          <Select label="Status" defaultValue="new">
            <option value="new">New</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
          </Select>
          <Textarea label="Note" placeholder="Add a note for the packer" />
        </div>
      </Drawer>
    </div>
  )
}
