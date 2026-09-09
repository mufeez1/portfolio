/**
 * Fixed-window in-memory limiter for the contact endpoint.
 *
 * ponytail: per-instance memory only — a multi-instance deploy gets N times the
 * limit and a cold start resets it. That is an acceptable ceiling for a contact
 * form; swap the Map for Redis or Vercel KV if this ever guards something that
 * costs money.
 */
const WINDOW_MS = 60_000;
/** Overridable so the E2E suite, which shares one client IP, can run the real endpoint. */
const MAX_REQUESTS = Number(process.env.CONTACT_RATE_LIMIT ?? 5);
const MAX_TRACKED_KEYS = 10_000;

const hits = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the window resets; only meaningful when ok is false. */
  retryAfter: number;
}

export function rateLimit(key: string, now = Date.now()): RateLimitResult {
  const entry = hits.get(key);

  if (!entry || entry.resetAt <= now) {
    // Cheap unbounded-growth guard: drop everything once the map gets large.
    if (hits.size >= MAX_TRACKED_KEYS) hits.clear();
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

/** Test seam. */
export function __resetRateLimit(): void {
  hits.clear();
}
