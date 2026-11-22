import { describe, expect, it } from 'vitest'
import { customerRows } from '../../data/customerStats'
import { filterCustomers } from './filterCustomers'

describe('filterCustomers', () => {
  it('returns everyone for an empty search and "all"', () => {
    expect(filterCustomers(customerRows, '', 'all')).toHaveLength(customerRows.length)
  })

  it('searches the name, email and city, ignoring case', () => {
    expect(filterCustomers(customerRows, 'AMEL', 'all').map((row) => row.name)).toEqual([
      'Amel Trabelsi',
    ])
    expect(filterCustomers(customerRows, 'hatem.bouzid@', 'all')).toHaveLength(1)
    const sfax = filterCustomers(customerRows, 'sfax', 'all')
    expect(sfax.length).toBeGreaterThan(0)
    expect(sfax.every((row) => row.city === 'Sfax')).toBe(true)
  })

  it('keeps only the chosen segment, and combines with the search', () => {
    const atRisk = filterCustomers(customerRows, '', 'at-risk')
    expect(atRisk.length).toBeGreaterThan(0)
    expect(atRisk.every((row) => row.segment === 'at-risk')).toBe(true)
    expect(filterCustomers(customerRows, atRisk[0].name, 'new')).toHaveLength(0)
  })
})
