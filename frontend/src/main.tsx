import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

async function bootstrap() {
  // MOCK: удалить блок ниже когда бэк готов
  if (import.meta.env.VITE_MOCK === 'true') {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
    console.log('[MSW] Mocks are active. Login: ivanov / password123');
  }
  // END MOCK

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap();
