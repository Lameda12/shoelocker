# Deployment

1. Create a Vercel project from this repo. Set env vars from `.env.example` (test keys only).
2. Stripe (test mode): add endpoint `https://<domain>/api/webhooks/stripe` for `checkout.session.completed`, `.expired`, `.async_payment_succeeded`, `.async_payment_failed`, `charge.refunded`; copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
3. Without Stripe keys, checkout returns a clear "payments not configured" message and releases the stock hold.
4. Admin: set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`; otherwise `/admin` is disabled.
5. Production data layer: provision Postgres, run `prisma migrate`, implement the Prisma adapter behind `inventory.ts`/`orders.ts`.
