import { useParams } from 'react-router-dom'
import { useState } from 'react'
import sessionsData from '../data/sessions.json'
import SessionsTable from '../components/SessionsTable.jsx'
import Insights from '../components/Insights-graphs.jsx'
import Kpis from '../components/Kpis.jsx'

const PUBLISHERS = {
  shonengamespodcast: '00000000-0000-4000-8000-000000000001',
}

function PublisherView() {
  const { publisherSlug } = useParams()
  const publisherId = PUBLISHERS[publisherSlug]

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('sessions')
    return saved ? JSON.parse(saved) : sessionsData
  })

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
      <SessionsTable
        data={publisherSessions}
        onUpdateData={(editedSessions) => {
          // Mapear cambios de vuelta a todas las sesiones
          const updatedAllSessions = sessions.map((session) => {
            const edited = editedSessions.find((e) => e.id === session.id)
            return edited || session
          })

          setSessions(updatedAllSessions)
          localStorage.setItem('sessions', JSON.stringify(updatedAllSessions))
        }}
      />

      <Insights data={publisherSessions} />
    </>
  )
}

export default PublisherView
