# Polish round 1 — finding closure

Implemented and deployed from repair commit `d102fbf`. Live URL: <https://import-mapping-replay.sociobot.in>.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | History entries now save scroll coordinates. `popstate` restores the exact position instantly, focuses the route h1 without scrolling, and announces the title. | Playwright: `navigation restores scroll on Back and terminal recording has a clear action`; live cold audit restored `scrollY` 4000 → 4000 with h1 focus. Report: `.factory/evidence/polish-1/live/cold-audit.json`. |
| F-1-2 | Known routes rewrite to prerendered documents. `/404` explicitly returns 404, and all other unknown paths use the designed 404 response override. | Playwright: `all routes set specific metadata and unknown routes return HTTP 404`; live `GET /404` and `GET /missing-polish-live` both returned 404. Screenshot: `.factory/evidence/polish-1/live/404-mobile-cold.png`. |
| F-1-3 | Privacy remains in the 390 px header. Header links now have 44 px targets and tighter product-specific spacing. | Playwright: `header keeps Privacy visible and usable` plus the mobile target-size assertions in `initial load preserves document-order keyboard focus...`; screenshot: `.factory/evidence/polish-1/live/home-mobile-cold.png`; live `/privacy` returned 200. |
| F-1-4 | Added separate prerendered HTML for Demo, Privacy, Terms, and 404. Runtime navigation updates title, description, canonical, Open Graph title/description/URL, and Twitter title/description. | Playwright: `all routes set specific metadata and unknown routes return HTTP 404` checks response HTML and rendered metadata; live cold audit checked all routes at 1440 and 390 px. |
| F-1-5 | Replaced the vague h1 with “Replay CSV imports before upload”. The lede now names the reviewed output CSV and error report. | Playwright route metadata/heading checks; live home screenshot: `.factory/evidence/polish-1/live/home-mobile-cold.png`; live `/` returned the new h1. |
| F-1-6 | Replaced “One route, every time” with “How the replay works”. | Copy audit: `.factory/copy-audit.md`; live `/` cold check. |
| F-1-7 | Replaced “This tool stays narrow” with “What the CLI does not do”. | Copy audit: `.factory/copy-audit.md`; live `/` cold check. |
| F-1-8 | Replaced the metaphorical 404 h1 with “Page not found” and retained the transit-poster styling. | Playwright 404 heading/status check; screenshot: `.factory/evidence/polish-1/live/404-mobile-cold.png`; live `/404` returned 404. |
| F-1-9 | Renamed the control to “Show the sample replay again”. | Playwright: `navigation restores scroll on Back and terminal recording has a clear action`; live `/` cold check. |
| F-1-10 | Added `cli-local-only`, `website-license-storage-only`, and `rollback-local-scope` claims. The CLI network test preloads a guard for DNS/connect/send calls. Browser storage is asserted exactly. Rollback writes and network boundaries are asserted. | Clean-clone commands for all three claim IDs passed twice per command. Full suite also passed. Live demo request/storage audit passed in `.factory/evidence/polish-1/live/cold-audit.json`. |
| F-1-11 | Added `license-cache-day`; the test proves a reload inside 24 hours makes no new request and an aged cache makes exactly one. | Clean-clone `npm test -- --grep @claim:license-cache-day`: 2 passed. |
| F-1-12 | Removed merchant-of-record, refund, and card-data promises. Copy now says only “Checkout opens on Dodo”, which is directly checked. | `@claim:paid-kit` checks live GET and HEAD 303 redirects to `checkout.dodopayments.com`; the post-deploy cold audit repeated both checks. |
| F-1-13 | Removed the unverified buyer/team license-scope sentence from Terms. | Copy audit and live `/terms` check; Playwright legal-footer checks pass on every known route. |
| F-1-14 | Standardised the external boundary as “customer system” on the landing page and in README. | Terminology table in `.factory/copy-audit.md`; repository search finds no “SaaS account” or plural substitute. |

## Cumulative acceptance evidence

- Every one of the 19 commands in `.factory/claims.json` passed independently from clean clone `/tmp/import-mapping-replay-deployed-clean.jhJent/repo` at commit `d102fbf`.
- Clean-clone `npm test`: 3 Rust tests and 38 Playwright runs passed.
- Clean-clone typecheck, formatting check, clippy with warnings denied, production build, `cargo package`, packaged install, `--version`, and `demo --json` passed.
- Local Lighthouse: performance 98, accessibility 100, best practices 100, SEO 100; LCP 2.2 s, CLS 0, TBT 70 ms.
- Live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.8 s, CLS 0, TBT 30 ms. Report: `.factory/evidence/polish-1/live/lighthouse.json`.
- `/opt/fleet/lib/verify-url.sh` passed live with one h1, `lang=en`, main, complete alt text, labeled buttons, and no application console errors. Evidence: `.factory/evidence/polish-1/live/verify.json`.
- The live audit covered 12 route/viewport combinations with zero serious or critical Axe findings and no horizontal overflow. A 404 navigation produces the browser’s expected failed-document network message; there are no application errors.

All 14 findings are closed. No severity is deferred.
