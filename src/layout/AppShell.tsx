import { Suspense, useEffect, useState } from 'react'
import {
  ChevronRight,
  CloudSnow,
  Languages,
  Menu,
  Moon,
  PanelLeftClose,
  Search,
  Snowflake,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { CommandPalette, type Command } from '../components/ui/CommandPalette'
import { Snowfall } from '../components/ui/Snowfall'
import { THEMES, useThemeSettings, type ThemeName } from '../theme/useThemeSettings'
import { ALL_NAV } from './nav'
import Sidebar from './Sidebar'
import { usePageTitle } from './usePageTitle'

const THEME_META: Record<ThemeName, { label: string; Icon: LucideIcon }> = {
  light: { label: 'Light', Icon: Sun },
  dark: { label: 'Dark', Icon: Moon },
  holiday: { label: 'Holiday', Icon: Snowflake },
}

const SHORTCUT = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl K'

function Breadcrumbs() {
  const current = usePageTitle()

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm">
        <li className="text-muted">Cartlight</li>
        <li aria-hidden="true">
          <ChevronRight size={14} className="text-muted rtl:rotate-180" />
        </li>
        <li aria-current="page" className="truncate font-medium">
          {current}
        </li>
      </ol>
    </nav>
  )
}

export default function AppShell() {
  const { theme, setTheme, dir, setDir, snow, setSnow } = useThemeSettings()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const commands: Command[] = [
    ...ALL_NAV.map(({ path, label, Icon }) => ({
      id: `go-${path}`,
      label: `Go to ${label}`,
      group: 'Pages',
      icon: <Icon size={18} />,
      run: () => navigate(path),
    })),
    ...THEMES.map((name) => {
      const { label, Icon } = THEME_META[name]
      return {
        id: `theme-${name}`,
        label: `Switch to ${label} theme`,
        group: 'Appearance',
        icon: <Icon size={18} />,
        keywords: 'color mode',
        run: () => setTheme(name),
      }
    }),
    {
      id: 'direction',
      label: dir === 'rtl' ? 'Switch to left-to-right' : 'Switch to right-to-left',
      group: 'Appearance',
      icon: <Languages size={18} />,
      keywords: 'direction arabic rtl ltr language',
      run: () => setDir(dir === 'rtl' ? 'ltr' : 'rtl'),
    },
    ...(theme === 'holiday'
      ? [
          {
            id: 'snow',
            label: snow ? 'Turn snow off' : 'Turn snow on',
            group: 'Appearance',
            icon: <CloudSnow size={18} />,
            keywords: 'snowfall effect christmas',
            run: () => setSnow((value) => !value),
          },
        ]
      : []),
    {
      id: 'sidebar',
      label: collapsed ? 'Expand sidebar' : 'Collapse sidebar',
      group: 'Layout',
      icon: <PanelLeftClose size={18} className="rtl:-scale-x-100" />,
      keywords: 'menu navigation',
      run: () => setCollapsed((value) => !value),
    },
  ]

  return (
    <div className="min-h-screen lg:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>

      <Sidebar
        open={menuOpen}
        collapsed={collapsed}
        onClose={() => setMenuOpen(false)}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="sidebar"
            onClick={() => setMenuOpen(true)}
            className="rounded-full p-2 text-muted hover:bg-raised hover:text-fg lg:hidden"
          >
            <Menu size={20} />
          </button>

          <Breadcrumbs />

          <div className="ms-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Open command palette"
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface p-2.5 text-sm text-muted transition-colors hover:text-fg md:px-4 md:py-2"
            >
              <Search size={18} />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden rounded-md border border-line bg-raised px-1.5 py-0.5 font-sans text-xs lg:inline">
                {SHORTCUT}
              </kbd>
            </button>
            {theme === 'holiday' && (
              <button
                type="button"
                aria-label="Snow"
                title="Snow"
                aria-pressed={snow}
                onClick={() => setSnow((value) => !value)}
                className={`rounded-full border border-line p-2.5 transition-colors ${
                  snow ? 'bg-accent text-on-accent' : 'bg-surface text-muted hover:text-fg'
                }`}
              >
                <CloudSnow size={18} />
              </button>
            )}
            <div
              role="group"
              aria-label="Theme"
              className="flex rounded-full border border-line bg-surface p-0.5"
            >
              {THEMES.map((name) => {
                const { label, Icon } = THEME_META[name]
                const active = theme === name
                return (
                  <button
                    key={name}
                    type="button"
                    aria-label={label}
                    title={label}
                    aria-pressed={active}
                    onClick={() => setTheme(name)}
                    className={`rounded-full p-2 transition-colors ${
                      active ? 'bg-accent text-on-accent' : 'text-muted hover:text-fg'
                    }`}
                  >
                    <Icon size={18} />
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              aria-label="Right-to-left"
              title="Right-to-left"
              aria-pressed={dir === 'rtl'}
              onClick={() => setDir(dir === 'rtl' ? 'ltr' : 'rtl')}
              className={`rounded-full border border-line p-2.5 transition-colors ${
                dir === 'rtl' ? 'bg-accent text-on-accent' : 'bg-surface text-muted hover:text-fg'
              }`}
            >
              <Languages size={18} />
            </button>
          </div>
        </header>

        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          <Suspense
            fallback={
              <p role="status" className="text-muted">
                Loading…
              </p>
            }
          >
            <div key={pathname} className="animate-rise">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={commands}
      />
      {theme === 'holiday' && snow && <Snowfall />}
    </div>
  )
}
