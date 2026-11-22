import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { getCustomer } from '../data'
import { ALL_NAV } from './nav'

export type Crumb = { label: string; to?: string }

function trailFor(pathname: string): Crumb[] {
  const page = ALL_NAV.find((item) => item.path === pathname)
  if (page) return [{ label: page.label }]

  const customer = /^\/customers\/([^/]+)$/.exec(pathname)
  if (customer) {
    return [
      { label: 'Customers', to: '/customers' },
      { label: getCustomer(customer[1])?.name ?? 'Customer not found' },
    ]
  }
  return [{ label: 'Page not found' }]
}

/** Returns the breadcrumb trail for the current page and shows its name in the browser tab title. */
export function usePageTrail(): Crumb[] {
  const { pathname } = useLocation()
  const trail = trailFor(pathname)
  const title = trail[trail.length - 1].label

  useEffect(() => {
    document.title = `${title} | Cartlight`
  }, [title])

  return trail
}
