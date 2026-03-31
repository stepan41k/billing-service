/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Базовый URL бэкенда. Пусто — nginx proxy берёт на себя /api/* */
  readonly VITE_API_URL: string
  /** 'true' — подключить mock-fetch вместо реального API */
  readonly VITE_USE_MOCKS: string
  readonly VITE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
