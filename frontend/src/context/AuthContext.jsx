import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      if (token) {
        try {
          const res = await authAPI.me()
          setUser(res.data)
          localStorage.setItem('user', JSON.stringify(res.data))
        } catch {
          logout()
        }
      }
      setLoading(false)
    }
    verify()
  }, [])

  const login = (data) => {
    const { token: jwt, user: userData } = data
    setToken(jwt)
    setUser(userData)
    localStorage.setItem('token', jwt)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAdmin = () => user?.role === 'Admin'
  const isDonor = () => user?.role === 'Donor' || user?.role === 'Admin'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isDonor }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthContext
