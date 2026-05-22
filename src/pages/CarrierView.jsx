import { useParams } from 'react-router-dom'
import sessions from '../data/sessions.json'
import SessionsTable from '../components/SessionsTable.jsx'
import Insights from '../components/Insights-graphs.jsx'
import Kpis from '../components/Kpis.jsx'

const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-')


function CarrierView() {
  const { carrierSlug } = useParams()

  const carrierSessions = sessions.filter(
    (s) => s.provider?.name && slugify(s.provider.name) === carrierSlug,
  )

  if (carrierSessions.length === 0) {
    return <h2 style={{ textAlign: 'center', padding: 40 }}>Carrier not found</h2>
  }

  const carrierName = carrierSessions[0].provider.name

  return (
    <>
      <h2 style={{ textAlign: 'center', margin: '16px 0' }}>{carrierName}</h2>
      <Kpis data={carrierSessions} />
      <SessionsTable data={carrierSessions} />
      <Insights data={carrierSessions} variant="carrier" />
    </>
  )
}

export default CarrierView