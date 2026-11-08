<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Shoe Locker agent notes

- Domain code lives in `src/lib` (catalog, inventory, orders, shipping, query, sizes). UI in `src/components`, routes in `src/app`.
- Money is integer cents (CAD). Never read prices, stock or payment status from the client.
- The demo adapters (`inventory.ts`, `orders.ts`) are in-process; `prisma/schema.prisma` is the Postgres contract. Keep semantics aligned.
- Never add fake scarcity, fake reviews, invented release dates or unverified specs. Countdowns require `releaseAt`.
- Run before committing: `npm run lint && npm run typecheck && npm test`; e2e: `npm run e2e`.
- Palette is #000 / #fff / #151515 / #343434 / #E9E9E9 only. Fonts: Inter Tight (OFL), Space Mono (OFL).
