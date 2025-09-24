import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Login(){
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      nav('/')
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hero">
      <div className="panel">
        <h2 style={{ marginTop:0 }}>Welcome back</h2>
        <p className="subtle">Log in to track and visualize your temperature trends.</p>
        <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          {error && <div style={{ color: '#ff6b6b', marginBottom: 12 }}>{error}</div>}
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <button className="button" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
            <span className="subtle">No account? <Link className="link" to="/signup">Sign up</Link></span>
          </div>
        </form>
      </div>
      <div className="card">
        <h3 style={{ marginTop:0 }}>Why Suncool?</h3>
        <ul>
          <li>Fast logging with notes</li>
          <li>Beautiful charts for daily and weekly trends</li>
          <li>Secure account with JWT authentication</li>
        </ul>
        <p className="footer-note">Tip: switch theme using the ☾/☼ button in the header.</p>
      </div>
    </div>
  )
}
