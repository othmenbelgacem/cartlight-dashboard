import {
  ChartColumn,
  LayoutDashboard,
  Package,
  Palette,
  Settings,
  ShoppingBag,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = { path: string; label: string; Icon: LucideIcon }

export const STORE_NAV: NavItem[] = [
  { path: '/', label: 'Overview', Icon: LayoutDashboard },
  { path: '/orders', label: 'Orders', Icon: ShoppingBag },
  { path: '/products', label: 'Products', Icon: Package },
  { path: '/customers', label: 'Customers', Icon: Users },
  { path: '/analytics', label: 'Analytics', Icon: ChartColumn },
]

export const SYSTEM_NAV: NavItem[] = [
  { path: '/settings', label: 'Settings', Icon: Settings },
  { path: '/foundation', label: 'Design foundation', Icon: Palette },
]

export const ALL_NAV: NavItem[] = [...STORE_NAV, ...SYSTEM_NAV]
