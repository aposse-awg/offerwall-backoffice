const API_URL = 'https://develop.dgad-nonprod.awg.services/offerwall-api/dashboard'

export const getSessions = async () => {
  const response = await fetch(`${API_URL}/sessions`)
  if (!response.ok) throw new Error('Failed to fetch sessions')
  return response.json()
}

export const updateSession = async (sessionId, updatedSession) => {
  const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
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
