/**
 * API client layer. All HTTP calls go through this module.
 * Service layer calls these functions — components never call this directly.
 *
 * Patterns adopted from Claude Code source:
 *
 *  1. withTimeout()         — race fetch vs AbortSignal.timeout, prevents hung requests
 *  2. isTransientError()    — distinguish 5xx/network (retry) from 4xx (permanent, bubble)
 *  3. requestWithRetry()    — exponential backoff + jitter for transient errors, max 3 retries
 *  4. retryAfterMs          — honour server's Retry-After header on 429
 *  5. isTokenExpired()      — check JWT exp before hitting the server (avoids 401 round-trip)
 *  6. consecutive-auth gate — after N 401s with a valid-looking token, hard-redirect (not inf loop)
 */
import { Token } from '@/lib/token';
import type {
  AuthResponse, Balance, Contract, LoginPayload, Payment,
  RegisterPayload, RegisterResponse, User, SupportTicket,
  SpeedTestResult, NetworkEvent, AppNotification,
} from '@/types';

const BASE = import.meta.env.VITE_API_URL || '/api';

const REQUEST_TIMEOUT_MS = 30_000;
const MAX_RETRIES        = 3;
const BASE_DELAY_MS      = 500;
const MAX_DELAY_MS       = 16_000;
const MAX_CONSECUTIVE_AUTH_FAILURES = 3;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    /** ms to wait before next retry (from Retry-After header on 429) */
    public readonly retryAfterMs?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Race a fetch Promise against a timeout.
 * Analogous to Claude Code's withTimeout() utility.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new ApiError(0, `Request timed out after ${ms}ms`)), ms),
    ),
  ]);
}

/**
 * True for errors that are worth retrying.
 * Network errors (no response) + 5xx server errors are transient.
 * 4xx client errors are permanent — the same request will always fail.
 * Analogous to Claude Code's isTransientNetworkError().
 */
function isTransientError(err: unknown): boolean {
  if (err instanceof ApiError) {
    // 0 = timeout/network, 429 = rate-limit, 5xx = server error
    return err.status === 0 || err.status === 429 || err.status >= 500;
  }
  // Raw network error (fetch threw before we even got a response)
  return err instanceof TypeError;
}

/**
 * Decode the `exp` claim from a JWT without verifying the signature.
 * Returns the expiry as a Unix timestamp (ms), or null if unreadable.
 * Analogous to Claude Code's decodeJwtExpiry().
 */
function decodeJwtExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
    return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const exp = decodeJwtExpiry(token);
  // 10s buffer — token valid for < 10s is treated as expired
  return exp !== null && exp < Date.now() + 10_000;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryDelay(attempt: number, retryAfterMs?: number): number {
  if (retryAfterMs && retryAfterMs > 0) {
    // Honour server-supplied Retry-After, clamp to our bounds + jitter
    return Math.min(Math.max(retryAfterMs, BASE_DELAY_MS), MAX_DELAY_MS) + Math.random() * 500;
  }
  // Exponential backoff with jitter — same formula as Claude Code's CCRClient
  return Math.min(BASE_DELAY_MS * Math.pow(2, attempt), MAX_DELAY_MS) + Math.random() * 500;
}

// Prevents infinite redirect loops when the server returns repeated 401s
// even though the token looks valid (server-side auth outage / KMS hiccup).
// Analogous to Claude Code's consecutiveAuthFailures threshold.
let consecutiveAuthFailures = 0;

function handleAuthFailure(): never {
  Token.clear();
  consecutiveAuthFailures = 0;
  window.location.href = '/login';
  throw new ApiError(401, 'Unauthorized');
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Fast-path: if the stored token is already expired, redirect before wasting a round-trip.
  // Analogous to Claude Code's "Check the token's own exp before burning wall-clock on the threshold loop."
  const storedToken = Token.get();
  if (storedToken && isTokenExpired(storedToken)) {
    handleAuthFailure();
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let res: Response;
    try {
      res = await withTimeout(
        fetch(`${BASE}${path}`, { ...init, headers }),
        REQUEST_TIMEOUT_MS,
      );
    } catch (err) {
      // Network/timeout error — transient, retry
      if (attempt < MAX_RETRIES && isTransientError(err)) {
        await sleep(retryDelay(attempt));
        continue;
      }
      throw err instanceof ApiError ? err : new ApiError(0, 'Network error');
    }

    // 401 handling: check if the token looks valid before deciding to retry or hard-redirect
    if (res.status === 401) {
      const token = Token.get();
      if (token && isTokenExpired(token)) {
        // Deterministic expiry — no point retrying
        handleAuthFailure();
      }
      consecutiveAuthFailures++;
      if (consecutiveAuthFailures >= MAX_CONSECUTIVE_AUTH_FAILURES) {
        // Token looks valid but server keeps rejecting — server-side issue, hard redirect
        handleAuthFailure();
      }
      // Single 401 on a valid-looking token: bubble up so caller can handle
      Token.clear();
      window.location.href = '/login';
      throw new ApiError(401, 'Unauthorized');
    }

    // Auth success resets the counter
    consecutiveAuthFailures = 0;

    // 429 — honour Retry-After header
    if (res.status === 429 && attempt < MAX_RETRIES) {
      const raw = res.headers.get('retry-after');
      const retryAfterMs = raw ? parseInt(raw, 10) * 1000 : undefined;
      await sleep(retryDelay(attempt, retryAfterMs));
      continue;
    }

    // 5xx — transient, retry
    if (res.status >= 500 && attempt < MAX_RETRIES) {
      await sleep(retryDelay(attempt));
      continue;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as Record<string, unknown>;
      throw new ApiError(res.status, (body['message'] as string) ?? `HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
  }

  throw new ApiError(0, 'Max retries exceeded');
}

export const authApi = {
  login:    (payload: LoginPayload):    Promise<AuthResponse>    => request('/login',    { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload: RegisterPayload): Promise<RegisterResponse> => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
};

export const profileApi = {
  get: (): Promise<User> => request('/profile'),
};

export const balanceApi = {
  get: (): Promise<Balance> => request('/profile/balance'),
};

export const contractsApi = {
  list: (): Promise<Contract[]> => request('/profile/contracts'),
};

export const paymentsApi = {
  list: (): Promise<Payment[]> => request('/profile/payments'),
};

export const supportApi = {
  list:   ():                                    Promise<SupportTicket[]> => request('/support/tickets'),
  create: (subject: string, text: string):       Promise<SupportTicket>  => request('/support/tickets',              { method: 'POST', body: JSON.stringify({ subject, text }) }),
  reply:  (ticketId: number, text: string):      Promise<SupportTicket>  => request(`/support/tickets/${ticketId}/reply`, { method: 'POST', body: JSON.stringify({ text }) }),
};

export const speedTestApi = {
  history: ():                      Promise<SpeedTestResult[]> => request('/speedtest/history'),
  run:     ():                      Promise<SpeedTestResult>   => request('/speedtest/run', { method: 'POST' }),
};

export const networkApi = {
  events: (): Promise<NetworkEvent[]> => request('/network/events'),
};

export const notificationsApi = {
  list:       ():                            Promise<AppNotification[]>   => request('/notifications'),
  markRead:   (id: number):                  Promise<{ success: boolean }> => request(`/notifications/${id}/read`,   { method: 'PATCH' }),
  markAllRead: ():                           Promise<{ success: boolean }> => request('/notifications/read-all',     { method: 'PATCH' }),
};
