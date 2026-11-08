# Skills used

Honest record. Third-party skill repositories named in the brief were **not** fetched or executed in this session: no setup scripts were run and no external SKILL.md files were read. Where a skill was unavailable, work followed first-party documentation shipped with the installed packages.

| Skill / source | Status | What was done instead | Verification |
|---|---|---|---|
| anthropics/skills `frontend-design` | Not loaded | Design direction in `docs/DESIGN_SYSTEM.md`, applying the same principles by hand | Browser screenshots at 320/390/1440 |
| vercel-labs/agent-skills (react-best-practices, web-design-guidelines) | Not loaded | Server Components by default, client islands only where needed; a11y patterns by hand | ESLint (react-hooks rules) clean, a11y spot checks |
| obra/superpowers (TDD, verification) | Not loaded | Unit tests for domain logic and webhook behavior | `npm test`: 18+ passing |
| vercel-labs/agent-browser, Playwright skills | Not loaded | Playwright test runner + screenshot scripts | `npm run e2e` |
| nextlevelbuilder/ui-ux-pro-max-skill | Not loaded | n/a | n/a |
| PostgreSQL, security, accessibility skills | Not discovered | Prisma schema validated with `prisma validate`; checklist in `docs/SECURITY.md` | validate passes |
| Next.js docs bundled in `node_modules/next/dist/docs` (via create-next-app AGENTS.md) | Available; `cacheComponents` defaults were turned off deliberately | Config in `next.config.ts` | `next build` passes |

Package versions were taken from the npm registry at build time (Next 16.4.5, React 19.3, Tailwind 4, Zod 4, Stripe SDK 23, Vitest 5, Playwright).
