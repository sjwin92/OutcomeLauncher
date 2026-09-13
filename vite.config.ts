import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Project Pages lives at /OutcomeLauncher/. Local `npm run dev` stays at `/`.
  base: process.env.GITHUB_PAGES === 'true' ? '/OutcomeLauncher/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
