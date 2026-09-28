const API_URL = import.meta.env.VITE_API_URL
const API_TOKEN = import.meta.env.VITE_API_TOKEN

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`
}

export const getSessions = async () => {
  const response = await fetch(`${API_URL}/sessions`, {
    headers
  })
  if (!response.ok) throw new Error('Failed to fetch sessions')
  const data = await response.json()
  return data.map(session => ({
    ...session,
    paidProviderName: session.paidProviderName || 'Test'
  }))
}

export const updateSession = async (sessionId, updatedSession) => {
  const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updatedSession)
  })
  if (!response.ok) throw new Error('Failed to update session')
  return response.json()
}

export const updateAllSessions = async (sessions) => {
  const promises = sessions.map(session =>
    updateSession(session.id, session).catch(err => {
      console.error(`Failed to update session ${session.id}:`, err)
      return null
    })
  )
  return Promise.all(promises)
}
