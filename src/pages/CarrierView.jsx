import { useParams } from 'react-router-dom'
import sessions from '../data/sessions.json'
import SessionsTable from '../components/SessionsTable.jsx'
import Insights from '../components/Insights-graphs.jsx'
import Kpis from '../components/Kpis.jsx'

const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-')


function PaymentEntityView() {
  const { paymentEntitySlug } = useParams()

  const paymentEntitySessions = sessions.filter(
    (s) => s.provider?.name && slugify(s.provider.name) === paymentEntitySlug,
  )

  if (paymentEntitySessions.length === 0) {
    return <h2 style={{ textAlign: 'center', padding: 40 }}>Payment Entity not found</h2>
  }

  const paymentEntityName = paymentEntitySessions[0].provider.name

  return (
    <>
      <h2 style={{ textAlign: 'center', margin: '16px 0' }}>{paymentEntityName}</h2>
      <Kpis data={paymentEntitySessions} />
      <SessionsTable data={paymentEntitySessions} />
      <Insights data={paymentEntitySessions} variant="payment-entity" />
    </>
  )
}

export default PaymentEntityView