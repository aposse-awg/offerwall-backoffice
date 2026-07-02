import { useState, useEffect } from 'react'
import { getSessions, updateAllSessions } from '../api/sessionsApi'
import SessionsTable from '../components/SessionsTable.jsx'
import Insights from '../components/Insights-graphs.jsx'
import Kpis from '../components/Kpis.jsx'

function Dashboard() {
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

  const handleUpdateData = async (newSessions) => {
    setSessions(newSessions)
    try {
      await updateAllSessions(newSessions)
    } catch (err) {
      console.error('Error saving sessions:', err)
      alert('Failed to save changes')
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>

  return (
    <>
      <Kpis data={sessions} />
      <SessionsTable data={sessions} onUpdateData={handleUpdateData} />
      <Insights data={sessions} />
    </>
  )
}

export default Dashboard
