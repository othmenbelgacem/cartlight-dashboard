import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'
import { DataTable, type Column } from './DataTable'
import { Tabs } from './Tabs'
import { ToastProvider } from './Toast'
import { useToast } from './toast-context'

type Row = { id: string; name: string; total: number }

const ROWS: Row[] = [
  { id: '1', name: 'Sami', total: 90 },
  { id: '2', name: 'Amel', total: 40 },
  { id: '3', name: 'Zied', total: 70 },
  { id: '4', name: 'Nour', total: 10 },
  { id: '5', name: 'Bilel', total: 55 },
  { id: '6', name: 'Hela', total: 20 },
  { id: '7', name: 'Karim', total: 80 },
]

const COLUMNS: Column<Row>[] = [
  { id: 'name', header: 'Name', cell: (row) => row.name, sortBy: (row) => row.name },
  {
    id: 'total',
    header: 'Total',
    cell: (row) => row.total,
    sortBy: (row) => row.total,
    numeric: true,
  },
]

function renderTable() {
  render(
    <DataTable
      caption="Customers"
      columns={COLUMNS}
      rows={ROWS}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      pageSize={3}
      selectable
    />,
  )
}

function firstBodyRow() {
  return screen.getAllByRole('row')[1]
}

describe('data table', () => {
  it('sorts by a column and announces the sort direction', async () => {
    renderTable()
    expect(firstBodyRow()).toHaveTextContent('Sami')
    await userEvent.click(screen.getByRole('button', { name: 'Name' }))
    expect(firstBodyRow()).toHaveTextContent('Amel')
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Name' }))
    expect(firstBodyRow()).toHaveTextContent('Zied')
  })

  it('selects rows and counts them', async () => {
    renderTable()
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select Amel' }))
    expect(screen.getByText('1 selected')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all rows on this page' }))
    expect(screen.getByText('3 selected')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Clear selection' }))
    expect(screen.queryByText(/selected/)).not.toBeInTheDocument()
  })

  it('moves between pages', async () => {
    renderTable()
    expect(screen.getByText('Showing 1–3 of 7')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByText('Showing 4–6 of 7')).toBeInTheDocument()
    expect(firstBodyRow()).toHaveTextContent('Nour')
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')
  })
})

function ToastDemo() {
  const toast = useToast()
  return <Button onClick={() => toast({ title: 'Order saved' })}>Save</Button>
}

describe('tabs and toast', () => {
  it('shows a toast and lets the user dismiss it', async () => {
    render(
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByRole('status')).toHaveTextContent('Order saved')
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('switches tabs by click and with the arrow keys', async () => {
    render(
      <Tabs
        label="Order sections"
        tabs={[
          { id: 'a', label: 'Items', content: <p>Item list</p> },
          { id: 'b', label: 'History', content: <p>Order history</p> },
        ]}
      />,
    )
    const tablist = screen.getByRole('tablist', { name: 'Order sections' })
    expect(within(tablist).getByRole('tab', { name: 'Items' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Item list')
    await userEvent.click(screen.getByRole('tab', { name: 'Items' }))
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'History' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Order history')
  })
})
