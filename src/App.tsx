import { ArrowRight, Languages, Moon, Snowflake, Sun, type LucideIcon } from 'lucide-react'
import { THEMES, useThemeSettings, type ThemeName } from './theme/useThemeSettings'

const THEME_META: Record<ThemeName, { label: string; Icon: LucideIcon }> = {
  light: { label: 'Light', Icon: Sun },
  dark: { label: 'Dark', Icon: Moon },
  holiday: { label: 'Holiday', Icon: Snowflake },
}

const SWATCHES = [
  ['bg', 'Background'],
  ['surface', 'Surface'],
  ['raised', 'Raised'],
  ['line', 'Line'],
  ['fg', 'Text'],
  ['muted', 'Muted text'],
  ['accent', 'Accent'],
  ['link', 'Link'],
  ['hot', 'Alert'],
] as const

const tile = 'rounded-tile border border-line bg-surface p-6'
const button =
  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90'

export default function App() {
  const { theme, setTheme, dir, setDir } = useThemeSettings()

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 32 32" className="size-9" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="var(--surface)" />
            <path d="M8 25V15a8 8 0 0 1 16 0v10z" fill="var(--accent)" />
          </svg>
          <span className="font-display text-2xl font-bold tracking-tight">Cartlight</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Theme"
            className="flex rounded-full border border-line bg-surface p-1"
          >
            {THEMES.map((name) => {
              const { label, Icon } = THEME_META[name]
              const active = theme === name
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTheme(name)}
                  className={`${button} ${active ? 'bg-accent text-on-accent' : 'text-muted'}`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            aria-pressed={dir === 'rtl'}
            onClick={() => setDir(dir === 'rtl' ? 'ltr' : 'rtl')}
            className={`${button} border border-line ${dir === 'rtl' ? 'bg-accent text-on-accent' : 'bg-surface'}`}
          >
            <Languages size={16} />
            Right-to-left
          </button>
        </div>
      </header>

      <main className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-6">
        <section className={`${tile} relative overflow-hidden md:col-span-4 md:row-span-2 md:p-10`}>
          <div className="relative z-10 max-w-md">
            <h1 className="font-display text-5xl leading-none font-bold tracking-tight md:text-7xl">
              Your store, always lit.
            </h1>
            <p className="mt-5 text-lg text-muted">
              Sprint 0 foundation: three themes and one set of design tokens. Switch the theme and
              the direction above to check every screen we build.
            </p>
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-2 end-6 h-64 w-48 rounded-t-full border-4 border-accent bg-raised shadow-[0_0_80px_16px_color-mix(in_oklab,var(--accent)_40%,transparent)] md:end-12 md:h-80 md:w-60"
          />
        </section>

        <section className={`${tile} md:col-span-2`}>
          <h2 className="font-display text-xl font-bold">Palette</h2>
          <ul className="mt-4 grid grid-cols-3 gap-3">
            {SWATCHES.map(([key, label]) => (
              <li key={key}>
                <div
                  className="h-12 rounded-xl border border-line"
                  style={{ backgroundColor: `var(--${key})` }}
                />
                <span className="mt-1 block text-xs text-muted">{label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${tile} md:col-span-2`}>
          <h2 className="font-display text-xl font-bold">Type</h2>
          <p className="mt-3 font-display text-2xl font-bold">Bricolage Grotesque for headings</p>
          <p className="mt-2 text-muted">Readex Pro for body text, and for Arabic.</p>
          <p lang="ar" dir="rtl" className="mt-3 text-lg">
            مرحباً بكم في لوحة التحكم
          </p>
        </section>

        <section className={`${tile} md:col-span-6`}>
          <h2 className="font-display text-xl font-bold">Buttons and direction</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" className={`${button} bg-accent text-on-accent`}>
              Save changes
              <ArrowRight size={16} className="rtl:-scale-x-100" />
            </button>
            <button type="button" className={`${button} border border-line`}>
              Cancel
            </button>
            <button type="button" className={`${button} bg-hot text-on-hot`}>
              Delete order
            </button>
            <a href="#orders" className="text-link underline underline-offset-4">
              View all orders
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">
            Arrows flip in right-to-left. Layout spacing uses start and end, never left and right.
          </p>
        </section>
      </main>

      <footer className="text-sm text-muted">Next: layout shell and core components.</footer>
    </div>
  )
}
