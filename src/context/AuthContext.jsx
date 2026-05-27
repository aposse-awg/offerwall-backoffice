import { createContext, useContext, useState } from 'react'

const USERS = {
  admin:  { password: 'admin123',  role: 'admin',           scope: null },
  claro:  { password: 'claro123',  role: 'payment-entity',  scope: 'claro-ar' },
  dlocal: { password: 'dlocal123', role: 'payment-entity',  scope: 'dlocal-ar' },
  shonen: { password: 'shonen123', role: 'publisher',       scope: 'shonengamespodcast' },
}



const AuthContext = createContext()


export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (username, password) => {
    const u = USERS[username]
    if (u && u.password === password) {
      const session = { username, role: u.role, scope: u.scope }
      setUser(session)
      localStorage.setItem('user', JSON.stringify(session))
      return session
    }
    return null
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)