# Backend integration notes

Этот файл фиксирует места, где фронт ждёт интеграции с реальным Go API
и где сейчас используются моки (MSW / заглушки).

## Общие моменты

- Авторизация:
  - Эндпоинт: `POST /api/login`
  - Хук: `src/hooks/useAuth.ts`
  - Хранение токена: `sessionStorage.setItem("token", token)`
  - Важно: при подключении реального бэка убедиться, что `api.client.ts`
    добавляет заголовок `Authorization: Bearer <token>` ко всем запросам.

- Моки:
  - Управление флагом: переменная окружения `VITE_MOCK` (`main.tsx`)
  - При готовности бэка:
    - Установить `VITE_MOCK=false`
    - Удалить директорию `src/mocks` и зависимости `msw` (см. `MOCKS.md`)

## Профиль (`/profile`)

- Эндпоинт: `GET /api/profile`
- Хук: `src/hooks/useProfile.ts`
- Компонент: `src/pages/Profile/Profile.tsx`
- Требования к ответу:
  - Совпадение со структурой `User` из `src/types/index.ts`:
    - `id`, `login`, `client`, `contract`, `email`, `phone`,
      `readOnly`, `lastActivity`.

## Баланс

- Эндпоинт: `GET /api/balance`
- Хук: `src/hooks/useBalance.ts`
- Компонент-индикатор: `src/components/BalanceWidget/BalanceWidget.tsx`
- Поля ответа должны соответствовать типу `Balance` из `src/types/index.ts`.

## Тарифы (`/tariffs`)

- Эндпоинты:
  - Загрузка списка: `GET /api/contracts`
  - Переключение тарифа (планируется):
    - Вариант: `POST /api/contracts/{id}/switch` или аналогичный.
- Хук: `src/hooks/useContracts.ts`
- Страница: `src/pages/Contracts/Contracts.tsx`
  - Точка интеграции переключения тарифа:
    - Функция `handleConfirm` помечена `TODO[backend]`
    - См. комментарий с примером вызова `api.switchContract`.
- Модель `Contract` описана в `src/types/index.ts` и должна совпадать
  со схемой ответа бэка.

## Платежи (`/payments`)

- Эндпоинт: `GET /api/payments`
- Хук: `src/hooks/usePayments.ts`
- Страница: `src/pages/Payments/Payments.tsx`
  - Отображает список `Payment[]` через `PaymentRow`.
  - Используются поля:
    - `id`, `date`, `amount`, `type`, `description`, `contractNumber`.
- Модель `Payment` описана в `src/types/index.ts`.

## Регистрация (`/register`)

- Эндпоинт: `POST /api/register`
- Хук: `src/hooks/useRegister.ts`
- Страница: `src/pages/Register/Register.tsx`
- Ответ должен соответствовать типу `RegisterResponse`:
  - `success: boolean`
  - `message?: string` для отображения ошибок пользователю.
