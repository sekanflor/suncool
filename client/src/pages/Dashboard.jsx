import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line } from 'recharts'

export default function Dashboard() {
  const [logs, setLogs] = useState([])
  const [range, setRange] = useState('day')
  const [valueCelsius, setValueCelsius] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [fanOn, setFanOn] = useState(false)

  const fetchData = async () => {
    const { data } = await axios.get('/api/logs', {})
    setLogs(data)
  }

  const fetchStats = async (r) => {
    const { data } = await axios.get('/api/logs/stats', { params: { range: r } })
    return data
  }

  useEffect(() => {
    fetchData()
  }, [])

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

  const toggleFan = () => {
    setFanOn(!fanOn)
  }

  const [bodyTempChart, setBodyTempChart] = useState([])

  useEffect(() => {
    (async () => {
      const stats = await fetchStats(range)
      const parsed = stats.map(s => {
        const { y, m, d, h } = s._id
        const dt = new Date(y, m - 1, d, h || 0)
        return { time: dt, avg: s.avg, min: s.min, max: s.max, count: s.count }
      })

      // Create body temperature chart data (simulated readings)
      const bodyTempData = parsed.map((item, index) => ({
        time: item.time,
        bodyTemp: 36.5 + Math.sin(index * 0.5) * 0.8 + Math.random() * 0.4, // Simulated body temp variations
        normalRange: 37.0,
        feverThreshold: 38.0
      }))
      setBodyTempChart(bodyTempData)
    })()
  }, [range, logs.length])

  const rows = useMemo(() => logs.slice().sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)), [logs])

  return (
    <div className="grid-main animate-enter">
      {/* Left Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
        {/* Input Panel */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '20px' }}>Your Temperature</h2>
          <p className="subtle" style={{ marginBottom: '24px' }}>Log a new reading</p>

          <form onSubmit={onAdd}>
            <div className="form-group">
              <label className="label">Temperature (°C)</label>
              <input
                className="input"
                placeholder="e.g. 36.6"
                type="number"
                step="0.1"
                value={valueCelsius}
                onChange={e => setValueCelsius(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Note (Optional)</label>
              <input
                className="input"
                placeholder="How are you feeling?"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Saving...' : 'Log Reading'}
            </button>
          </form>
        </div>

        {/* Fan Control */}
        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Climate Control</h3>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: fanOn ? 'var(--success)' : 'var(--text-muted)',
              boxShadow: fanOn ? '0 0 8px var(--success)' : 'none'
            }} />
          </div>

          <button
            onClick={toggleFan}
            className="btn"
            style={{
              width: '100%',
              background: fanOn ? 'var(--card)' : 'var(--bg)',
              border: '2px solid',
              borderColor: fanOn ? 'var(--primary)' : 'var(--border)',
              color: fanOn ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            {fanOn ? '🌀 Fan Active' : 'Off'}
          </button>
        </div>
      </div>

      {/* Right Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>

        {/* Chart Section */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0 }}>Temperature Trends</h3>
            <select
              className="input"
              style={{ width: 'auto', padding: '8px 12px' }}
              value={range}
              onChange={e => setRange(e.target.value)}
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
            </select>
          </div>

          <div className="chart-wrap" style={{ height: '350px', background: 'transparent', padding: 0 }}>
            <ResponsiveContainer>
              <AreaChart data={bodyTempChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="time"
                  tickFormatter={t => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  labelFormatter={l => new Date(l).toLocaleString()}
                  contentStyle={{
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-md)',
                    color: 'var(--text)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bodyTemp"
                  stroke="var(--primary)"
                  fill="url(#colorTemp)"
                  strokeWidth={3}
                  name="Temperature"
                />
                <Line type="monotone" dataKey="normalRange" stroke="var(--success)" dot={false} strokeWidth={2} strokeDasharray="5 5" name="Normal" />
                <Line type="monotone" dataKey="feverThreshold" stroke="var(--accent)" dot={false} strokeWidth={2} strokeDasharray="5 5" name="Fever" />
                <Legend iconType="circle" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Logs Table */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Recent Logs</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Time</th>
                  <th className="th">Temp</th>
                  <th className="th" style={{ width: '50%' }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(l => (
                  <tr key={l._id} className="tr">
                    <td className="td" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                      {new Date(l.recordedAt).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="td" style={{ fontWeight: 600 }}>
                      {l.valueCelsius.toFixed(1)}°C
                    </td>
                    <td className="td" style={{ color: 'var(--text-muted)' }}>
                      {l.note || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
