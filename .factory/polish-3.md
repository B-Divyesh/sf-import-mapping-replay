# Polish round 3 — finding closure

Repair code commit: `7cb152580d3ecdefd9d1b2450b3caab33522c10d`.
Deployment: `5b756fb3-4a8d-4c5f-8bd8-2a7224407fa4` to <https://import-mapping-replay.sociobot.in>.

The screenshots and machine-readable reports named below are retained under
`.factory/evidence/polish-3/` in the work-order evidence store.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved the outgoing history entry's scroll position; `popstate` restores it before focusing the new route h1. | Playwright `navigation restores scroll on Back and terminal recording has a clear action`; live `cold-audit.json` records `3230 → 3230` and `#page-title` focus. |
| F-1-2 | Kept designed `404.html`, known-route rewrites, and the 404 response override. | Playwright `all routes set specific metadata and unknown routes return HTTP 404`; live `/404` and `/missing-polish-3` returned 404; [404 mobile screenshot](.factory/evidence/polish-3/live/404-390.png). |
| F-1-3 | Kept Privacy visible in the mobile header with a 44 px target. | Playwright `header keeps Privacy visible and usable`; live audit measured 49.8 × 44 px; [home mobile screenshot](.factory/evidence/polish-3/live/home-390.png). |
| F-1-4 | Retained route-specific static and rendered title, description, canonical, Open Graph, and Twitter fields. | Playwright `all routes set specific metadata and unknown routes return HTTP 404`; live `cold-audit.json` checks all five routes. |
| F-1-5 | Kept the literal first-screen h1: “Replay CSV imports before upload.” | Copy audit; live home screenshot and `cold-audit.json`. |
| F-1-6 | Kept the literal process label “How the replay works.” | `.factory/copy-audit.md`; live home check. |
| F-1-7 | Kept the literal boundary heading “What the CLI does not do.” | `.factory/copy-audit.md`; live home check. |
| F-1-8 | Kept the literal 404 h1 “Page not found.” | Live 404 status and [404 mobile screenshot](.factory/evidence/polish-3/live/404-390.png). |
| F-1-9 | Kept the terminal action “Show the sample replay again.” | Playwright `navigation restores scroll on Back and terminal recording has a clear action`. |
| F-1-10 | Retained outcome tests for local-only replay, exact browser storage, and rollback scope. | Clean-clone `@claim:cli-local-only`, `@claim:website-license-storage-only`, and `@claim:rollback-local-scope`; demo request audit records only the live site origin. |
| F-1-11 | Retained the 24-hour cache claim and its observable reload test. | Clean-clone `@claim:license-cache-day`. |
| F-1-12 | Removed merchant-of-record, payment-data, refund-handler, refund-revocation, and buyer-scope promises. Kept only the directly observable checkout redirect. | Playwright `purchase copy keeps only the checkout behavior covered by evidence`; live `billing-copy.json`; GET and HEAD checkout responses are 303 to `checkout.dodopayments.com`. |
| F-1-13 | Kept the unproved buyer/team license-scope sentence out of Terms. | Copy audit; live Terms check in `cold-audit.json`. |
| F-1-14 | Kept “customer system” as the single external-boundary term. | `.factory/copy-audit.md`; repository copy check. |
| F-2-1 | Kept a mapped email and complete row-5 validation result in the mobile demo hero. Reset restores the visible invalid value and error count without storage. | Playwright `demo first view shows a mapped value and a complete validation row on mobile` and `direct demo query is isolated and exposes reset and exit controls`; [demo mobile screenshot](.factory/evidence/polish-3/live/demo-390.png); live `cold-audit.json`. |
| F-2-2 | Kept all three product facts inside the desktop first viewport. | Playwright `desktop hero keeps all three product facts in the first viewport`; mobile cold screenshot also shows all three facts. |
| F-2-3 | Registered `demo-row-count` with a five-row CLI outcome test. | Clean-clone `@claim:demo-row-count`. |
| F-2-4 | Registered the kit's recipes and sign-off checklist as paid content. | Clean-clone `@claim:paid-kit` download inspection. |
| F-2-5 | Registered and asserted exactly five named recipe records. | Clean-clone `@claim:paid-kit`. |
| F-2-6 | Added structured upload-owner and second-engineer-approval fields and assertions. | Clean-clone `@claim:paid-kit`. |
| F-2-7 | Made the recording claim execute the bundled CLI and compare its rows, errors, and artifact names to the landing recording. | Clean-clone `@claim:recorded-cli-sample`, `@claim:demo-errors`, and `@claim:review-files`. |
| F-2-8 | Kept the README section heading “Run a CSV replay.” | README copy audit and clean-clone documentation check. |
| F-3-1 (reopened F-1-12) | Removed the reintroduced billing/refund statements from landing, Privacy, Terms, README, and audit copy. | Live `billing-copy.json` reports checkout copy present and all unproved terms absent on `/`, `/privacy`, and `/terms`; checkout headers show a 303 to Dodo. |
| F-3-2 | Replaced millisecond `create_dir_all` naming with atomic `create_dir`, PID/nanosecond/sequence entropy, and retry-on-existing behavior. Expanded the registered test to 40 concurrent demos. | Clean-clone `@claim:demo-temp`; release check: 80 concurrent demos produced 80 unique directories and 80 complete artifact sets. |

## Acceptance evidence

- Fresh GitHub clone at `7cb152580d3ecdefd9d1b2450b3caab33522c10d`:
  `npm ci`, then every one of the 25 exact commands in `.factory/claims.json`
  independently with a fail-fast completion marker. Result: 25/25 passed.
- Root suite: `npm test` passed with 7 Rust tests and 58 Playwright tests.
- Release checks passed: `npm run typecheck`, `cargo fmt --check`,
  `cargo clippy --all-targets -- -D warnings`, `cargo package --allow-dirty`,
  and `npm run build`.
- Bundle: 6,814 B gzip JavaScript and 3,646 B gzip CSS. Local Lighthouse:
  performance 98, accessibility 100, best practices 100, SEO 100; LCP 2.2 s,
  CLS 0, TBT 50 ms. Report: `.factory/evidence/polish-3/local/lighthouse.json`.
- Live: `/opt/fleet/lib/verify-url.sh` passed with no application console error;
  its report is `.factory/evidence/polish-3/live/verify.json`. The Playwright
  Axe audit found zero violations on `/`, `/demo`, `/privacy`, `/terms`, and
  `/404`; route, demo, mobile, 404, and history evidence is in
  `.factory/evidence/polish-3/live/cold-audit.json`.

No finding is deferred.
