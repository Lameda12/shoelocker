# Security

Implemented: server re-pricing and stock validation; zod validation on all API inputs; Stripe webhook signature verification and idempotency; admin HMAC session cookie (httpOnly, SameSite=Strict, path-scoped) with server-side authorization in every server action and constant-time password compare; per-IP sliding-window rate limits (per instance); security headers (HSTS, nosniff, frame deny, referrer, permissions policy); JSON-LD escaped; no card data touches the app.

Not yet done: distributed rate limiting (Upstash/KV), Clerk, CSP with nonces, upload validation (no uploads exist yet), dependency audit in CI (`npm audit` reports moderate issues in transitive dev tooling; review before launch), automated secret scanning.
