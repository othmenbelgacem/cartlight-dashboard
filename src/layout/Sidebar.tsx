import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { NavLink } from 'react-router'
import { STORE_NAV, SYSTEM_NAV, type NavItem } from './nav'

type NavGroupProps = { items: NavItem[]; collapsed: boolean; onNavigate: () => void }

function NavGroup({ items, collapsed, onNavigate }: NavGroupProps) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ path, label, Icon }) => (
        <li key={path}>
          <NavLink
            to={path}
            end={path === '/'}
            title={label}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                collapsed ? 'lg:justify-center' : ''
              } ${isActive ? 'bg-accent text-on-accent' : 'text-muted hover:bg-raised hover:text-fg'}`
            }
          >
            <Icon size={20} className="shrink-0" />
            <span className={collapsed ? 'lg:sr-only' : ''}>{label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

type SidebarProps = {
  open: boolean
  collapsed: boolean
  onClose: () => void
  onToggleCollapsed: () => void
}

export default function Sidebar({ open, collapsed, onClose, onToggleCollapsed }: SidebarProps) {
  const CollapseIcon = collapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <>
      {open && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-fg/40 lg:hidden"
        />
      )}
      <aside
        id="sidebar"
        className={`${open ? 'flex' : 'hidden'} fixed inset-y-0 start-0 z-40 w-72 flex-col border-e border-line bg-surface lg:sticky lg:inset-y-auto lg:top-0 lg:z-auto lg:flex lg:h-screen lg:shrink-0 ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        <div
          className={`flex h-16 shrink-0 items-center justify-between px-4 ${
            collapsed ? 'lg:justify-center' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden="true">
              <path d="M8 27V16a8 8 0 0 1 16 0v11z" fill="var(--accent)" />
            </svg>
            <span
              className={`font-display text-xl font-bold tracking-tight ${
                collapsed ? 'lg:sr-only' : ''
              }`}
            >
              Cartlight
            </span>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-raised hover:text-fg lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav aria-label="Main" className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-2">
          <NavGroup items={STORE_NAV} collapsed={collapsed} onNavigate={onClose} />
          <hr className="border-line" />
          <NavGroup items={SYSTEM_NAV} collapsed={collapsed} onNavigate={onClose} />
        </nav>

        <div className="hidden border-t border-line p-3 lg:block">
          <button
            type="button"
            aria-expanded={!collapsed}
            aria-controls="sidebar"
            onClick={onToggleCollapsed}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-raised hover:text-fg ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <CollapseIcon size={20} className="shrink-0 rtl:-scale-x-100" />
            <span className={collapsed ? 'sr-only' : ''}>Collapse sidebar</span>
          </button>
        </div>
      </aside>
    </>
  )
}
