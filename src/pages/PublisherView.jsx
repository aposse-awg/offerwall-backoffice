import { useParams } from 'react-router-dom'
import { useSessions } from '../context/SessionsContext.jsx'
import SessionsTable from '../components/SessionsTable.jsx'
import Insights from '../components/Insights-graphs.jsx'
import Kpis from '../components/Kpis.jsx'

const PUBLISHERS = {
  shonengamespodcast: '00000000-0000-4000-8000-000000000001',
}

function PublisherView() {
  const { publisherSlug } = useParams()
  const publisherId = PUBLISHERS[publisherSlug]

  const { sessions, setSessions, loading } = useSessions()

  const publisherSessions = publisherId
    ? sessions.filter((s) => s.publisherId === publisherId)
    : []

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>

  if (publisherSessions.length === 0) {
    return (
      <h2 style={{ textAlign: 'center', padding: 40 }}>Publisher not found</h2>
    )
  }

  const handleUpdateData = (editedSessions) => {
    const updatedAllSessions = sessions.map((session) => {
      const edited = editedSessions.find((e) => e.id === session.id)
      return edited || session
    })

    // The reports API is read-only: edits live in memory until reload
    setSessions(updatedAllSessions)
  }

  return (
    <>
      <h2 style={{ textAlign: 'center', margin: '16px 0' }}>
        {publisherSlug}.com/
      </h2>
      <Kpis data={publisherSessions} />
      <SessionsTable
        data={publisherSessions}
        onUpdateData={handleUpdateData}
      />

      <Insights data={publisherSessions} />
    </>
  )
}

export default PublisherView
