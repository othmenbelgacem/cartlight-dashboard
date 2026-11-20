import { useEffect, useState } from 'react'

export type ThemeName = 'light' | 'dark' | 'holiday'
export type Direction = 'ltr' | 'rtl'

export const THEMES: readonly ThemeName[] = ['light', 'dark', 'holiday']
const DIRECTIONS: readonly Direction[] = ['ltr', 'rtl']
const SWITCH_STATES = ['on', 'off'] as const

const THEME_KEY = 'cartlight.theme'
const DIR_KEY = 'cartlight.dir'
const SNOW_KEY = 'cartlight.snow'

function readSaved<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return allowed.includes(value as T) ? (value as T) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage can be blocked (private mode). The app still works without saving.
  }
}

function systemTheme(): ThemeName {
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
}

/** Holds the theme, text direction and snow setting, applies them to <html>, and remembers them. */
export function useThemeSettings() {
  const [theme, setTheme] = useState<ThemeName>(() => readSaved(THEME_KEY, THEMES, systemTheme()))
  const [dir, setDir] = useState<Direction>(() => readSaved(DIR_KEY, DIRECTIONS, 'ltr'))
  const [snow, setSnow] = useState<boolean>(
    () => readSaved(SNOW_KEY, SWITCH_STATES, 'off') === 'on',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    save(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = dir === 'rtl' ? 'ar' : 'en'
    save(DIR_KEY, dir)
  }, [dir])

  useEffect(() => {
    save(SNOW_KEY, snow ? 'on' : 'off')
  }, [snow])

  return { theme, setTheme, dir, setDir, snow, setSnow }
}
