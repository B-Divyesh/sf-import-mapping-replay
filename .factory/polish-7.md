# Polish round 7 — cumulative finding closure

Deployed code commit: `600ef3a92e457d2c0912c8a895e7f95bddb63ff4`.
Deployment: `9e9e2b80-be4c-4f92-98a2-a4ee8b1c385c` at
<https://import-mapping-replay.sociobot.in>.

Evidence is under `.factory/evidence/polish-7/live/`. The final clean clone
was `/tmp/import-mapping-replay-polish7-deployed.MdtR2R/repo` at the deployed
commit. Every browser check used a new context.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained history-state scroll restoration and focus transfer on Back. | Test `navigation restores scroll on Back and terminal recording has a clear action`; `live/cold-audit.json` records `3203 → 3203` and `#page-title`; `live/home-desktop-cold.png`. |
| F-1-2 | Retained a real designed 404 for unknown URLs, then hardened explicit `/404` in F-7-1. | `@claim:site-routing-headers`; `live/404-mobile-cold.png`; live GET and HEAD `/polish-7-not-found` both returned 404. |
| F-1-3 | Retained the visible mobile Privacy header link and 44 px controls. | Test `header keeps Privacy visible and usable`; `live/home-mobile-cold.png`; live `/privacy` returned 200. |
| F-1-4 | Retained static and client route-specific title, description, canonical, OG, and Twitter fields. | Test `all routes set specific metadata and unknown routes return HTTP 404`; `live/terms-mobile-cold.png`; live cold audit checked all routes. |
| F-1-5 | Retained the concrete h1 “Replay CSV imports before upload” and output/error-report lede. | Test `documentation and page copy retain every reviewed wording correction`; `live/home-mobile-cold.png`; live `/` contains both strings. |
| F-1-6 | Retained “How the replay works” in place of the mood heading. | Test `documentation and page copy retain every reviewed wording correction`; `live/home-desktop-cold.png`; live `/`. |
| F-1-7 | Retained “What the CLI does not do” as the limits heading. | Test `documentation and page copy retain every reviewed wording correction`; `live/home-desktop-cold.png`; live `/`. |
| F-1-8 | Retained literal “Page not found” on the designed 404 page. | Test `all routes set specific metadata and unknown routes return HTTP 404`; `live/404-mobile-cold.png`; live `/404` returned 404. |
| F-1-9 | Retained “Show the sample replay again” as the terminal action. | Test `navigation restores scroll on Back and terminal recording has a clear action`; `live/home-desktop-cold.png`; live `/`. |
| F-1-10 | Retained tested CLI-local-only, website-storage-only, and rollback-scope behavior. | `@claim:cli-local-only`, `@claim:website-license-storage-only`, `@claim:rollback-local-scope`; `live/privacy-mobile-cold.png`; live demo request/storage audit passed. |
| F-1-11 | Retained the tested 24-hour license verification cache. | `@claim:license-cache-day`; `live/privacy-mobile-cold.png`; live privacy route passed cold audit. |
| F-1-12 | Kept unproved merchant, refund, and card-data promises removed. | Test `purchase copy keeps only the checkout behavior covered by evidence`; `live/terms-mobile-cold.png`; live checkout GET and HEAD returned 303. |
| F-1-13 | Kept unproved buyer/team licence scope removed. | Test `purchase copy keeps only the checkout behavior covered by evidence`; `live/terms-mobile-cold.png`; live Terms has no buyer-scope promise. |
| F-1-14 | Retained “customer system” as the sole external-product term. | Test `documentation and page copy retain every reviewed wording correction`; `live/home-desktop-cold.png`; live `/` and README agree. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Retained first-viewport mapped data, complete error, correction, and Reset behavior. | Tests `demo first view shows a mapped value and a complete validation row on mobile` and `correcting the sample keeps validation results, focus, and the live result in sync`; `live/demo-mobile-cold.png`; live audit reset restored three errors. |
| F-2-2 | Retained all three facts in each required first viewport. | Test `desktop hero keeps all three product facts in the first viewport`; `live/home-desktop-cold.png` and `live/home-mobile-cold.png`; live audit asserted both sizes. |
| F-2-3 | Retained the registered five-row sample claim. | `@claim:demo-row-count`; `live/demo-mobile-cold.png`; live demo shows five sample customers. |
| F-2-4 | Retained claimed team-kit recipe and checklist contents. | `@claim:paid-kit`; `live/home-desktop-cold.png`; live kit section names both. |
| F-2-5 | Retained exactly five named mapping recipes. | `@claim:paid-kit`; `live/home-desktop-cold.png`; live kit copy says five named recipes. |
| F-2-6 | Retained upload-owner and second-engineer-approval fields. | `@claim:paid-kit`; `live/home-desktop-cold.png`; downloaded kit test inspects both fields. |
| F-2-7 | Retained recording checks against the real bundled CLI outcomes. | `@claim:recorded-cli-sample`, `@claim:demo-errors`, and `@claim:review-files`; `live/demo-desktop-cold.png`; live values match five rows, three errors, and four files. |
| F-2-8 | Retained the contextual README heading “Run a CSV replay.” | Test `documentation and page copy retain every reviewed wording correction`; `live/home-desktop-cold.png`; live install anchor works. |

## Reviews 3–6 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Kept unproved billing/refund claims removed across site and README. | Test `purchase copy keeps only the checkout behavior covered by evidence`; `live/terms-mobile-cold.png`; checkout returned 303. |
| F-3-2 | Retained atomic, unique temporary CLI demo directories. | `@claim:demo-temp`; `live/demo-mobile-cold.png`; final clean clone ran 40 concurrent demos successfully. |
| F-4-1 | Kept the honest source-checkout installation path. | Test `documentation and page copy retain every reviewed wording correction`; `live/home-mobile-cold.png`; README names `cargo install --path .`. |
| F-4-2 | Kept direct `cargo package` instruction and removed vague registry wording. | Test `documentation and page copy retain every reviewed wording correction`; final clean-clone `cargo package` passed. |
| F-4-3 | Retained registered build-artifact claim. | `@claim:build-artifacts`; final clean-clone `npm run build`; live build hashes match. |
| F-4-4 | Retained tested `dist/site` document and hashed-asset output. | `@claim:build-artifacts`; final clean clone found every route document; live index hash matches. |
| F-4-5 | Expanded the routing claim to assert GET and HEAD status on both `/404` and an unknown route. | `@claim:site-routing-headers`; `live/404-mobile-cold.png`; live matrix reports both methods as 404. |
| F-4-6 | Retained the non-claim “Production site:” label. | Test `documentation and page copy retain every reviewed wording correction`; `live/home-mobile-cold.png`; live canonical is correct. |
| F-4-7 | Retained complete MIT registration and package metadata. | `@claim:mit-license`; final clean-clone `cargo package`; live Terms names MIT. |
| F-5-1 | Retained abort and route guards for a pending real-license request on demo entry. | `@claim:demo-private`; `live/cold-audit.json`; held response left only the real-license sentinel and zero active cross-origin requests. |
| F-6-1 | Retained cached-valid team-kit access during an unavailable verification request. | `@claim:license-unavailable-fallback`; `live/license-fallback-mobile.png`; live audit recorded one 503 recheck and visible download. |

## Review 7 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-7-1 | Replaced the `/404` status-only route with a rewrite to `/_not-found`, allowing the standard response override to deliver the designed document with a true 404 for GET and HEAD. | Updated `@claim:site-routing-headers`; `live/404-desktop-cold.png`; live `cold-audit.json` records GET/HEAD `/404` and `/polish-7-not-found` = 404. |
| F-7-2 | Expanded `email-domain-validation` claim and tagged fixture to prove two supported ASCII addresses and reject non-ASCII, spaces, one-label, leading-dot, trailing-dot, and repeated-dot inputs. | `@claim:email-domain-validation`; final clean-clone command passed; README wording is now fully covered by the registered claim. |

## Acceptance evidence

- The final clean clone passed all 33 exact claim commands independently.
- `npm test` passed: 9 Rust tests and 76 Playwright checks, with 2 intentional
  skips. Typecheck, rustfmt, Clippy with warnings denied, `cargo package`, and
  `npm run build` passed.
- The deployed 22,934 B JavaScript (7,366 B gzip), 13,100 B CSS (3,684 B gzip),
  and index HTML byte-match the production build.
- `verify-url.sh` passed with no console or structural issue. The live cold
  audit found zero Axe violations, zero horizontal overflow, correct mobile
  targets, and no application console error across six routes.
- Mobile Lighthouse scored Performance 100, Accessibility 100, Best Practices
  100, and SEO 100 (LCP 1.885 s, CLS 0, TBT 21 ms, transfer 199,128 B).

Every finding is closed. No severity is deferred.
