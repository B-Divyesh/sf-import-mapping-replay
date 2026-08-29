# Polish round 6 — cumulative finding closure

Product repair commit: `72a4f0d812aa2fa0a4c0ae4360926ccd21fa9f2d`.
Deployment: `a7360fe1-bcb4-4513-b18e-babd31dce877` at
<https://import-mapping-replay.sociobot.in>.

Evidence is under `.factory/evidence/polish-6/live/`. The clean verification
clone was `/tmp/import-mapping-replay-polish6-clean.tBuhoF/repo` at the repair
commit. Every live check used a new browser context after deployment.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | History entries retain scroll coordinates; Back restores the exact position before focusing and announcing the h1. | Test `navigation restores scroll on Back and terminal recording has a clear action`; screenshot `.factory/evidence/polish-6/live/home-desktop-cold.png`; live `/` → `/?demo=1` → Back restored `3203 → 3203` with `#page-title` focused. |
| F-1-2 | Known routes use real documents and unknown routes use the designed HTTP 404 response. | Tests `all routes set specific metadata and unknown routes return HTTP 404` and `@claim:site-routing-headers`; screenshot `.factory/evidence/polish-6/live/404-mobile-cold.png`; live `/404` and `/polish-6-not-found` returned 404 while `/demo`, `/privacy`, and `/terms` returned 200. |
| F-1-3 | Privacy remains visible in the 390 px header; all visible mobile controls are at least 44 px. | Test `header keeps Privacy visible and usable`; screenshot `.factory/evidence/polish-6/live/home-mobile-cold.png`; live mobile audit found no undersized target and `/privacy` returned 200. |
| F-1-4 | Static documents and client navigation retain route-specific title, description, canonical, Open Graph, and Twitter metadata. | Test `all routes set specific metadata and unknown routes return HTTP 404`; screenshot `.factory/evidence/polish-6/live/terms-mobile-cold.png`; live cold audit checked every field on `/`, `/demo`, `/privacy`, `/terms`, and the 404 page. |
| F-1-5 | The first-screen h1 remains the concrete job statement “Replay CSV imports before upload”; the lede names the output CSV and error report. | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-6/live/home-mobile-cold.png`; live `/` returned the exact h1 and lede. |
| F-1-6 | The former mood label remains replaced by “How the replay works.” | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-6/live/home-desktop-cold.png`; live `/` contains the exact label. |
| F-1-7 | The limits heading remains “What the CLI does not do.” | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-6/live/home-desktop-cold.png`; live `/` contains the exact heading. |
| F-1-8 | The designed 404 retains the literal h1 “Page not found.” | Test `all routes set specific metadata and unknown routes return HTTP 404`; screenshot `.factory/evidence/polish-6/live/404-mobile-cold.png`; live `/404` returned HTTP 404 with that h1. |
| F-1-9 | The terminal action remains result-naming: “Show the sample replay again.” | Test `navigation restores scroll on Back and terminal recording has a clear action`; screenshot `.factory/evidence/polish-6/live/home-desktop-cold.png`; the live control replayed the transcript. |
| F-1-10 | Local-only CLI behavior, exact website storage, and rollback boundaries remain registered claims with outcome tests. | Tests `@claim:cli-local-only`, `@claim:website-license-storage-only`, and `@claim:rollback-local-scope`; screenshot `.factory/evidence/polish-6/live/privacy-mobile-cold.png`; live direct demo used only same-origin requests and retained both real-storage sentinels byte-for-byte. |
| F-1-11 | The 24-hour verification cache remains registered and time-tested. | Test `@claim:license-cache-day`; screenshot `.factory/evidence/polish-6/live/privacy-mobile-cold.png`; live `/privacy` returned the registered daily-cache wording. |
| F-1-12 | Unproved merchant, refund, card-data, and refund-revocation statements remain absent; only the observable checkout route is stated. | Tests `purchase copy keeps only the checkout behavior covered by evidence` and `@claim:checkout-redirect`; screenshot `.factory/evidence/polish-6/live/terms-mobile-cold.png`; live checkout returned 303 to `checkout.dodopayments.com`. |
| F-1-13 | The unproved buyer/team license scope remains absent. | Test `purchase copy keeps only the checkout behavior covered by evidence`; screenshot `.factory/evidence/polish-6/live/terms-mobile-cold.png`; live Terms contains no buyer-scope promise. |
| F-1-14 | “Customer system” remains the single external-product term. | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-6/live/home-desktop-cold.png`; live landing copy and README use the same term. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | The first demo viewport shows a mapped email and a complete error; correction and Reset visibly change and restore the in-memory sample. | Tests `demo first view shows a mapped value and a complete validation row on mobile`, `correcting the sample keeps validation results, focus, and the live result in sync`, and `direct demo query is isolated and exposes reset and exit controls`; screenshot `.factory/evidence/polish-6/live/demo-mobile-cold.png`; live `/?demo=1` kept the mapped value and error above 844 px and Reset restored three errors with result focus. |
| F-2-2 | All privacy, offline, and price facts remain inside both required first screens. | Test `desktop hero keeps all three product facts in the first viewport`; screenshot `.factory/evidence/polish-6/live/home-mobile-cold.png`; live audit checked every fact at 390 × 844 and 1440 × 900. |
| F-2-3 | `demo-row-count` registers and proves five source and output rows. | Test `@claim:demo-row-count`; screenshot `.factory/evidence/polish-6/live/demo-mobile-cold.png`; live demo shows five sample customers and five source rows. |
| F-2-4 | `paid-kit` registers and proves the mapping recipes and sign-off checklist. | Test `@claim:paid-kit`; screenshot `.factory/evidence/polish-6/live/home-desktop-cold.png`; live paid section names both tested contents. |
| F-2-5 | The same claim and download retain exactly five named recipes. | Test `@claim:paid-kit`; screenshot `.factory/evidence/polish-6/live/home-desktop-cold.png`; live `/` states “Five named mapping recipes.” |
| F-2-6 | The kit retains structured upload-owner and second-engineer-approval fields. | Test `@claim:paid-kit`; screenshot `.factory/evidence/polish-6/live/home-desktop-cold.png`; live `/` advertises the same tested fields. |
| F-2-7 | Recording, error, and review-file claims execute the bundled CLI and compare observable results. | Tests `@claim:recorded-cli-sample`, `@claim:demo-errors`, and `@claim:review-files`; screenshot `.factory/evidence/polish-6/live/demo-desktop-cold.png`; live demo displays the matched five-row, three-error, four-file result. |
| F-2-8 | The README heading remains “Run a CSV replay.” | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-6/live/home-desktop-cold.png`; live Start for real reaches the install section. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 / F-1-12 | The prior billing-copy regression remains removed from landing, README, Privacy, and Terms. | Tests `purchase copy keeps only the checkout behavior covered by evidence` and `@claim:checkout-redirect`; screenshot `.factory/evidence/polish-6/live/terms-mobile-cold.png`; live audit found none of the removed promises and checkout returned 303. |
| F-3-2 | CLI demos use atomic, per-process unique temporary directories and publish four complete artifacts. | Test `@claim:demo-temp` starts 40 concurrent demos; screenshot `.factory/evidence/polish-6/live/demo-mobile-cold.png`; the clean clone produced 40 distinct directories while the live web demo remained isolated. |

## Review 4 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | README gives the honest source-checkout install path and makes no release-availability claim. | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-6/live/home-mobile-cold.png`; live install section shows the source command. |
| F-4-2 | README uses the direct `cargo package` instruction and no registry-readiness wording. | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-6/live/home-desktop-cold.png`; clean-clone `cargo package` passed. |
| F-4-3 | `build-artifacts` registers and tests the release binary and static site build. | Test `@claim:build-artifacts`; screenshot `.factory/evidence/polish-6/live/home-desktop-cold.png`; live index and JavaScript hashes match the clean build. |
| F-4-4 | `build-artifacts` also asserts `dist/site/index.html`, route documents, and hashed assets. | Test `@claim:build-artifacts`; screenshot `.factory/evidence/polish-6/live/home-mobile-cold.png`; live index SHA-256 is `649e52a4441332e2e17f132f0d82a12e496f65856e4e51b5da4846fb92466de3`. |
| F-4-5 | `site-routing-headers` proves known routes, the custom 404, CSP, `nosniff`, referrer policy, and permissions policy. | Test `@claim:site-routing-headers`; screenshot `.factory/evidence/polish-6/live/404-mobile-cold.png`; live route matrix confirmed 200/404 status and security headers. |
| F-4-6 | README retains the non-sentence `Production site:` label. | Test `documentation and page copy retain every reviewed wording correction`; screenshot `.factory/evidence/polish-6/live/home-mobile-cold.png`; live production root returned 200 with the correct canonical. |
| F-4-7 | `mit-license` proves Cargo metadata and the complete MIT terms. | Test `@claim:mit-license`; screenshot `.factory/evidence/polish-6/live/terms-mobile-cold.png`; live Terms returned 200 and names the MIT License. |

## Review 5 finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-5-1 | Entering demo aborts a pending license request; completion cannot write storage or UI after the route change. | Test `@claim:demo-private demo stores nothing and sends no data away`; screenshot `.factory/evidence/polish-6/live/demo-mobile-cold.png`; live held-response race ended with only the original license sentinel and zero active cross-origin requests. |

## Review 6 finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-6-1 | Added `license-unavailable-fallback` to `.factory/claims.json`. Its single tagged test seeds an aged valid verdict, records an HTTP 503 response, and proves the status, visible download, one recheck, and unchanged verdict. | Test `@claim:license-unavailable-fallback`; screenshot `.factory/evidence/polish-6/live/license-fallback-mobile.png`; live cold check returned the fallback status and visible download after one recorded 503. |

## Acceptance evidence

- All 29 exact claim commands passed independently from the clean clone.
- Clean-clone `npm test`: 7 Rust tests and 68 Playwright tests passed; 2
  intentional project skips.
- Clean-clone typecheck, rustfmt, Clippy with warnings denied, `cargo package`,
  and `npm run build` passed.
- Production bundle: 22.56 kB raw / 7.22 kB gzip JavaScript and 13.10 kB raw
  / 3.67 kB gzip CSS.
- `/opt/fleet/lib/verify-url.sh` passed with no console or structure error.
- The live cold audit ran full Axe on six routes at desktop and mobile sizes:
  zero violations, zero horizontal overflow, and no application console error.
- All rendered links resolved: internal pages and Sociobot returned 200; the
  designed 404 returned 404; checkout returned 303 to Dodo Payments.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.8 s, CLS 0, TBT 20 ms, transfer 194 KiB.

Every finding is closed. No severity is deferred.
