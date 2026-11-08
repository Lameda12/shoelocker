import "server-only";
const hits = new Map<string, number[]>();
/** Sliding-window limiter, per-instance. Use Upstash/Vercel KV in production (docs/SECURITY.md). */
export function limited(key: string, max = 8, windowMs = 60_000) {
  const now = Date.now(); const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now); hits.set(key, arr); return arr.length > max;
}
export const ipOf = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
