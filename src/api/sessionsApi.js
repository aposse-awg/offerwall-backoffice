// filters: publisherId, status, providerId, paidProviderType, isTestPayment, from, to
export const getSessions = async (filters = {}) => {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )
  const response = await fetch(`/api/sessions?${params}`)
  if (!response.ok) throw new Error('Failed to fetch sessions')
  const data = await response.json()
  const list = Array.isArray(data) ? data : data.data ?? data.items ?? []
  return list.map(session => ({
    ...session,
    paidProviderName: session.paidProviderName || 'Test'
  }))
}
