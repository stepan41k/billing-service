# Billing Frontend

> Personal account UI for Maxima internet billing system.

## Requirements

- Docker & Docker Compose

## Run

```bash
docker compose up --build
```

Open [http://localhost](http://localhost) — login `ivan` / `pwd123`

## Development

```bash
npm install && npm run dev   # http://localhost:5173
```

Set `VITE_API_URL` in `.env` to point at the Go backend when ready.  
Set `VITE_MOCK=false` to disable MSW and use real API.

## Backend contract

```
POST /api/login      → { token }
POST /api/register   → { success }
GET  /api/profile
GET  /api/contracts
GET  /api/payments
```

`Authorization: Bearer <token>`
