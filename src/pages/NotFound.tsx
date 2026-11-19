import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section>
      <h1 className="font-display text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-xl text-muted">
        This address doesn’t match any page. Check the link, or go back to the overview.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent"
      >
        Go to overview
      </Link>
    </section>
  )
}
