const AMOUNT = new Intl.NumberFormat('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })

/** 2243.1 becomes "2,243.100 TND". Tunisian dinar uses three decimals. */
export function formatTnd(value: number) {
  return `${AMOUNT.format(value)} TND`
}

/** "2026-11-18" becomes "18 Nov". */
export function formatShortDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

/** 4.72 becomes "+4.7%", and -4.72 becomes "−4.7%". */
export function formatPercent(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${Math.abs(value).toFixed(1)}%`
}

/** "2025-02-14" becomes "14 Feb 2025". */
export function formatLongDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
