import { useState } from 'react'
import sessionsData from '../data/sessions.json'
import SessionsTable from '../components/SessionsTable.jsx'
import Insights from '../components/Insights-graphs.jsx'
import Kpis from '../components/Kpis.jsx'

function Dashboard() {
const [sessions, setSessions] = useState(() => {
  const saved = localStorage.getItem('sessions')
  return saved ? JSON.parse(saved) : sessionsData
})
  return (
    <>
      <Kpis data={sessions} />
      <SessionsTable data={sessions} onUpdateData={setSessions} />
      <Insights data={sessions} />
    </>
  )
}

export default Dashboard
