import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSessions, updateAllSessions } from '../api/sessionsApi'
import SessionsTable from '../components/SessionsTable.jsx'
import Insights from '../components/Insights-graphs.jsx'
import Kpis from '../components/Kpis.jsx'

const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-')

function PaymentEntityView() {
  const { paymentEntitySlug } = useParams()
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

  const paymentEntitySessions = sessions.filter(
    (s) => s.provider?.name && slugify(s.provider.name) === paymentEntitySlug,
  )

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>

  if (paymentEntitySessions.length === 0) {
    return (
      <h2 style={{ textAlign: 'center', padding: 40 }}>
        Payment Entity not found
      </h2>
    )
  }

  const paymentEntityName = paymentEntitySessions[0].provider.name

  const handleUpdateData = async (editedSessions) => {
    const updatedAllSessions = sessions.map((session) => {
      const edited = editedSessions.find((e) => e.id === session.id)
      return edited || session
    })

    setSessions(updatedAllSessions)
    try {
      await updateAllSessions(updatedAllSessions)
    } catch (err) {
      console.error('Error saving sessions:', err)
      alert('Failed to save changes')
    }
  }

  return (
    <>
      <h2 style={{ textAlign: 'center', margin: '16px 0' }}>
        {paymentEntityName}
      </h2>
      <Kpis data={paymentEntitySessions} />
      <SessionsTable
        data={paymentEntitySessions}
        onUpdateData={handleUpdateData}
      />
      <Insights data={paymentEntitySessions} variant="payment-entity" />
    </>
  )
}

export default PaymentEntityView
