export function round4(x) {
  return Math.round((Number(x) + Number.EPSILON) * 10000) / 10000
}

export function to4(x) {
  if (x === null || x === undefined || Number.isNaN(Number(x))) return '—'
  return Number(x).toFixed(4)
}

export function median(values) {
  if (!values.length) return null
  const s = [...values].sort((a,b)=>a-b)
  const n = s.length
  if (n % 2 === 1) return s[(n-1)/2]
  return round4((s[n/2 - 1] + s[n/2]) / 2)
}

export function mode(values) {
  if (!values.length) return null
  const freq = new Map()
  values.forEach(v => freq.set(v, (freq.get(v) || 0) + 1))
  let max = 0
  for (const c of freq.values()) max = Math.max(max, c)
  if (max <= 1) return null
  const modes = [...freq.entries()].filter(([,c])=>c===max).map(([v])=>v)
  if (modes.length !== 1) return null
  return modes[0]
}

// sample standard deviation (n-1). if n==1 -> 0
export function stdDev(values) {
  const n = values.length
  if (!n) return null
  if (n === 1) return 0
  const mean = values.reduce((a,b)=>a+b,0) / n
  let ss = 0
  for (const v of values) ss += (v-mean)*(v-mean)
  return round4(Math.sqrt(ss / (n - 1)))
}

export function coefVar(values) {
  const n = values.length
  if (!n) return null
  const mean = values.reduce((a,b)=>a+b,0) / n
  if (mean === 0) return null
  const sd = stdDev(values)
  return sd === null ? null : round4(sd / mean)
}

export function buildHistogram(values, binCount = 12) {
  if (!values.length) {
    return {
      bins: Array.from({ length: binCount }, (_, i) => ({
        binStart: 0,
        binEnd: 0,
        binCenter: 0,
        count: 0,
      })),
      ticks: [0],
    }
  }

  let min = Math.min(...values)
  let max = Math.max(...values)

  const maxAbs = Math.max(Math.abs(min), Math.abs(max))
  min = -maxAbs
  max = maxAbs

  if (min === max) {
    const w = 0.0001
    min -= (binCount / 2) * w
    max = min + binCount * w
  }

  const width = (max - min) / binCount
  const counts = Array.from({ length: binCount }, () => 0)

  for (const v of values) {
    let idx = Math.floor((v - min) / width)
    if (idx < 0) idx = 0
    if (idx >= binCount) idx = binCount - 1
    counts[idx]++
  }

  const bins = counts.map((c, i) => {
    const start = round4(min + i * width)
    const end = round4(min + (i + 1) * width)
    const center = round4((start + end) / 2)
    return { binStart: start, binEnd: end, binCenter: center, count: c }
  })

  const tickSet = new Set(bins.map(b => b.binStart))
  tickSet.add(0)
  tickSet.add(bins[bins.length - 1].binEnd)
  const ticks = [...tickSet].sort((a, b) => a - b).map(round4)

  return { bins, ticks }
}

