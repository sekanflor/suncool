import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import { useAuth, AuthProvider } from './lib/auth'
import { ThemeProvider, useTheme } from './lib/theme'

function Protected({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function Shell() {
  return (
    <div className="container">
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Protected><Dashboard /></Protected>} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </ThemeProvider>
  )
}

function Header() {
  const { token, user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  return (
    <header className="header glass">
      <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
        <span style={{ fontSize: '28px' }}>☀️</span>
        <span>Suncool</span>
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="btn btn-secondary" onClick={toggle} title="Toggle theme" style={{ padding: '8px 12px' }}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
        {token ? (
          <>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>
              {user?.name}
            </span>
            <button className="btn btn-secondary" onClick={logout} style={{ fontSize: '13px', padding: '8px 16px' }}>
              Sign out
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <Link className="nav-link" to="/login">Sign in</Link>
            <Link className="btn btn-primary" to="/signup" style={{ textDecoration: 'none', padding: '8px 20px' }}>
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
