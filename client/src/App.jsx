import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import { useAuth, AuthProvider } from './lib/auth'
import { ThemeProvider, useTheme } from './lib/theme'

function Protected({ children }){
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function Shell(){
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

export default function App(){
  return (
    <ThemeProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </ThemeProvider>
  )
}

function Header(){
  const { token, user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  return (
    <div className="header">
      <Link to="/" className="brand link" style={{ textDecoration:'none' }}>
        <span className="brand-badge" />
        <span>Suncool</span>
      </Link>
      <nav style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button className="button secondary" onClick={toggle} title="Toggle theme">{theme === 'dark' ? '☾' : '☼'}</button>
        {token ? (
          <>
            <span className="subtle" style={{ marginRight: 4 }}>{user?.name}</span>
            <button className="button" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="link" to="/login">Login</Link>
            <Link className="link" to="/signup">Sign up</Link>
          </>
        )}
      </nav>
    </div>
  )
}
