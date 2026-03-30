const CURRENCY_FORMATTERS = new Map<string, Intl.NumberFormat>()

export function formatCurrency(
  amount: number,
  currency = 'BDT',
  locale = 'en-BD'
): string {
  const key = `${locale}-${currency}`
  if (!CURRENCY_FORMATTERS.has(key)) {
    CURRENCY_FORMATTERS.set(
      key,
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    )
  }
  return CURRENCY_FORMATTERS.get(key)!.format(amount)
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-BD', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString('en-BD', { month: 'short', day: 'numeric' })
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return d.toLocaleDateString('en-BD', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}
