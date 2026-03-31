# Максима — Личный кабинет

> Веб-приложение для абонентов интернет-провайдера «Максима» (г. Великий Новгород).  
> Позволяет управлять договорами, просматривать историю платежей, обращаться в поддержку и следить за состоянием сети.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![CI](https://github.com/stepan41k/billing-service/actions/workflows/frontend-ci.yml/badge.svg)

---

## Содержание

- [Быстрый старт](#быстрый-старт)
- [Переменные окружения](#переменные-окружения)
- [Страницы](#страницы)
- [Архитектура](#архитектура)
- [API](#api)
- [Деплой](#деплой)
- [CI/CD](#cicd)

---

## Быстрый старт

### Вариант 1 — только фронтенд (мок-режим)

Бэкенд не нужен. Все запросы перехватываются прямо в браузере.

```bash
cp .env.example .env      # VITE_USE_MOCKS=true уже выставлен
npm install
npm run dev               # http://localhost:5173
```

**Тестовый аккаунт:** `ivanov` / `password123`

---

### Вариант 2 — фронтенд в Docker (без бэка)

```bash
cp .env.example .env
docker-compose up --build  # http://localhost:3000
```

---

### Вариант 3 — полный стек (frontend + Go backend)

```bash
cd deploy/
cp .env.example .env       # заполни FB_HOST, ACCESS_SECRET, REFRESH_SECRET и др.
docker-compose up --build  # frontend :8080, backend внутри сети
```

---

## Переменные окружения

Создай `.env` из шаблона `.env.example`:

| Переменная       | Описание                                                                                        | Пример                  |
| ---------------- | ----------------------------------------------------------------------------------------------- | ----------------------- |
| `VITE_USE_MOCKS` | `true` — моки в браузере, `false` — реальный бэк                                                | `true`                  |
| `VITE_API_URL`   | Адрес бэка для локальной разработки. В Docker **оставь пустым** — nginx сам проксирует `/api/*` | `http://localhost:8080` |
| `VITE_ENV`       | Окружение сборки                                                                                | `development`           |
| `BACKEND_URL`    | Адрес бэка внутри Docker-сети (подставляется в nginx через `envsubst` в рантайме)               | `http://backend:8080`   |

> `BACKEND_URL` подставляется в nginx **без пересборки образа** — достаточно перезапустить контейнер с новой переменной.

---

## Страницы

| Страница      | Путь               | Описание                                               |
| ------------- | ------------------ | ------------------------------------------------------ |
| Вход          | `/#/login`         | Авторизация с анимированным фоном сети                 |
| Регистрация   | `/#/register`      | Создание нового аккаунта                               |
| Профиль       | `/#/profile`       | Личные данные + карточка баланса                       |
| Договоры      | `/#/tariffs`       | Список активных договоров с деталями (expand/collapse) |
| Платежи       | `/#/payments`      | История операций с цветовыми иконками по типу          |
| Поддержка     | `/#/support`       | Тикеты + встроенный чат с ответами                     |
| Тест скорости | `/#/speedtest`     | Замер download / upload / ping + история               |
| Сеть          | `/#/network`       | Timeline сетевых событий: аварии, обслуживание         |
| Уведомления   | `/#/notifications` | Список уведомлений, отметка прочитанных                |

---

## Архитектура

Слоёная структура — данные текут строго в одном направлении, кросс-импортов между слоями нет:

```text
types → api/client → services → stores → components → pages
```

```text
src/
├── types/            # Доменные типы: User, Contract, Payment, ...
├── api/
│   └── client.ts     # HTTP-клиент: fetch + ApiError + 401 → logout + redirect
├── services/         # Тонкие обёртки над api (AuthService, ProfileService, ...)
├── stores/           # 11 Zustand-сторов (auth, profile, balance, contracts, ...)
├── lib/
│   ├── token.ts      # In-memory JWT — не хранится в localStorage
│   └── utils.ts      # cn(), formatCurrency(), formatDate()
├── mocks/
│   └── mock-fetch.ts # Fetch-интерцептор с regex-роутингом, работает в браузере
├── components/       # Layout, Sidebar, Header, UI-kit (Button, Card, Input, ...)
└── pages/            # Страницы приложения
```

### Как работает переключение мок / бэк

```text
VITE_USE_MOCKS=true   → main.tsx динамически импортирует mock-fetch.ts
                         все /api/* запросы перехватываются в браузере
                         бэкенд не нужен, mock-fetch не попадает в prod-бандл

VITE_USE_MOCKS=false  → mock-fetch.ts исключается из бандла
                         запросы уходят на реальный бэк через nginx proxy
```

---

## API

В dev-режиме Vite проксирует `/api/*` на `VITE_API_URL`. В Docker это делает nginx.

### Аутентификация

| Метод  | Путь                 | Тело запроса          | Ответ                                      |
| ------ | -------------------- | --------------------- | ------------------------------------------ |
| `POST` | `/api/auth/login`    | `{ login, password }` | `{ access_token, refresh_token, profile }` |
| `POST` | `/api/auth/register` | `{ login, password }` | `{ success: true }`                        |

### Профиль и финансы

| Метод | Путь                     | Описание            |
| ----- | ------------------------ | ------------------- |
| `GET` | `/api/profile`           | Данные пользователя |
| `GET` | `/api/profile/balance`   | Текущий баланс      |
| `GET` | `/api/profile/contracts` | Список договоров    |
| `GET` | `/api/profile/payments`  | История платежей    |

### Поддержка

| Метод  | Путь                             | Описание          |
| ------ | -------------------------------- | ----------------- |
| `GET`  | `/api/support/tickets`           | Список тикетов    |
| `POST` | `/api/support/tickets`           | Создать тикет     |
| `POST` | `/api/support/tickets/:id/reply` | Ответить в тикете |

### Прочее

| Метод   | Путь                          | Описание                  |
| ------- | ----------------------------- | ------------------------- |
| `GET`   | `/api/speedtest/history`      | История замеров скорости  |
| `POST`  | `/api/speedtest/run`          | Запустить замер           |
| `GET`   | `/api/network/events`         | Сетевые события           |
| `GET`   | `/api/notifications`          | Уведомления               |
| `PATCH` | `/api/notifications/:id/read` | Пометить прочитанным      |
| `PATCH` | `/api/notifications/read-all` | Пометить все прочитанными |

### Соглашения

- **Авторизация** — заголовок `Authorization: Bearer <access_token>`, токен хранится in-memory
- **Ошибки** — `{ message: string }` при HTTP ≥ 400; `401` вызывает автоматический logout
- **Деньги** — `float` в рублях (`1240.50`)
- **Даты** — ISO 8601 (`2026-03-23T10:00:00Z`)

---

## Деплой

### Только фронтенд

```bash
cd frontend/
docker-compose up --build   # http://localhost:3000
```

### Полный стек

```bash
cd deploy/
cp .env.example .env
docker-compose up --build
```

Фронтенд запускается только после прохождения healthcheck бэка (`/health`).

### Переключение окружения без пересборки

```bash
BACKEND_URL=http://new-backend:8080 docker-compose up
```

---

## CI/CD

GitHub Actions запускается **только при изменениях в `frontend/`** или в самом workflow-файле.

```text
.github/workflows/frontend-ci.yml
```

| Шаг             | Что проверяет                      |
| --------------- | ---------------------------------- |
| `tsc --noEmit`  | Ошибки TypeScript                  |
| `npm run build` | Vite-сборка с prod-флагами         |
| `docker build`  | Образ собирается без ошибок        |
| `nginx -t`      | Конфиг nginx валиден внутри образа |

---

## Стек

| Категория    | Технология                                              |
| ------------ | ------------------------------------------------------- |
| UI-фреймворк | React 18 + TypeScript 5.5                               |
| Сборка       | Vite 5.4                                                |
| Стили        | Tailwind CSS 3 (кастомная дизайн-система, light / dark) |
| Состояние    | Zustand 5 (11 сторов)                                   |
| Анимации     | framer-motion 11                                        |
| Иконки       | lucide-react                                            |
| Веб-сервер   | nginx:alpine — gzip, SPA fallback, security headers     |
| Контейнер    | Docker multi-stage: `node:22-alpine` → `nginx:alpine`   |
