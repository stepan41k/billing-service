/**
 * Lightweight fetch interceptor.
 * No localStorage/sessionStorage - works in S3 iframe sandbox.
 */
import type {
  User,
  Balance,
  Contract,
  Payment,
  SupportTicket,
  SpeedTestResult,
  NetworkEvent,
  AppNotification,
} from '@/types';

const MOCK_TOKEN = 'mock-jwt-token-maxima-billing';

const MOCK_USER: User = {
  id: 1042,
  login: 'ivanov',
  client: 3901,
  contract: 7720,
  email: 'ivanov@mail.ru',
  phone: '+7 (960) 123-45-67',
  readOnly: false,
  lastActivity: '2026-03-23 10:12',
};

const MOCK_BALANCE: Balance = {
  amount: 1240.5,
  currency: 'RUB',
  updatedAt: '2026-03-23T09:00:00Z',
};

const MOCK_CONTRACTS: Contract[] = [
  {
    id: 1,
    number: 7720,
    status: 'active',
    tariff: 'Турбо 200',
    address: 'г. Великий Новгород, ул. Ленина, д. 12, кв. 4',
    created: '2024-05-10',
    pricePerMonth: 690,
    speedMbps: 200,
    unlimitedTraffic: true,
  },
  {
    id: 2,
    number: 7721,
    status: 'suspended',
    tariff: 'Стандарт 100',
    address: 'г. Великий Новгород, пр. Мира, д. 45, кв. 18',
    created: '2023-09-15',
    pricePerMonth: 450,
    speedMbps: 100,
    unlimitedTraffic: true,
  },
  {
    id: 3,
    number: 7722,
    status: 'closed',
    tariff: 'Эконом 50',
    address: 'г. Великий Новгород, ул. Чудинцева, д. 8',
    created: '2022-01-20',
    pricePerMonth: 350,
    speedMbps: 50,
    unlimitedTraffic: false,
    trafficLimitGb: 300,
  },
];

const MOCK_PAYMENTS: Payment[] = [
  { id: 1, date: '2026-03-20', amount: 690, type: 'deposit', description: 'Пополнение баланса (Сбер)', contractNumber: 7720 },
  { id: 2, date: '2026-03-01', amount: -690, type: 'charge', description: 'Списание за март - Турбо 200', contractNumber: 7720 },
  { id: 3, date: '2026-02-20', amount: 690, type: 'deposit', description: 'Пополнение баланса (Тинькофф)', contractNumber: 7720 },
  { id: 4, date: '2026-02-01', amount: -690, type: 'charge', description: 'Списание за февраль - Турбо 200', contractNumber: 7720 },
  { id: 5, date: '2026-01-15', amount: 150, type: 'refund', description: 'Возврат за перерасчёт', contractNumber: 7721 },
  { id: 6, date: '2026-01-01', amount: -450, type: 'charge', description: 'Списание за январь - Стандарт 100', contractNumber: 7721 },
];

let ticketIdCounter = 3;
const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 1,
    subject: 'Низкая скорость интернета',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2026-03-20T14:30:00Z',
    updatedAt: '2026-03-21T09:15:00Z',
    messages: [
      { id: 1, sender: 'user', text: 'Скорость упала до 20 Мбит/с при тарифе Турбо 200. Проверьте, пожалуйста.', createdAt: '2026-03-20T14:30:00Z' },
      { id: 2, sender: 'support', text: 'Здравствуйте! Проводим диагностику вашего подключения. Ожидайте ответа в течение 24 часов.', createdAt: '2026-03-21T09:15:00Z' },
    ],
  },
  {
    id: 2,
    subject: 'Вопрос по смене тарифа',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2026-03-10T11:00:00Z',
    updatedAt: '2026-03-11T16:45:00Z',
    messages: [
      { id: 3, sender: 'user', text: 'Можно ли перейти с Турбо 200 на Максимум 500 без перерыва?', createdAt: '2026-03-10T11:00:00Z' },
      { id: 4, sender: 'support', text: 'Да, переход происходит мгновенно. Зайдите в раздел "Договоры" и нажмите "Сменить тариф".', createdAt: '2026-03-11T16:45:00Z' },
    ],
  },
];

const MOCK_SPEEDTEST_HISTORY: SpeedTestResult[] = [
  { id: 1, date: '2026-03-23T10:00:00Z', downloadMbps: 187.4, uploadMbps: 94.2, pingMs: 3, server: 'Великий Новгород' },
  { id: 2, date: '2026-03-22T18:30:00Z', downloadMbps: 195.1, uploadMbps: 97.8, pingMs: 2, server: 'Великий Новгород' },
  { id: 3, date: '2026-03-21T09:15:00Z', downloadMbps: 178.6, uploadMbps: 89.3, pingMs: 4, server: 'Санкт-Петербург' },
  { id: 4, date: '2026-03-19T15:00:00Z', downloadMbps: 192.0, uploadMbps: 95.0, pingMs: 3, server: 'Москва' },
  { id: 5, date: '2026-03-17T20:45:00Z', downloadMbps: 201.3, uploadMbps: 99.1, pingMs: 2, server: 'Великий Новгород' },
];

const MOCK_NETWORK_EVENTS: NetworkEvent[] = [
  {
    id: 1,
    type: 'maintenance',
    title: 'Плановые работы на узле связи',
    description: 'Замена оборудования на узле ул. Большая Московская. Возможны кратковременные перерывы.',
    startAt: '2026-03-25T02:00:00Z',
    endAt: '2026-03-25T06:00:00Z',
    affectedArea: 'Центральный район',
  },
  {
    id: 2,
    type: 'resolved',
    title: 'Устранена авария на магистрали',
    description: 'Повреждение оптоволокна на участке ул. Фёдоровский ручей восстановлено.',
    startAt: '2026-03-22T08:00:00Z',
    endAt: '2026-03-22T14:30:00Z',
    affectedArea: 'Западный район',
  },
  {
    id: 3,
    type: 'info',
    title: 'Обновление ПО маршрутизаторов',
    description: 'В ночь с 26 на 27 марта будет произведено обновление прошивки. Перерыв до 5 минут.',
    startAt: '2026-03-27T01:00:00Z',
    affectedArea: 'Все районы',
  },
];

const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 1, type: 'payment', title: 'Оплата зачислена', body: 'Баланс пополнен на 690 ₽ через Сбер.', read: false, createdAt: '2026-03-20T12:00:00Z' },
  { id: 2, type: 'system', title: 'Плановые работы', body: 'Плановые работы 25 марта 02:00-06:00. Возможны перерывы.', read: false, createdAt: '2026-03-19T10:00:00Z', link: '/network' },
  { id: 3, type: 'alert', title: 'Ответ техподдержки', body: 'По вашему обращению #1 получен ответ.', read: true, createdAt: '2026-03-21T09:15:00Z', link: '/support' },
  { id: 4, type: 'promo', title: 'Новый тариф Максимум 500', body: 'Скорость до 500 Мбит/с за 990 ₽/мес. Подключите сейчас!', read: true, createdAt: '2026-03-15T08:00:00Z' },
  { id: 5, type: 'payment', title: 'Списание', body: 'Списано 690 ₽ за март по договору 7720.', read: true, createdAt: '2026-03-01T00:05:00Z' },
];

/* ── Route matching ── */
type RouteHandler = (req: Request, match: RegExpMatchArray | null) => Response | Promise<Response>;
interface MockRoute { method: string; pattern: RegExp; handler: RouteHandler; }

function delay<T>(ms: number, fn: () => T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(fn()), ms));
}

const routes: MockRoute[] = [
  /* Auth */
  {
    method: 'POST',
    pattern: /^\/api\/auth\/login$/,
    handler: async (req) => {
      const body = await req.json();
      if (body.login === 'ivanov' && body.password === 'password123') {
        return Response.json({ token: MOCK_TOKEN });
      }
      return Response.json({ message: 'Неверный логин или пароль' }, { status: 401 });
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/auth\/register$/,
    handler: async () => Response.json({ success: true }),
  },
  /* Profile */
  { method: 'GET', pattern: /^\/api\/profile$/, handler: () => Response.json(MOCK_USER) },
  { method: 'GET', pattern: /^\/api\/profile\/balance$/, handler: () => Response.json(MOCK_BALANCE) },
  { method: 'GET', pattern: /^\/api\/profile\/contracts$/, handler: () => Response.json(MOCK_CONTRACTS) },
  { method: 'GET', pattern: /^\/api\/profile\/payments$/, handler: () => Response.json(MOCK_PAYMENTS) },
  /* Support */
  { method: 'GET', pattern: /^\/api\/support\/tickets$/, handler: () => Response.json(MOCK_TICKETS) },
  {
    method: 'POST',
    pattern: /^\/api\/support\/tickets$/,
    handler: async (req) => {
      const { subject, text } = await req.json();
      const ticket: SupportTicket = {
        id: ++ticketIdCounter,
        subject,
        status: 'open',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [{ id: Date.now(), sender: 'user', text, createdAt: new Date().toISOString() }],
      };
      MOCK_TICKETS.unshift(ticket);
      return Response.json(ticket);
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/support\/tickets\/(\d+)\/reply$/,
    handler: async (req, match) => {
      const ticketId = Number(match?.[1]);
      const { text } = await req.json();
      const ticket = MOCK_TICKETS.find((t) => t.id === ticketId);
      if (!ticket) return Response.json({ message: 'Тикет не найден' }, { status: 404 });
      ticket.messages.push({ id: Date.now(), sender: 'user', text, createdAt: new Date().toISOString() });
      ticket.updatedAt = new Date().toISOString();
      return Response.json(ticket);
    },
  },
  /* Speed Test */
  { method: 'GET', pattern: /^\/api\/speedtest\/history$/, handler: () => Response.json(MOCK_SPEEDTEST_HISTORY) },
  {
    method: 'POST',
    pattern: /^\/api\/speedtest\/run$/,
    handler: () =>
      delay(2000, () => {
        const result: SpeedTestResult = {
          id: Date.now(),
          date: new Date().toISOString(),
          downloadMbps: 180 + Math.random() * 30,
          uploadMbps: 85 + Math.random() * 20,
          pingMs: 2 + Math.floor(Math.random() * 5),
          server: 'Великий Новгород',
        };
        MOCK_SPEEDTEST_HISTORY.unshift(result);
        return Response.json(result);
      }),
  },
  /* Network */
  { method: 'GET', pattern: /^\/api\/network\/events$/, handler: () => Response.json(MOCK_NETWORK_EVENTS) },
  /* Notifications */
  { method: 'GET', pattern: /^\/api\/notifications$/, handler: () => Response.json(MOCK_NOTIFICATIONS) },
  {
    method: 'PATCH',
    pattern: /^\/api\/notifications\/(\d+)\/read$/,
    handler: (_req, match) => {
      const id = Number(match?.[1]);
      const n = MOCK_NOTIFICATIONS.find((x) => x.id === id);
      if (n) n.read = true;
      return Response.json({ success: true });
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/api\/notifications\/read-all$/,
    handler: () => {
      MOCK_NOTIFICATIONS.forEach((n) => { n.read = true; });
      return Response.json({ success: true });
    },
  },
];

export function installMockFetch(): void {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (input, init) => {
    const req = new Request(input, init);
    const url = new URL(req.url, globalThis.location.origin);
    const pathname = url.pathname;
    const method = req.method.toUpperCase();

    for (const route of routes) {
      if (route.method === method) {
        const match = pathname.match(route.pattern);
        if (match) return route.handler(req, match);
      }
    }

    return originalFetch(input, init);
  };

  console.log('[Mock] Mocks active. Login: ivanov / password123');
}
