# Polish round 8 — zero-finding closure

Deployed code commit: `6e46027a92ce8e49a6700f5ebbc54d34e93a6bab`.
Azure Static Web Apps deployment: `ea2f41bc-4b50-466c-94c5-34177c9ae953`.
Live site: <https://import-mapping-replay.sociobot.in>.

Live evidence is under `.factory/evidence/polish-8/live/`. The acceptance
clone was `/tmp/import-mapping-replay-polish8-clean.PqGqv8/repo` at the
deployed code commit. Browser checks used fresh contexts.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved history-state scroll restoration and moved focus to the restored page heading. | Test `navigation restores scroll on Back and terminal recording has a clear action`; `live/home-desktop-cold.png`; live `/` audit records scroll `3203 → 3203` and focus `#page-title`. |
| F-1-2 | Preserved the designed 404 response for unknown URLs. | `@claim:site-routing-headers`; `live/404-mobile-cold.png`; live GET and HEAD `/polish-8-not-found` returned 404. |
| F-1-3 | Kept Privacy visible in the mobile header and all mobile targets at least 44 px. | Test `header keeps Privacy visible and usable`; `live/home-mobile-cold.png`; live `/privacy` returned 200 and passed the mobile target audit. |
| F-1-4 | Kept distinct titles, descriptions, canonicals, Open Graph, and Twitter metadata on every route. | Test `all routes set specific metadata and unknown routes return HTTP 404`; `live/terms-mobile-cold.png`; live cold audit passed `/`, `/demo`, `/privacy`, `/terms`, `/404`, and the unknown route. |
| F-1-5 | Kept the concrete h1 “Replay CSV imports before upload” and the audience/outcome sentence. | Test `documentation and page copy retain every reviewed wording correction`; `live/home-mobile-cold.png`; live `/` shows the exact first-screen wording. |
| F-1-6 | Kept the literal process heading “How the replay works.” | Copy regression test above; `live/home-desktop-cold.png`; live `/#how-it-works` resolves. |
| F-1-7 | Kept the literal limits heading “What the CLI does not do.” | Copy regression test above; `live/home-mobile-cold.png`; live `/` contains the heading. |
| F-1-8 | Kept “Page not found” as the 404 h1. | Route metadata test; `live/404-mobile-cold.png`; live `/404` returned 404 with the expected title. |
| F-1-9 | Kept “Show the sample replay again” as the terminal action. | Navigation/terminal-action test; `live/home-desktop-cold.png`; live `/` button opens the demo. |
| F-1-10 | Preserved tested local CLI processing, limited browser storage, and local-only rollback scope. | `@claim:cli-local-only`, `@claim:website-license-storage-only`, `@claim:rollback-local-scope`; `live/privacy-mobile-cold.png`; live demo request/storage audit passed. |
| F-1-11 | Preserved the once-per-24-hours license-result cache. | `@claim:license-cache-day`; `live/privacy-mobile-cold.png`; live `/privacy` describes the same two stored values. |
| F-1-12 | Kept unsupported merchant, refund, and card-data promises out of the product copy. | Test `purchase copy keeps only the checkout behavior covered by evidence`; `live/terms-mobile-cold.png`; live checkout returned 303 to `checkout.dodopayments.com`. |
| F-1-13 | Kept unsupported buyer/team license-scope promises removed. | Purchase-copy test; `live/terms-mobile-cold.png`; live Terms makes no scope promise. |
| F-1-14 | Standardized the external destination on “customer system” in the landing page, Terms, README, CLI warning, and registered claim. | Test `documentation and page copy retain every reviewed wording correction`; `live/home-desktop-cold.png` and `live/terms-mobile-cold.png`; live `/` and `/terms` contain “customer system” and reject the removed variants. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Preserved the one-click `/?demo=1` path, persistent sandbox banner, mapped value, complete error, correction, Reset, and Start for real controls. | Tests `demo first view shows a mapped value and a complete validation row on mobile` and `correcting the sample keeps validation results, focus, and the live result in sync`; `live/demo-query-mobile-cold.png`; live direct-demo audit preserved real-storage sentinels and Reset restored three errors. |
| F-2-2 | Kept all three facts inside the first desktop and mobile viewports. | Test `desktop hero keeps all three product facts in the first viewport`; `live/home-desktop-cold.png` and `live/home-mobile-cold.png`; live cold audit passed both sizes. |
| F-2-3 | Kept the sample’s five-row statement registered and measured. | `@claim:demo-row-count`; `live/demo-mobile-cold.png`; live demo shows five source rows. |
| F-2-4 | Kept the exact team-kit recipe and checklist contents. | `@claim:paid-kit`; `live/home-desktop-cold.png`; live kit section names both items. |
| F-2-5 | Kept exactly five named mapping recipes. | `@claim:paid-kit`; `live/home-desktop-cold.png`; downloaded kit test counts five. |
| F-2-6 | Kept upload-owner and second-engineer-approval checklist fields. | `@claim:paid-kit`; `live/home-desktop-cold.png`; downloaded kit test inspects both fields. |
| F-2-7 | Kept the terminal recording derived from the real bundled CLI outcomes. | `@claim:recorded-cli-sample`, `@claim:demo-errors`, `@claim:review-files`; `live/demo-desktop-cold.png`; live values match five rows, three errors, and four review files. |
| F-2-8 | Kept the contextual README heading “Run a CSV replay.” | Copy regression test; `live/home-mobile-cold.png`; the live install section and README use the same job language. |

## Reviews 3–7 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Kept unsupported billing and refund claims removed. | Purchase-copy test; `live/terms-mobile-cold.png`; live checkout behavior alone is claimed and returned 303. |
| F-3-2 | Preserved atomic, unique temporary directories for simultaneous CLI demos. | `@claim:demo-temp`; `live/demo-mobile-cold.png`; the clean-clone claim ran 40 demos concurrently and found 40 distinct directories. |
| F-4-1 | Kept the source-checkout installation command honest. | Copy regression test; `live/home-mobile-cold.png`; README uses `cargo install --path .`. |
| F-4-2 | Kept direct `cargo package` guidance and removed vague registry wording. | Copy regression test; `live/home-desktop-cold.png`; clean-clone `cargo package` verified the archive. |
| F-4-3 | Kept the build-output promise registered. | `@claim:build-artifacts`; `live/home-desktop-cold.png`; clean-clone `npm run build` passed. |
| F-4-4 | Preserved route documents and hashed assets in `dist/site`. | `@claim:build-artifacts`; `live/home-desktop-cold.png`; live index, JS, and CSS SHA-256 hashes match `dist/site`. |
| F-4-5 | Preserved GET and HEAD assertions for explicit and unknown 404 routes. | `@claim:site-routing-headers`; `live/404-desktop-cold.png`; live GET/HEAD `/404` and `/polish-8-not-found` all returned 404. |
| F-4-6 | Kept the factual label “Production site:” instead of a publication promise. | Copy regression test; `live/home-mobile-cold.png`; live canonical points to the production URL. |
| F-4-7 | Kept the complete MIT license and matching package/Terms metadata. | `@claim:mit-license`; `live/terms-mobile-cold.png`; live `/terms` names MIT. |
| F-5-1 | Preserved request abort and route guards when demo entry interrupts a real-license check. | `@claim:demo-private`; `live/cold-audit.json`; live held-request test ended with zero active cross-origin requests and unchanged real storage. |
| F-6-1 | Preserved cached-valid team-kit access when a recheck is unavailable. | `@claim:license-unavailable-fallback`; `live/license-fallback-mobile.png`; live audit records one 503 recheck and a visible download. |
| F-7-1 | Preserved the rewrite-based explicit `/404` route so both GET and HEAD return a real 404 document. | `@claim:site-routing-headers`; `live/404-desktop-cold.png`; live method matrix records all four 404 responses. |
| F-7-2 | Preserved boundary-complete ASCII email-domain coverage. | `@claim:email-domain-validation`; `live/demo-mobile-cold.png`; the exact clean-clone claim accepts the supported fixtures and rejects all six documented invalid classes. |

## Review 8 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-8-1 / reopened F-1-14 | Replaced “another product” and destination uses of “elsewhere” with “customer system” across the site, README, CLI warning, copy audit, and claim. Added positive and negative regressions. | Test `documentation and page copy retain every reviewed wording correction`; `live/terms-mobile-cold.png`; live `/`, `/privacy`, and `/terms` passed exact-copy and removed-term checks. |
| F-8-2 | Standardized all four CLI outputs as “review files” in README safety copy, demo metadata, Rust names/errors, the registered atomicity claim, and tests. “Build artifacts” remains only the distinct compile/deployment concept. | `@claim:atomic-review-files` plus the copy regression test; `live/demo-desktop-cold.png`; live `/` and `/demo` name four review files and the removed output synonyms are absent. |

## Acceptance evidence

- Every one of the 33 commands in `.factory/claims.json` passed independently
  from the clean clone. A registry check found exactly one tagged test per ID.
- `npm test` passed 9 Rust tests and 76 Playwright checks; 2 cross-project
  duplicates were intentionally skipped. This covers unit, integration,
  browser, keyboard/focus, accessibility, privacy, offline CLI, responsive,
  demo-isolation, and payment-boundary behavior.
- `npm run typecheck`, `cargo fmt --all -- --check`,
  `cargo clippy --all-targets -- -D warnings`, `cargo package`, and
  `npm run build` all passed from the clean clone.
- The release archive contains 73 files and is 474.1 KiB compressed. The site
  ships 22,961 B JavaScript (7.33 KiB gzip) and 13,124 B CSS (3.68 KiB gzip).
- `verify-url.sh` passed. The live audit found zero Axe violations, zero
  horizontal overflow, no undersized mobile targets, and no console errors on
  all six routes at desktop and mobile sizes.
- Live Lighthouse mobile scored Performance 99, Accessibility 100, Best
  Practices 100, and SEO 100. LCP was 1.9 s, CLS 0, TBT 70 ms, Speed Index
  0.9 s, and total transfer 194 KiB.
- The catalog description starts with “Replay” and is 79 characters.
- The production index, JavaScript, and CSS SHA-256 hashes match the deployed
  code build byte for byte.

Every current and cumulative finding is closed. Nothing is deferred.
