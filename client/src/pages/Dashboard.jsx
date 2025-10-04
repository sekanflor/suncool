import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line } from 'recharts'

export default function Dashboard(){
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
    console.log('Toggle fan clicked, current state:', fanOn)
    setFanOn(!fanOn)
    console.log('Fan toggled to:', !fanOn)
  }

  const [bodyTempChart, setBodyTempChart] = useState([])
  
  useEffect(() => {
    (async () => {
      const stats = await fetchStats(range)
      const parsed = stats.data.map(s => {
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
        
        <div style={{ 
          marginTop: 16, 
          padding: '20px', 
          background: 'linear-gradient(135deg, var(--card-2) 0%, var(--panel) 100%)', 
          borderRadius: 'var(--radius)', 
          border: '2px solid var(--orange)',
          boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)'
        }}>
          <h4 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '18px', 
            color: 'var(--orange)',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🌪️ Fan Control
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={toggleFan}
              style={{ 
                minWidth: '140px',
                padding: '12px 24px',
                backgroundColor: fanOn ? '#4a90e2' : '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: fanOn ? '0 6px 20px rgba(74, 144, 226, 0.4)' : '0 6px 20px rgba(255, 107, 53, 0.4)',
                transition: 'all 0.3s ease',
                transform: fanOn ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {fanOn ? '🌀 Fan ON' : '🌀 Fan OFF'}
            </button>
            <span className="subtle" style={{ fontSize: '16px', fontWeight: '500' }}>
              {fanOn ? '💨 Cooling active' : '😴 Fan is off'}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop:0 }}>Body Temperature Chart</h3>
        <div className="chart-wrap">
          <ResponsiveContainer>
            <AreaChart data={bodyTempChart} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="time" 
                tickFormatter={t=>new Date(t).toLocaleString()} 
                stroke="var(--muted)"
                tick={{ fill: 'var(--text)', fontSize: 12 }}
              />
              <YAxis 
                domain={[35, 39]} 
                stroke="var(--muted)"
                tick={{ fill: 'var(--text)', fontSize: 12 }}
              />
              <Tooltip 
                labelFormatter={l=>new Date(l).toLocaleString()}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="bodyTemp" 
                stroke="var(--gold)" 
                fill="var(--gold)" 
                fillOpacity={0.4}
                strokeWidth={4}
                name="Body Temperature"
              />
              <Line type="monotone" dataKey="normalRange" stroke="#2bc016" dot={false} strokeWidth={3} strokeDasharray="5 5" name="Normal Range" />
              <Line type="monotone" dataKey="feverThreshold" stroke="#ff6b6b" dot={false} strokeWidth={3} strokeDasharray="5 5" name="Fever Threshold" />
              <Legend 
                wrapperStyle={{ 
                  color: 'var(--text)', 
                  fontSize: '12px',
                  paddingTop: '10px'
                }}
              />
            </AreaChart>
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
