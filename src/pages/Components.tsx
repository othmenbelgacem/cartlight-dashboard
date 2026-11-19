import { ArrowRight, Plus, Trash2 } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button, IconButton } from '../components/ui/Button'
import { BentoGrid, BentoTile } from '../components/ui/Card'
import { Checkbox, Radio, Switch } from '../components/ui/Choices'
import { Input, Select, Textarea } from '../components/ui/fields'

const h2 = 'font-display text-xl font-bold'

export default function Components() {
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
      </BentoGrid>
    </div>
  )
}
