/**
 * Client-side fetch interceptor. Replaces window.fetch with a mock
 * that handles /api/* routes without hitting the network.
 * Activated only when VITE_USE_MOCKS=true (see main.tsx).
 */

const MOCK_TOKEN = 'mock-jwt-token-ivanov';

const MOCK_USER = {
  id: 1, login: 'ivanov', name: 'Иван Иванов',
  email: 'ivanov@mail.ru', phone: '+7 (800) 123-45-67',
  contractNumber: 'Д-12345', clientNumber: '67890', isReadOnly: false,
};

const MOCK_BALANCE = { amount: 1240.50, currency: 'RUB', updatedAt: new Date().toISOString() };

const MOCK_CONTRACTS = [
  { id: 1, number: 'Д-12345', tariff: 'Домашний 500', speedMbps: 500, status: 'active',
    address: 'ул. Ленина, 10, кв. 5', pricePerMonth: 590, unlimitedTraffic: true, trafficLimitGb: 0, created: '2023-01-15T00:00:00Z' },
];

const MOCK_PAYMENTS = [
  { id: 1, date: '2026-03-01T10:00:00Z', amount: 590, type: 'deposit', description: 'Оплата тарифа', contractNumber: 'Д-12345' },
  { id: 2, date: '2026-02-01T10:00:00Z', amount: 590, type: 'deposit', description: 'Оплата тарифа', contractNumber: 'Д-12345' },
];

const MOCK_TICKETS = [
  { id: 1, subject: 'Нет интернета', status: 'open', priority: 'high',
    createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-03-20T10:00:00Z',
    messages: [{ id: 1, sender: 'user', text: 'Пропало соединение', createdAt: '2026-03-20T10:00:00Z' }] },
];

const MOCK_SPEEDTEST = [
  { id: 1, downloadMbps: 487.3, uploadMbps: 94.1, pingMs: 8, createdAt: '2026-03-31T18:00:00Z' },
];

const MOCK_NETWORK_EVENTS = [
  { id: 1, type: 'resolved', title: 'Плановое обслуживание', description: 'Работы завершены',
    startedAt: '2026-03-30T02:00:00Z', resolvedAt: '2026-03-30T06:00:00Z' },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'info', title: 'Добро пожаловать', body: 'Вход выполнен успешно', read: false, createdAt: '2026-03-31T00:00:00Z' },
];

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

type RouteHandler = (url: URL, init?: RequestInit) => Response | null;

const routes: RouteHandler[] = [
  // Auth
  (url, init) => {
    if (url.pathname === '/api/auth/login' && init?.method === 'POST') {
      const body = JSON.parse((init.body as string) ?? '{}');
      if (body.login === 'ivanov' && body.password === 'password123') {
        return json({ access_token: MOCK_TOKEN, refresh_token: 'mock-refresh-token', profile: { id: MOCK_USER.id, login: MOCK_USER.login, is_read_only: false, client: MOCK_USER.clientNumber ?? '', contract: MOCK_USER.contractNumber ?? '', phone_number: MOCK_USER.phone ?? '', email: MOCK_USER.email } });
      return json({ error: 'Неверный логин или пароль' }, 401);
      }
      return json({ body: 'Неверный логин или пароль' }, 401);
    }
    return null;
  },
  (url, init) => {
    if (url.pathname === '/api/auth/register' && init?.method === 'POST') {
      return json({ success: true });
    }
    return null;
  },
  (url) => url.pathname === '/api/profile' ? json(MOCK_USER) : null,
  (url) => url.pathname === '/api/profile/balance' ? json(MOCK_BALANCE) : null,
  (url) => url.pathname === '/api/profile/contracts' ? json(MOCK_CONTRACTS) : null,
  (url) => url.pathname === '/api/profile/payments' ? json(MOCK_PAYMENTS) : null,
  // Support
  (url, init) => {
    if (url.pathname === '/api/support/tickets') {
      if (init?.method === 'POST') {
        const body = JSON.parse((init.body as string) ?? '{}');
        const t = { id: Date.now(), subject: body.subject ?? '', status: 'open', priority: 'medium',
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          messages: [{ id: 1, sender: 'user', text: body.text ?? '', createdAt: new Date().toISOString() }] };
        return json(t);
      }
      return json(MOCK_TICKETS);
    }
    return null;
  },
  (url, init) => {
    const m = url.pathname.match(/^\/api\/support\/tickets\/(\d+)\/reply$/);
    if (m && init?.method === 'POST') {
      return json({ ...MOCK_TICKETS[0], id: Number(m[1]) });
    }
    return null;
  },
  (url) => url.pathname === '/api/speedtest/history' ? json(MOCK_SPEEDTEST) : null,
  (url, init) => url.pathname === '/api/speedtest/run' && init?.method === 'POST'
    ? json({ id: Date.now(), downloadMbps: 490 + Math.random() * 20, uploadMbps: 90 + Math.random() * 10, pingMs: 7 + Math.floor(Math.random() * 5), createdAt: new Date().toISOString() })
    : null,
  (url) => url.pathname === '/api/network/events' ? json(MOCK_NETWORK_EVENTS) : null,
  (url) => url.pathname === '/api/notifications' ? json(MOCK_NOTIFICATIONS) : null,
  (url, init) => {
    const m = url.pathname.match(/^\/api\/notifications\/(\d+)\/read$/);
    if (m && init?.method === 'PATCH') return json({ success: true });
    return null;
  },
  (url, init) => {
    if (url.pathname === '/api/notifications/read-all' && init?.method === 'PATCH') return json({ success: true });
    return null;
  },
];

export function installMockFetch(): void {
  const _realFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = new URL(input.toString(), window.location.href);

    if (url.pathname.startsWith('/api/')) {
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 150 + Math.random() * 200));

      for (const handler of routes) {
        const res = handler(url, init);
        if (res) return res;
      }

      return json({ message: `Mock: no handler for ${url.pathname}` }, 404);
    }

    return _realFetch(input, init);
  };
}
