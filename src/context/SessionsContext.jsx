import { createContext, useContext, useEffect, useState } from 'react'
import { getSessions } from '../api/sessionsApi'

const SessionsContext = createContext()

export function SessionsProvider({ children }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch(err => {
        console.error('Error loading sessions:', err)
        alert('Failed to load sessions')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <SessionsContext.Provider value={{ sessions, setSessions, loading }}>
      {children}
    </SessionsContext.Provider>
  )
}

export const useSessions = () => useContext(SessionsContext)
