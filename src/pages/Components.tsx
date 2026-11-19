import { useState } from 'react'
import { ArrowRight, ChevronDown, Copy, Pencil, Plus, Trash2 } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button, IconButton } from '../components/ui/Button'
import { BentoGrid, BentoTile } from '../components/ui/Card'
import { Checkbox, Radio, Switch } from '../components/ui/Choices'
import { DropdownMenu } from '../components/ui/DropdownMenu'
import { Input, Select, Textarea } from '../components/ui/fields'
import { Drawer, Modal } from '../components/ui/Overlays'
import { Tooltip } from '../components/ui/Tooltip'

const h2 = 'font-display text-xl font-bold'

export default function Components() {
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastAction, setLastAction] = useState('none yet')

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
