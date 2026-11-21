import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] })
  return () => observer.disconnect()
}

/** The current text direction of the page. Updates when the direction is switched. */
export function useDirection(): 'ltr' | 'rtl' {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'),
    () => 'ltr',
  )
}
