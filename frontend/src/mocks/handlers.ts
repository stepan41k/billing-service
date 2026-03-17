import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/login', async ({ request }: { request: Request }) => {
    const body = (await request.json()) as { login: string; password: string }
    if (body.login === 'ivan' && body.password === 'pwd123') {
      return HttpResponse.json({ token: 'mock-jwt-token' })
    }
    return new HttpResponse('Неверный логин или пароль', { status: 401 })
  }),

  // TODO: удалить когда бэк реализует POST /api/register
  // Go-бэк должен: создать запись в CABINET, вернуть { success: true }
  http.post('/api/register', async ({ request }: { request: Request }) => {
    const body = (await request.json()) as {
      login: string
      password: string
      email: string
      phone: string
    }
    // Симулируем занятый логин
    if (body.login === 'ivanov') {
      return HttpResponse.json({ success: false, message: 'Пользователь уже существует' }, { status: 409 })
    }
    // Симулируем задержку сети
    await new Promise(r => setTimeout(r, 600))
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/profile', () =>
    HttpResponse.json({
      id: 1,
      login: 'ivanov',
      client: 100,
      contract: 5001,
      email: 'ivanov@mail.ru',
      phone: '+79001234567',
      readOnly: false,
      lastActivity: new Date().toISOString(),
    }),
  ),

  http.get('/api/balance', () =>
    HttpResponse.json({
      amount: 570,
      currency: 'RUB',
      updatedAt: new Date().toISOString(),
    }),
  ),

  http.get('/api/contracts', () =>
    HttpResponse.json([
      {
        id: 1,
        number: 5001,
        status: 'active',
        tariff: 'Домашний 100',
        address: 'ул. Ленина, 12, кв. 45',
        created: '2022-03-15',
        pricePerMonth: 490,
        speedMbps: 100,
        unlimitedTraffic: true,
      },
      {
        id: 2,
        number: 5002,
        status: 'suspended',
        tariff: 'Бизнес 500',
        address: 'пр. Мира, 8, офис 301',
        created: '2021-11-01',
        pricePerMonth: 1200,
        speedMbps: 500,
        unlimitedTraffic: false,
        trafficLimitGb: 300,
      },
      {
        id: 3,
        number: 5003,
        status: 'closed',
        tariff: 'Домашний 50',
        address: 'ул. Садовая, 3, кв. 12',
        created: '2020-06-20',
        pricePerMonth: 290,
        speedMbps: 50,
        unlimitedTraffic: true,
      },
    ]),
  ),

  http.get('/api/payments', () =>
    HttpResponse.json([
      {
        id: 1,
        date: '2026-03-10',
        amount: 500,
        type: 'deposit',
        description: 'Пополнение счёта',
        contractNumber: 5001,
      },
      {
        id: 2,
        date: '2026-03-01',
        amount: 490,
        type: 'charge',
        description: 'Абонентская плата март',
        contractNumber: 5001,
      },
      {
        id: 3,
        date: '2026-02-20',
        amount: 120.5,
        type: 'refund',
        description: 'Перерасчёт за февраль',
        contractNumber: 5002,
      },
      {
        id: 4,
        date: '2026-02-01',
        amount: 490,
        type: 'charge',
        description: 'Абонентская плата февраль',
        contractNumber: 5001,
      },
      {
        id: 5,
        date: '2026-01-15',
        amount: 1000,
        type: 'deposit',
        description: 'Пополнение счёта',
        contractNumber: 5001,
      },
      {
        id: 6,
        date: '2026-01-01',
        amount: 490,
        type: 'charge',
        description: 'Абонентская плата январь',
        contractNumber: 5001,
      },
    ]),
  ),
]
