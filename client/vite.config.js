import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      proxy: {
        "/service": {
          target: "https://e2425-wads-project.csbihub.id/server",
          changeOrigin: true,
          secure: true,
          ws: true,
        },
      },
      host: '0.0.0.0',
      port: 3001
    },
    build: {
      outDir: "dist",
    },
    plugins: [react(), tailwindcss()],
  }
})
