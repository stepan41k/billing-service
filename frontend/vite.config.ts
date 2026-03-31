import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_API_URL || 'http://localhost:8080'

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    build: {
      target: 'es2020',
      sourcemap: false,
    },
    server: {
      // Dev-proxy: перенаправляет /api/* → бэк с нужным rewrite путей
      proxy: {
        '/api/auth/login': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: () => '/login',
        },
        '/api/auth/register': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: () => '/profile',
        },
        '/api/profile': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: () => '/profile',
        },
        // Остальные /api/* — тоже проксируем, стриппим /api
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },
  }
})
