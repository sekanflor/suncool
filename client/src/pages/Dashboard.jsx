import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard(){
  const [logs, setLogs] = useState([])
  const [range, setRange] = useState('day')
  const [valueCelsius, setValueCelsius] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    const { data } = await axios.get('/api/logs', {})
    setLogs(data)
  }

  const fetchStats = async (r) => {
    const { data } = await axios.get('/api/logs/stats', { params: { range: r } })
    return data
  }

  useEffect(() => { fetchData() }, [])

  const onAdd = async (e) => {
    e.preventDefault()
    if (!valueCelsius) return
    setLoading(true)
    try {
      await axios.post('/api/logs', { valueCelsius: Number(valueCelsius), note })
      setValueCelsius('')
      setNote('')
      await fetchData()
    } finally {
      setLoading(false)
    }
  }

  const [chart, setChart] = useState([])
  useEffect(() => {
    (async () => {
      const stats = await fetchStats(range)
      const parsed = stats.data.map(s => {
        const { y, m, d, h } = s._id
        const dt = new Date(y, m - 1, d, h || 0)
        return { time: dt, avg: s.avg, min: s.min, max: s.max, count: s.count }
      })
      setChart(parsed)
    })()
  }, [range, logs.length])

  const rows = useMemo(() => logs.slice().sort((a,b)=>new Date(b.recordedAt)-new Date(a.recordedAt)), [logs])

  return (
    <div className="grid">
      <div className="panel">
        <h2 style={{ marginTop:0 }}>Your temperature</h2>
        <p className="subtle">Log a new reading and explore your chart.</p>
        <form onSubmit={onAdd} className="form-row" style={{ marginTop: 12 }}>
          <input className="input" placeholder="Temperature °C" value={valueCelsius} onChange={e=>setValueCelsius(e.target.value)} />
          <input className="input" placeholder="Note (optional)" value={note} onChange={e=>setNote(e.target.value)} />
          <button className="button" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </form>
        <div style={{ marginTop: 12 }}>
          <label className="label">Range</label>
          <select className="select" value={range} onChange={e=>setRange(e.target.value)}>
            <option value="day">Today (hourly)</option>
            <option value="week">Last 7 days</option>
          </select>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop:0 }}>Temperature chart</h3>
        <div className="chart-wrap">
          <ResponsiveContainer>
            <LineChart data={chart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#20304a" />
              <XAxis dataKey="time" tickFormatter={t=>new Date(t).toLocaleString()} stroke="#9fb0c2" />
              <YAxis domain={[34, 42]} stroke="#9fb0c2" />
              <Tooltip labelFormatter={l=>new Date(l).toLocaleString()} />
              <Line type="monotone" dataKey="avg" stroke="#4cc9f0" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="min" stroke="#2bc016" dot={false} strokeWidth={1} />
              <Line type="monotone" dataKey="max" stroke="#ff6b6b" dot={false} strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginTop:0 }}>Recent logs</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th className="th">When</th>
                <th className="th">Temp (°C)</th>
                <th className="th">Note</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(l => (
                <tr key={l._id}>
                  <td className="td">{new Date(l.recordedAt).toLocaleString()}</td>
                  <td className="td">{l.valueCelsius.toFixed(1)}</td>
                  <td className="td">{l.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
