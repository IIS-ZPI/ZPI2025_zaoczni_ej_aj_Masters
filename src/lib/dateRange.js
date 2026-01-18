export function formatDate(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function rangeFromPeriod(period) {
  const to = new Date()
  const from = new Date(to)
  switch (period) {
    case '1W': from.setDate(from.getDate() - 7); break
    case '2W': from.setDate(from.getDate() - 14); break
    case '1M': from.setMonth(from.getMonth() - 1); break
    case '1Q': from.setMonth(from.getMonth() - 3); break
    case '6M': from.setMonth(from.getMonth() - 6); break
    case '1Y': from.setFullYear(from.getFullYear() - 1); break
    default: from.setDate(from.getDate() - 7)
  }
  return { from: formatDate(from), to: formatDate(to) }
}

export function rangeForGranularity(granularity) {
  const to = new Date()
  const from = new Date(to)
  if (granularity === 'MONTHLY') from.setMonth(from.getMonth() - 1)
  else from.setMonth(from.getMonth() - 3)
  return { from: formatDate(from), to: formatDate(to) }
}
