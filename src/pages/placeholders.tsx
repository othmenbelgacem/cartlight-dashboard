type PagePlaceholderProps = { title: string; description: string; sprint: number }

function PagePlaceholder({ title, description, sprint }: PagePlaceholderProps) {
  return (
    <section>
      <h1 className="font-display text-4xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-xl text-muted">{description}</p>
      <div className="mt-8 rounded-tile border border-dashed border-line p-10 text-center text-muted">
        Built in Sprint {sprint}.
      </div>
    </section>
  )
}

export function Products() {
  return (
    <PagePlaceholder
      title="Products"
      description="Product grid, product details and the edit form."
      sprint={2}
    />
  )
}

export function Analytics() {
  return (
    <PagePlaceholder
      title="Analytics"
      description="Traffic, conversion funnel and orders heatmap."
      sprint={2}
    />
  )
}

export function Settings() {
  return (
    <PagePlaceholder
      title="Settings"
      description="Profile, store, team and appearance settings."
      sprint={3}
    />
  )
}
