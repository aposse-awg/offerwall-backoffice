import sessions from '../data/sessions.json'
import SessionsTable from '../components/SessionsTable.jsx'
import Insights from '../components/Insights-graphs.jsx'
import Kpis from '../components/Kpis.jsx'

function Dashboard() {
  return (
    <>
      <Kpis data={sessions} />
      <SessionsTable data={sessions} />
      <Insights data={sessions} />
    </>
  )
}

export default Dashboard
