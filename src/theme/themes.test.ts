// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), 'themes.css'), 'utf8')

const THEMES = ['light', 'dark', 'holiday'] as const
// [text or control, background, minimum contrast]. Text needs 4.5:1, form-field borders need 3:1.
const PAIRS: [string, string, number?][] = [
  ['fg', 'bg'],
  ['fg', 'surface'],
  ['fg', 'raised'],
  ['muted', 'bg'],
  ['muted', 'surface'],
  ['muted', 'raised'],
  ['link', 'bg'],
  ['link', 'surface'],
  ['hot', 'bg'],
  ['hot', 'surface'],
  ['on-accent', 'accent'],
  ['on-hot', 'hot'],
  ['control', 'surface', 3],
  ['control', 'bg', 3],
  ['control', 'raised', 3],
]

function tokens(theme: string): Record<string, string> {
  const block = new RegExp(`\\[data-theme=['"]${theme}['"]\\]\\s*\\{([^}]*)\\}`).exec(css)
  if (!block) throw new Error(`Theme ${theme} not found`)
  const out: Record<string, string> = {}
  for (const [, name, value] of block[1].matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)) {
    out[name] = value
  }
  return out
}

function channel(c: number) {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return (
    0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  )
}

function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

describe('theme contrast (WCAG AA, 4.5:1 for text)', () => {
  for (const theme of THEMES) {
    it(`${theme} theme text pairs are readable`, () => {
      const t = tokens(theme)
      for (const [fg, bg, min = 4.5] of PAIRS) {
        expect(t[fg], `${theme}: --${fg} missing`).toBeDefined()
        expect(t[bg], `${theme}: --${bg} missing`).toBeDefined()
        expect(contrast(t[fg], t[bg]), `${theme}: ${fg} on ${bg}`).toBeGreaterThanOrEqual(min)
      }
    })
  }
})
