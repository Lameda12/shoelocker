# Status report

## Fully implemented (works in this build)
Editorial homepage (11 sections), shop with real server-side filters/search/sort/suggestions, quick view, compare (up to 3, documented attributes only), product pages (multi-view illustrated gallery, zoom, colourway switching, real SKU selection, sold-out sizes disabled, mobile sticky buy bar, JSON-LD), cart with server re-validation, The Vault (dark gallery, dated releases, countdown only for scheduled `releaseAt`, always-visible exit), collections, Archive, Fit Passport (save/convert/delete, device-local), Locker (wishlist, recently viewed with privacy toggle), opt-in waitlist with CASL consent checkbox, demo admin (overview, inventory edit, orders actions, audit log), sitemap/robots, security headers.

## Demo mode / needs credentials
- Catalog, brands, products are fictional; imagery is generated SVG. No 360 viewer exists by design.
- Inventory, orders, waitlist and audit data are in-process (ephemeral, per instance). Postgres schema is written and validated but the Prisma adapter is **not implemented**.
- Stripe Checkout code is written but **never exercised against Stripe**; it needs `sk_test_` key + webhook secret. Without them checkout returns a clear "not configured" error.
- Not wired: Clerk, Resend, Inngest, Sentry, R2. Order history/tracking for customers, abandoned-checkout recovery, transactional emails, refunds via Stripe API (admin refund only changes local state and restocks).
- Admin uses a shared password demo gate, not Clerk roles.

## Tested
`npm test`: 18 unit tests pass (50-way concurrent last-pair reservation, all-or-nothing reserve, release idempotency, webhook signature rejection, duplicate event, unpaid session, out-of-order expiry, filters, state machine). `npm run e2e`: 8 Playwright journeys pass locally. ESLint and strict `tsc` clean. Prisma schema validates. Screenshots reviewed at 1440/390/320; no horizontal overflow at 320/390/768/1024 on key pages.

## Not done / not measured
Lighthouse and Core Web Vitals were **not measured**. No WCAG audit by a person. Concurrency was tested in-process only, not against Postgres. Stripe end-to-end payment with test card not run. Zoom/keyboard behaviour only lightly tested. Several Phase 4/5 items (Clerk-backed Locker, favorite collections, product CRUD, analytics, discount codes, campaign content, email management) are not built.

## Risks and next priorities
1. Implement Prisma adapter + migrations with CHECK constraints; run real concurrency tests. 2. Stripe test-mode end-to-end with Stripe CLI. 3. Clerk + Resend + Inngest reconciliation. 4. Measure performance/a11y. 5. Trademark clearance and legal review (see docs/LAUNCH_CHECKLIST.md).
