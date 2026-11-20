import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { ALL_NAV } from './nav'

/** Returns the name of the current page and shows it in the browser tab title. */
export function usePageTitle() {
  const { pathname } = useLocation()
  const title = ALL_NAV.find((item) => item.path === pathname)?.label ?? 'Page not found'

  useEffect(() => {
    document.title = `${title} | Cartlight`
  }, [title])

  return title
}
