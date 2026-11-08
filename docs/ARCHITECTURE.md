# Architecture

Modular monolith on Next.js App Router. Domains: catalog, inventory, cart (client), checkout, orders, payments (Stripe), content, admin.

| Layer | Now | Production target |
|---|---|---|
| Catalog | `src/lib/catalog.ts` (fictional demo data) | Prisma/PostgreSQL |
| Inventory | in-process reserve/commit/release | Postgres conditional UPDATE inside transactions |
| Orders / audit | in-process maps | Postgres tables |
| Auth | none for shoppers (Locker is device-local); demo admin via HMAC cookie | Clerk, admin via role claim verified on the server |
| Payments | Stripe Checkout, test keys only | same, live after checklist |
| Email, jobs, media, errors | not wired | Resend, Inngest, R2, Sentry |

**Important limitation:** the in-process adapters do not survive serverless cold starts or multiple instances, so orders and stock edits made on the deployed demo are ephemeral and not shared across instances. Do not take real orders until the Postgres adapter replaces them.

Server-side trust boundaries: `/api/checkout` (re-prices, validates SKUs, reserves stock), `/api/webhooks/stripe` (signature verified, idempotent), `/admin` actions (re-authorize every call).
