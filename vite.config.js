import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Loaded without the VITE_ prefix filter so the token stays in Node and is never bundled.
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.OFFERWALL_API_URL || 'https://offerwall.digadv-dev.click/offerwall-api'

  return {
    plugins: [react()],
    server: {
      // Dev-only mirror of api/sessions.js (Vercel function)
      proxy: {
        '/api/sessions': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/sessions/, '/admin/v1/reports/sessions'),
          headers: { Authorization: `Bearer ${env.ADMIN_TOKEN}` },
        },
      },
    },
  }
})
