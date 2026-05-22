import { useParams } from 'react-router-dom'
import sessions from '../data/sessions.json'
import SessionsTable from '../components/SessionsTable.jsx'
import Insights from '../components/Insights-graphs.jsx'
import Kpis from '../components/Kpis.jsx'


const PUBLISHERS = {
  shonengamespodcast: '00000000-0000-4000-8000-000000000001',
}

function PublisherView() {
  const { publisherSlug } = useParams()
  const publisherId = PUBLISHERS[publisherSlug]

  const publisherSessions = publisherId
    ? sessions.filter((s) => s.publisherId === publisherId)
    : []

  if (publisherSessions.length === 0) {
    return (
      <h2 style={{ textAlign: 'center', padding: 40 }}>Publisher not found</h2>
    )
  }

  return (
    <>
      <h2 style={{ textAlign: 'center', margin: '16px 0' }}>
        {publisherSlug}.com/
      </h2>
      <Kpis data={publisherSessions} />
      <SessionsTable data={publisherSessions} />
      <Insights data={publisherSessions} />
    </>
  )
}

export default PublisherView