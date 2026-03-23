/**
 * In-memory JWT storage.
 * No localStorage/sessionStorage - S3 iframe sandbox blocks them.
 */
let _token: string | null = null;

export const Token = {
  get: () => _token,
  set: (t: string) => { _token = t; },
  clear: () => { _token = null; },
  exists: () => _token !== null,
} as const;
