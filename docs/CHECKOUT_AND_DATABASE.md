# Checkout state and database

Flow: cart (client, SKUs and qty only) -> POST /api/checkout -> validate SKUs, release dates, per-order limits -> re-price from catalog -> `reserve()` all-or-nothing (30 min hold) -> pending Order with price snapshot -> Stripe Checkout Session (idempotency key per order) -> webhook.

Order states: `pending -> paid | cancelled | expired`, `paid -> fulfilled | refunded | cancelled`, `fulfilled -> refunded`, `expired -> paid` (late payment: audited for manual stock check). Transitions are monotone and idempotent (`transition()` in `src/lib/orders.ts`), so duplicate or out-of-order events cannot regress an order.

Webhook: verifies `stripe-signature`; stores event ids (PaymentEvent table in production); fulfils only when `payment_status === "paid"`; expiry releases stock only for pending orders.

Reconciliation (to build with Inngest): sweep `HELD` reservations past `expiresAt` whose Stripe session is not `complete`; retrieve the session from Stripe before releasing stock.

Schema: `prisma/schema.prisma` (validated). Integer cents, unique SKUs, stock movements, reservations, refunds, payment event dedupe, audit log. A raw-SQL migration must add the CHECK constraints noted in the schema.
