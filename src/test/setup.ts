import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

configure({ asyncUtilTimeout: 5000 })

afterEach(cleanup)

// Chart containers measure themselves with ResizeObserver, which the test environment lacks.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

// The test environment has no screen size, so charts warn that they have none. Hide that one message.
const originalWarn = console.warn
console.warn = (...args: unknown[]) => {
  if (String(args[0]).includes('of chart should be greater than 0')) return
  originalWarn(...args)
}
