import { useSessions } from '../context/SessionsContext.jsx'
import SessionsTable from '../components/SessionsTable.jsx'
import Insights from '../components/Insights-graphs.jsx'
import Kpis from '../components/Kpis.jsx'

function Dashboard() {
  const { sessions, setSessions, loading } = useSessions()

  // The reports API is read-only: edits live in memory until reload
  const handleUpdateData = (newSessions) => {
    setSessions(newSessions)
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
