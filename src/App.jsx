import React, { useMemo, useState } from 'react'
import { CURRENCIES, PERIODS, GRANULARITIES } from './lib/constants'
import { rangeFromPeriod, rangeForGranularity } from './lib/dateRange'
import { to4 } from './lib/math'
import { computeHistogram, computeSessionsAndStats } from './lib/mockData'
import { Readonly, Select } from './components/FormControls'
import HistogramChart from './components/HistogramChart'
import { realSeries } from './lib/mockData'

export default function App() {
  const [error, setError] = useState('')

  const [baseA, setBaseA] = useState('EUR')
  const [quoteA, setQuoteA] = useState('PLN')
  const [period, setPeriod] = useState('1W')
  const rangeA = useMemo(() => rangeFromPeriod(period), [period])
  const [loadingA, setLoadingA] = useState(false)
  const [resultA, setResultA] = useState(null)

  const [baseB, setBaseB] = useState('EUR')
  const [quoteB, setQuoteB] = useState('PLN')
  const [gran, setGran] = useState('MONTHLY')
  const rangeB = useMemo(() => rangeForGranularity(gran), [gran])
  const [loadingB, setLoadingB] = useState(false)

  const [hist, setHist] = useState(null)

  async function runAnalysisA() {
    setError('')
    setLoadingA(true)
    setResultA(null)
    try {
      const points = await realSeries({ from: rangeA.from, to: rangeA.to, base: baseA, quote: quoteA })
      const out = computeSessionsAndStats(points)
      setResultA(out)
    } catch {
      setError('Unable to run the analysis. Please try again later.')
    } finally {
      setLoadingA(false)
    }
  }

  async function runHistogramB() {
    setError('')
    setLoadingB(true)
    setHist(null)
    try {
      const points = await realSeries({ from: rangeB.from, to: rangeB.to, base: baseB, quote: quoteB })
      const out = computeHistogram(points)
      setHist(out)
    } catch {
      setError('Unable to run the analysis. Please try again later.')
    } finally {
      setLoadingB(false)
    }
  }

  return (
      <div className="app-layout">
        <div className="card app-header">
          <h1>NBP currency spot exchange rate analysis system — mockup (React)</h1>
          <div className="sub">This is a UI prototype. Data is fetched from the NBP API each time.</div>
          {error && <div className="alert">{error}</div>}
        </div>

        <div className="top-panel">
          <div className="panel-left card">
            <div className="headerRow">
              <div>
                <span className="badge">Section A</span> Analysis parameters + session counts
              </div>
              <button onClick={runAnalysisA} disabled={loadingA}>
                {loadingA ? 'Calculating…' : 'Calculate'}
              </button>
            </div>

            <div className="controls">
              <Select label="Base currency" value={baseA} onChange={setBaseA} options={CURRENCIES} />
              <Select label="Quote currency" value={quoteA} onChange={setQuoteA} options={CURRENCIES} />
              <Select label="Analysis period" value={period} onChange={setPeriod} options={PERIODS} />
              <Readonly label="To date" value={rangeA.to} />
              <div />
              <div />
            </div>

            <div className="card" style={{ background: '#0f1422', marginTop: 16 }}>
              <div style={{ marginBottom: 8 }} className="badge">
                1.1 Quotation sessions
              </div>
              <table className="table">
                <thead>
                <tr>
                  <th>Upward</th>
                  <th>Unchanged</th>
                  <th>Downward</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td style={{ textAlign: 'right' }}>{resultA?.sessions?.up ?? '—'}</td>
                  <td style={{ textAlign: 'right' }}>{resultA?.sessions?.flat ?? '—'}</td>
                  <td style={{ textAlign: 'right' }}>{resultA?.sessions?.down ?? '—'}</td>
                </tr>
                </tbody>
              </table>
              <div className="smallNote">
                Definitions: upward/downward/unchanged compared to the previous trading session.
              </div>
            </div>
          </div>

          <div className="panel-right card">
            <div className="headerRow">
              <div>
                <span className="badge">Section A</span> Statistical measures
              </div>
            </div>

            <div className="card" style={{ background: '#0f1422', marginTop: 12 }}>
              <div style={{ marginBottom: 8 }} className="badge">
                1.2 Statistical measures (rounded to 4 decimals)
              </div>
              <table className="table">
                <thead>
                <tr>
                  <th>Median</th>
                  <th>Mode</th>
                  <th>Standard Deviation</th>
                  <th>Variation Coefficient</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{resultA ? to4(resultA.stats?.median) : '—'}</td>
                  <td>{resultA ? (resultA.stats?.mode === null ? 'No mode' : to4(resultA.stats?.mode)) : '—'}</td>
                  <td>{resultA ? to4(resultA.stats?.stdDev) : '—'}</td>
                  <td>{resultA ? to4(resultA.stats?.coefVar) : '—'}</td>
                </tr>
                </tbody>
              </table>
              <div className="smallNote">
                All measures are computed from values rounded to 4 decimals. If no value occurs more frequently than the
                others, “No mode” is shown.
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-panel card">
          <div className="headerRow">
            <div>
              <span className="badge">Section B</span> Histogram (12 equal-width bins)
            </div>
            <button onClick={runHistogramB} disabled={loadingB}>
              {loadingB ? 'Generating…' : 'Generate histogram'}
            </button>
          </div>

          <div className="controls">
            <Select label="Base currency" value={baseB} onChange={setBaseB} options={CURRENCIES} />
            <Select label="Quote currency" value={quoteB} onChange={setQuoteB} options={CURRENCIES} />
            <Select label="Analysis period" value={gran} onChange={setGran} options={GRANULARITIES} />
            <Readonly label="To date" value={rangeB.to} />
            <div />
            <div />
          </div>

          <div className="card" style={{ background: '#0f1422', marginTop: 16 }}>
            <HistogramChart bins={hist?.bins} ticks={hist?.ticks} height={360} />
          </div>

          <div className="smallNote">
            Changes are computed as differences between exchange-rate values from consecutive trading sessions. The
            histogram shows frequency per interval; the X axis shows bin start points, and 0 is marked on the chart.
          </div>
        </div>
      </div>
  )
}
