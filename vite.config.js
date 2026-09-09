import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { accessServerPlugin } from './server/vite-plugin.js'

export default defineConfig(({ mode }) => {
  // Server-side config only. These are NEVER exposed to the browser: they are
  // read by the access server in-process, and carry no VITE_ prefix, so Vite
  // will not inline them into the client bundle.
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of [
    'PORTAL_URL',
    'PUBLIC_ORIGIN',
    'SESSION_SECRET',
    'PORTAL_CLIENT_ID',
    'PORTAL_CLIENT_SECRET',
  ]) {
    process.env[key] ||= env[key]
  }

  return {
    plugins: [react(), accessServerPlugin()],
    server: { port: 5173, strictPort: true },
    preview: { port: 4173 },
  }
})
