# Maxima - Billing System

Система биллинга для интернет-провайдера с веб-интерфейсом для клиентов.

## Технологии

### Backend
- **Go 1.26** - серверная часть
- **Chi** - HTTP router
- **FirebirdSQL** - база данных
- **JWT** - аутентификация (access/refresh tokens)
- **golang-migrate** - миграции базы данных
- **zap** - structured logging

### Frontend
- **React 18** + **TypeScript**
- **Vite** - сборка
- **Tailwind CSS** - стилизация
- **Zustand** - state management
- **Framer Motion** - анимации
- **React Router** - маршрутизация
- **Lucide React** - иконки

### Infrastructure
- **Docker** / **Docker Compose** - контейнеризация
- **Nginx** - reverse proxy, SSL termination

## Структура проекта

```
.
├── backend/           # Go сервер
│   ├── cmd/          # Точки входа (billing, migrator)
│   ├── internal/     # Приватный код
│   │   ├── app/      # Инициализация приложения
│   │   ├── config/   # Конфигурация
│   │   ├── domain/   # Доменные модели и ошибки
│   │   ├── http/     # HTTP handlers и middleware
│   │   ├── lib/      # Утилиты
│   │   ├── models/   # Модели данных
│   │   ├── repository/ # Работа с БД
│   │   └── service/  # Бизнес-логика
│   └── migrations/   # SQL миграции
├── frontend/         # React приложение
│   └── src/
│       ├── api/      # API клиент
│       ├── components/ # UI компоненты
│       ├── pages/    # Страницы
│       ├── services/ # Сервисы
│       ├── stores/   # Zustand stores
│       └── types/    # TypeScript типы
├── deploy/           # Docker Compose конфигурация
└── nginx/            # Nginx конфигурация
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/login` | No | Аутентификация |
| POST | `/profile` | No | Регистрация клиента |
| GET | `/profile` | Yes | Получение данных профиля |

## Запуск

### Development

**Backend:**
```bash
cd backend
cp .env.example .env
make run
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Production (Docker)

```bash
cd deploy
cp .env.example .env
# Настройте переменные окружения в .env
docker-compose up -d
```

## Переменные окружения

### Backend (.env)
```
FB_HOST=localhost
FB_USER=SYSDBA
FB_PASSWORD=masterkey
FB_NAME=billing.fdb
FB_PORT=3050
ACCESS_SECRET=<jwt-access-secret>
REFRESH_SECRET=<jwt-refresh-secret>
```

### Frontend (.env)
```
VITE_USE_MOCKS=false
VITE_API_URL=/api
VITE_ENV=development
```

### Deploy (.env)
```
FB_HOST=firebird-server
FB_USER=SYSDBA
FB_PASSWORD=masterkey
FB_NAME=billing.fdb
FB_PORT=3050
BILLING_ACCESS_SECRET=<jwt-access-secret>
BILLING_REFRESH_SECRET=<jwt-refresh-secret>
VITE_USE_MOCKS=false
VITE_ENV=production
```

## Фичи

- **Аутентификация** - вход/регистрация с JWT токенами
- **Профиль** - управление данными аккаунта
- **Контракты** - просмотр договоров
- **Платежи** - история и управление платежами
- **Статус сети** - мониторинг подключения
- **Уведомления** - система оповещений
- **Тест скорости** - проверка пропускной способности
- **Поддержка** - обращения в техподдержку

## SSL

Для работы с SSL-сертификатами разместите их в `deploy/certs/`:
- `server.crt` - сертификат
- `server.key` - приватный ключ
