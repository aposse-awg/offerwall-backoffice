// Vercel serverless function: proxies the admin sessions report so ADMIN_TOKEN never reaches the browser.
import process from 'node:process'

const API_URL =
  process.env.OFFERWALL_API_URL || 'https://offerwall.digadv-dev.click/offerwall-api'

const ALLOWED_PARAMS = [
  'publisherId',
  'status',
  'providerId',
  'paidProviderType',
  'isTestPayment',
  'from',
  'to',
]

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.ADMIN_TOKEN
  if (!token) return res.status(500).json({ error: 'ADMIN_TOKEN not configured' })

  const params = new URLSearchParams()
  for (const key of ALLOWED_PARAMS) {
    const value = req.query[key]
    if (value) params.set(key, value)
  }

  const upstream = await fetch(`${API_URL}/admin/v1/reports/sessions?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const body = await upstream.text()
  res.status(upstream.status)
  res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  return res.send(body)
}
