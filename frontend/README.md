# Максима - Личный кабинет (Frontend)

Фронтенд личного кабинета абонента для провайдера «Максима» (г. Великий Новгород).  
Работает полностью на моках - бэкенд не требуется для запуска.

## Стек

- **React 18** + **TypeScript**
- **Vite** - сборка и dev-сервер
- **Tailwind CSS** - стилизация (кастомная дизайн-система light/dark)
- **Zustand** - управление состоянием (11 сторов)
- **framer-motion** - анимации переходов и списков
- **lucide-react** - иконки
- **Docker** + **nginx** - продакшн-деплой

## Быстрый старт

```bash
# Dev-режим
npm install
npm run dev          # http://localhost:5173

# Docker
docker-compose up --build   # http://localhost:3000
```

**Тестовый аккаунт:** `ivanov` / `password123`

## Архитектура

Слоёная структура без кросс-импортов между уровнями:

```
types → api/client → services → stores → components → pages
```

```
src/
├── types/           # Доменные типы (User, Contract, Payment...)
├── api/client.ts    # HTTP-клиент, все запросы через fetch
├── services/        # Тонкие обёртки над api (AuthService, ProfileService...)
├── stores/          # Zustand-сторы (auth, profile, balance, contracts...)
├── lib/             # Утилиты (token - in-memory JWT, utils - cn helper)
├── mocks/           # Fetch-интерцептор с regex-роутингом
├── components/      # Layout, Sidebar, Header, UI-компоненты
└── pages/           # Страницы приложения
```

## Страницы

| Страница      | Путь             | Описание                                    |
| ------------- | ---------------- | ------------------------------------------- |
| Login         | `/login`         | Авторизация + canvas-анимация сети          |
| Register      | `/register`      | Регистрация нового абонента                 |
| Profile       | `/profile`       | Данные пользователя + карточка баланса      |
| Contracts     | `/contracts`     | Список договоров (expand/collapse)          |
| Payments      | `/payments`      | История платежей с цветовыми иконками       |
| Support       | `/support`       | Тикеты техподдержки + чат                   |
| SpeedTest     | `/speedtest`     | Тест скорости (3 метрики) + история         |
| NetworkStatus | `/network`       | Timeline сетевых событий                    |
| Notifications | `/notifications` | Уведомления (непрочитанные + mark all read) |

## Моки

Все API-запросы перехватываются клиентским fetch-интерцептором (`src/mocks/mock-fetch.ts`).  
Бэкенд не нужен - моки работают прямо в браузере.

### Замоканные эндпоинты

| Метод | Путь                             | Описание                           |
| ----- | -------------------------------- | ---------------------------------- |
| POST  | `/api/auth/login`                | Авторизация (ivanov / password123) |
| POST  | `/api/auth/register`             | Регистрация (всегда success)       |
| GET   | `/api/profile`                   | Данные пользователя                |
| GET   | `/api/profile/balance`           | Баланс                             |
| GET   | `/api/profile/contracts`         | Список договоров                   |
| GET   | `/api/profile/payments`          | История платежей                   |
| GET   | `/api/support/tickets`           | Список тикетов                     |
| POST  | `/api/support/tickets`           | Создание тикета                    |
| POST  | `/api/support/tickets/:id/reply` | Ответ в тикете                     |
| GET   | `/api/speedtest/history`         | История замеров скорости           |
| POST  | `/api/speedtest/run`             | Запуск замера (задержка 2с)        |
| GET   | `/api/network/events`            | Сетевые события                    |
| GET   | `/api/notifications`             | Уведомления                        |
| PATCH | `/api/notifications/:id/read`    | Пометить как прочитанное           |
| PATCH | `/api/notifications/read-all`    | Пометить все как прочитанные       |

## Подключение бэкенда

### 1. Отключить моки

В `src/main.tsx` убрать (или закомментировать) вызов:

```typescript
// import { installMockFetch } from '@/mocks/mock-fetch';
// installMockFetch();
```

### 2. Настроить proxy для dev-сервера

В `vite.config.ts` добавить:

```typescript
export default defineConfig({
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8010',
        changeOrigin: true,
      },
    },
  },
})
```

### 3. Вернуть proxy в nginx (Docker)

В `docker/nginx.conf` добавить блок перед кешированием статики:

```nginx
# Proxy API to backend (Go on port 8010)
location /api/ {
    proxy_pass http://backend:8010;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 4. Добавить backend в docker-compose.yml

```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:80'
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: ../billing-service
      dockerfile: Dockerfile
    ports:
      - '8010:8010'
    restart: unless-stopped
```

### 5. Контракт API

Фронтенд ожидает, что бэкенд вернёт данные в формате, описанном в `src/types/index.ts`.  
Основные моменты:

- **Авторизация**: POST `/api/auth/login` принимает `{ login, password }`, возвращает `{ token }` (JWT)
- **Токен**: передаётся в заголовке `Authorization: Bearer <token>`
- **Ошибки**: ожидается `{ message: string }` в теле ответа при HTTP >= 400
- **Даты**: ISO 8601 строки (например `2026-03-23T10:00:00Z`)
- **Деньги**: `amount` в числе (копейки не нужны, передаётся как float - `1240.50`)

### 6. Что может потребовать доработки

- **Пагинация** - сейчас все списки загружаются целиком. Для больших объёмов добавить `?page=1&limit=20`
- **Фильтрация платежей** - по дате, типу, договору (на бэке)
- **Загрузка файлов** - если в тикетах нужны вложения
- **WebSocket** - для real-time уведомлений вместо polling
- **Смена тарифа / пароля** - кнопки есть в UI, но эндпоинты не реализованы
- **Speed Test** - сейчас мок генерирует случайные числа, на проде нужна реальная логика измерения

## Сборка

```bash
npm run build        # TypeScript check + Vite build → dist/
```

Результат: ~326 KB JS (106 KB gzip), ~21 KB CSS (5 KB gzip).

## Структура Docker

```
Dockerfile              # Multi-stage: node:20-alpine (build) → nginx:alpine (serve)
docker-compose.yml      # Только frontend, порт 3000
docker/nginx.conf       # gzip, SPA fallback, кеш статики, security headers
.dockerignore           # node_modules, dist, .git
```
