import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }){
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(){
  return useContext(ThemeContext)
}
