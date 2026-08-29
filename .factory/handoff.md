# Handoff: adversarial first-read review 2

## Status

Review complete. Verdict: **FAIL** with eight findings, including one blocking
demo finding. No product code was changed.

The review is in `.factory/review-2.md`. It covers the cold 390 px and desktop
read, complete landing/README copy audit, demo and storage isolation, every
registered claim, all earlier findings, routing and metadata, accessibility,
link crawling, visual identity, and missed leverage.

## Verification performed

- Fresh clone at commit `e6ce2a4c267df983cd11b7bf4bc9df8bed5f6b1b`.
- All 19 `.factory/claims.json` commands passed independently.
- Full `npm test` passed: 3 Rust tests and 38 Playwright tests.
- `npm run build` passed and produced `dist/site`; JS is 19.08 kB raw / 6.16
  kB gzip.
- The CLI demo ran from a temporary directory and produced five rows, three
  validation errors, and four output paths in a new temporary demo directory.
- Live `/`, `/demo`, `/privacy`, `/terms`, `/404`, and an unknown route were
  checked with Playwright at 390 × 844 and 1440 × 900 where applicable.
- Live request/storage inspection, route metadata, 404 status, Back-scroll
  restoration, h1 focus, link crawl, and Axe serious/critical checks completed.
- `/opt/fleet/lib/verify-url.sh` passed against production with no application
  console errors.
- All 14 findings from review 1 were independently confirmed fixed in live
  behavior and current source.

## What remains

F-2-1 is blocking: the first demo viewport describes the result but does not
show realistic sample data, and Reset has no observable mutable state to
restore. Seven additional findings cover desktop first-screen facts, unlisted
sample/team-kit claims, two outcome tests that only inspect static page text,
and the context-free README heading “Use it.”

No deployment, billing, infrastructure, or product source was changed.
