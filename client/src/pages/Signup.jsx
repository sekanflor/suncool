import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Signup(){
  const { signup } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(name, email, password)
      nav('/')
    } catch (e) {
      setError(e.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hero">
      <div className="panel">
        <h2 style={{ marginTop:0 }}>Create your account</h2>
        <p className="subtle">Start tracking temperatures and see clear trends over time.</p>
        <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
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
            <button className="button" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
            <span className="subtle">Have an account? <Link className="link" to="/login">Login</Link></span>
          </div>
        </form>
      </div>
      <div className="card">
        <h3 style={{ marginTop:0 }}>What you get</h3>
        <ul>
          <li>Quick, simple logging</li>
          <li>Insightful daily and weekly charts</li>
          <li>Clean and responsive UI</li>
        </ul>
      </div>
    </div>
  )
}
