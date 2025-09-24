import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete axios.defaults.headers.common['Authorization']
  }, [token])

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const signup = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/signup', { name, email, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const value = { token, user, login, signup, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
  return useContext(AuthContext)
}
