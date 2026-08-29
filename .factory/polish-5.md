# Polish round 5 — cumulative finding closure

Product repair commit: `83329da8fd17cdfb606db4ea362f0f6c3ccec4a7`.
Deployment: `20086067-b7bd-4fc2-884f-5e9c5d40c59d` at
<https://import-mapping-replay.sociobot.in>.

Evidence files are retained under `.factory/evidence/polish-5/`. The clean
clone was `/tmp/import-mapping-replay-polish5-clean.u5sq3j/repo` at the repair
commit. Every live check below ran after deployment in a new browser context.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | History entries retain scroll coordinates; Back restores the position before focusing the h1. | Test `navigation restores scroll on Back and terminal recording has a clear action`; screenshot `.factory/evidence/polish-5/live/home-desktop-cold.png`; live `/` → `/demo` → Back restored `3203 → 3203` with `#page-title` focused. |
| F-1-2 | Known routes use real documents and unknown routes use the designed HTTP 404. | Tests `all routes set specific metadata and unknown routes return HTTP 404` and `@claim:site-routing-headers`; screenshot `.factory/evidence/polish-5/live/404-mobile-cold.png`; live `/404` and `/polish-5-not-found` returned 404 while known routes returned 200. |
| F-1-3 | Privacy remains visible in the 390 px header and every visible control meets the 44 px target minimum. | Test `header keeps Privacy visible and usable`; screenshot `.factory/evidence/polish-5/live/home-mobile-cold.png`; live mobile audit found no undersized target and `/privacy` returned 200. |
| F-1-4 | Every static document and client route retains its own title, description, canonical, Open Graph, and Twitter metadata. | Test `all routes set specific metadata and unknown routes return HTTP 404`; screenshot `.factory/evidence/polish-5/live/terms-mobile-cold.png`; live audit checked the full metadata set on `/`, `/demo`, `/privacy`, `/terms`, and 404 pages. |
| F-1-5 | The first-screen h1 remains the concrete job statement “Replay CSV imports before upload.” | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-5/live/home-mobile-cold.png`; live `/` returned the exact h1. |
| F-1-6 | The former mood label remains replaced by “How the replay works.” | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-5/live/home-desktop-cold.png`; live `/` contains the exact section label. |
| F-1-7 | The limits heading remains “What the CLI does not do.” | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-5/live/home-desktop-cold.png`; live `/` contains the exact heading. |
| F-1-8 | The designed 404 uses the literal h1 “Page not found.” | Test `all routes set specific metadata and unknown routes return HTTP 404`; screenshot `.factory/evidence/polish-5/live/404-mobile-cold.png`; live `/404` returned 404 with that h1. |
| F-1-9 | The terminal control remains result-naming: “Show the sample replay again.” | Tests `navigation restores scroll on Back and terminal recording has a clear action` and `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-5/live/home-desktop-cold.png`; live `/` contains the action. |
| F-1-10 | Local-only CLI, exact website storage, and rollback boundaries remain explicit registered claims. | Tests `@claim:cli-local-only`, `@claim:website-license-storage-only`, and `@claim:rollback-local-scope`; screenshot `.factory/evidence/polish-5/live/privacy-mobile-cold.png`; live direct demo made same-origin requests only and retained byte-identical real-storage sentinels. |
| F-1-11 | The 24-hour verification cache remains registered and time-tested. | Test `@claim:license-cache-day`; screenshot `.factory/evidence/polish-5/live/privacy-mobile-cold.png`; live `/privacy` returned the registered cache wording and status 200. |
| F-1-12 | Merchant-of-record, card-data, refund-handler, and automatic refund-revocation promises remain removed; only the observable checkout route is stated. | Tests `purchase copy keeps only the checkout behavior covered by evidence` and `@claim:checkout-redirect`; screenshot `.factory/evidence/polish-5/live/terms-mobile-cold.png`; live copy audit found none of the removed terms, and GET/HEAD checkout returned 303 to `checkout.dodopayments.com`. |
| F-1-13 | The unproved buyer/team license scope remains absent. | Test `purchase copy keeps only the checkout behavior covered by evidence`; screenshot `.factory/evidence/polish-5/live/terms-mobile-cold.png`; live `/terms` contains no “one buyer” scope. |
| F-1-14 | “Customer system” remains the single external-product term. | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-5/live/home-desktop-cold.png`; live `/` uses “customer system” and the repository contains no “SaaS account” substitute. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | The first demo viewport shows a mapped email and complete error; correction and Reset visibly change and restore the sample in memory. | Tests `demo first view shows a mapped value and a complete validation row on mobile`, `correcting the sample keeps validation results, focus, and the live result in sync`, and `direct demo query is isolated and exposes reset and exit controls`; screenshot `.factory/evidence/polish-5/live/demo-mobile-cold.png`; live `/?demo=1` kept all three values above 844 px and Reset restored three errors with result focus. |
| F-2-2 | All privacy, offline, and price facts remain inside the 390 × 844 and 1440 × 900 first screens. | Test `desktop hero keeps all three product facts in the first viewport`; screenshot `.factory/evidence/polish-5/live/home-desktop-cold.png`; live audit checked all three bounds at both viewport sizes. |
| F-2-3 | `demo-row-count` registers and proves five source and output rows. | Test `@claim:demo-row-count`; screenshot `.factory/evidence/polish-5/live/demo-mobile-cold.png`; live `/demo` shows five sample customers and five source rows. |
| F-2-4 | `paid-kit` names and proves the mapping recipes and sign-off checklist. | Test `@claim:paid-kit`; screenshot `.factory/evidence/polish-5/live/home-desktop-cold.png`; live `/` contains both registered kit contents. |
| F-2-5 | The paid-kit claim and download retain exactly five named recipes. | Test `@claim:paid-kit`; screenshot `.factory/evidence/polish-5/live/home-desktop-cold.png`; live `/` states “Five named mapping recipes.” |
| F-2-6 | The downloaded checklist retains structured upload-owner and second-engineer-approval fields. | Test `@claim:paid-kit`; screenshot `.factory/evidence/polish-5/live/home-desktop-cold.png`; live `/` advertises the same tested fields. |
| F-2-7 | The recording, error, and file claims execute the bundled CLI and compare real outcomes with the page. | Tests `@claim:recorded-cli-sample`, `@claim:demo-errors`, and `@claim:review-files`; screenshot `.factory/evidence/polish-5/live/demo-desktop-cold.png`; live `/demo` shows the matched five-row, three-error, four-file result. |
| F-2-8 | The README heading remains “Run a CSV replay.” | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-5/live/home-desktop-cold.png`; live `/` exposes the corresponding install-and-run path. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 / F-1-12 | The prior billing-copy regression remains removed from landing, README, Privacy, and Terms. | Tests `purchase copy keeps only the checkout behavior covered by evidence` and `@claim:checkout-redirect`; screenshot `.factory/evidence/polish-5/live/terms-mobile-cold.png`; live audit found no merchant/refund/card-data promise on `/`, `/privacy`, or `/terms`. |
| F-3-2 | CLI demos still create directories atomically with per-process uniqueness and complete outputs. | Test `@claim:demo-temp` starts 40 concurrent demos; screenshot `.factory/evidence/polish-5/live/demo-mobile-cold.png`; live `/demo` remained storage-isolated while the clean-clone CLI test produced 40 distinct directories. |

## Review 4 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | README still gives the honest source-checkout installation path and makes no release-availability claim. | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-5/live/home-mobile-cold.png`; live `/` returned the source install command. |
| F-4-2 | README retains the direct `cargo package` instruction and no “ready for registry review” wording. | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-5/live/home-desktop-cold.png`; live `/` returned the install section, and clean-clone `cargo package` passed. |
| F-4-3 | `build-artifacts` registers and tests the release binary and site build. | Test `@claim:build-artifacts`; screenshot `.factory/evidence/polish-5/live/home-desktop-cold.png`; live root and hashed JavaScript byte-matched `dist/site`. |
| F-4-4 | `build-artifacts` also asserts `dist/site/index.html`, route documents, and hashed assets. | Test `@claim:build-artifacts`; screenshot `.factory/evidence/polish-5/live/home-mobile-cold.png`; live `index.html` SHA-256 matched the clean build. |
| F-4-5 | `site-routing-headers` proves known routes, the custom 404, CSP, `nosniff`, referrer policy, and permissions policy. | Test `@claim:site-routing-headers`; screenshot `.factory/evidence/polish-5/live/404-mobile-cold.png`; live route matrix confirmed 200/404 status and security headers. |
| F-4-6 | README retains the non-sentence `Production site:` label. | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-5/live/home-mobile-cold.png`; live production root returned 200 with the expected canonical URL. |
| F-4-7 | `mit-license` proves Cargo metadata and the complete MIT grant, inclusion, warranty, and liability terms. | Test `@claim:mit-license`; screenshot `.factory/evidence/polish-5/live/terms-mobile-cold.png`; live `/terms` returned 200 and names the MIT License. |

## Review 5 finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-5-1 | Added an `AbortController` for license verification. Entering demo aborts the request, and completion handlers re-check the controller and current route before any storage or UI write. Expanded the single `demo-private` claim test with the held-response landing-to-demo race. | Test `@claim:demo-private demo stores nothing and sends no data away`; screenshot `.factory/evidence/polish-5/live/demo-mobile-cold.png`; live race began with only `sb_license:import-mapping-replay`, entered `/demo`, released the held valid response, ended with the same one key, and had zero active cross-origin requests. Report: `.factory/evidence/polish-5/live/cold-audit.json`. |

## Acceptance evidence

- Clean clone at `83329da8fd17cdfb606db4ea362f0f6c3ccec4a7`: `npm ci`, then every exact command in `.factory/claims.json` independently. Result: 28/28 passed.
- Clean-clone full suite: 7 Rust tests and 64 Playwright tests passed; 2 intentional project skips. Typecheck, rustfmt, Clippy with warnings denied, `cargo package`, and `npm run build` passed.
- Final workspace suite after adding the reusable live audit: 7 Rust tests and 66 Playwright tests passed; 2 intentional project skips.
- Production bundle: JavaScript 22.55 kB raw / 7.22 kB gzip; CSS 13.10 kB raw / 3.67 kB gzip. Live JavaScript and `index.html` SHA-256 values match the deployed build.
- `/opt/fleet/lib/verify-url.sh` passed with no console errors. Report: `.factory/evidence/polish-5/live/verify.json`.
- The live audit ran Axe on six routes at desktop and mobile sizes: zero violations, zero horizontal overflow, no application console errors. Report: `.factory/evidence/polish-5/live/cold-audit.json`.
- Live Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7 s, CLS 0, TBT 0 ms, transfer 194 KiB. Report: `.factory/evidence/polish-5/live/lighthouse.json`.

Every finding is closed. No severity is deferred.
