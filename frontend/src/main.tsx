import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

async function bootstrap() {
  // Моки включаются только если VITE_USE_MOCKS=true
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { installMockFetch } = await import('./mocks/mock-fetch'); installMockFetch()
    console.info('[mock] fetch перехвачен, бэк не нужен')
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

bootstrap()
