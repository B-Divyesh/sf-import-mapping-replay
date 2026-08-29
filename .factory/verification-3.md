# Independent verification 3 — FAIL

Verified on 29 August 2026 against candidate
`93eb8c58729433fe003ee96352d93bb1621ac544` and
<https://import-mapping-replay.sociobot.in>.

## Verdict: FAIL — release blocked by the claims contract

The prior live billing failure is repaired: fresh `GET` and `HEAD` requests to
`https://api.sociobot.in/api/v1/products/import-mapping-replay/checkout`
returned HTTP `303` to `checkout.dodopayments.com`. The live static assets
byte-match the candidate build, so this is a fresh result rather than the old
deployment failure.

The candidate nevertheless fails the mandatory `claims` acceptance contract.
Several factual promises that a visitor could rely on have no corresponding
entry in `.factory/claims.json`, hence no separately runnable observable test.
The contract explicitly makes an unlisted claim a failing finding. This report
does not change product code.

## First read and demo

Fresh cold load of the live landing page at 1440 x 900 answered all three
required questions in plain words:

- It does: “Replay CSV mappings with proof.”
- It is for: implementation engineers who need customer imports reviewed,
  rerun, and traced.
- First action: **Try it with sample data**; its adjacent note says it shows a
  finished replay and three caught errors.

The primary action reached `/demo` in one click. It showed the persistent
“Demo — sample data, nothing is saved” banner, Reset demo, Start for real,
three issue rows, and all four review files. The first-read/demo requirement
passes.

## Required claims — all executed independently from the demo entry point

After fresh `npm ci` (23 packages installed; zero vulnerabilities), every
exact command in `.factory/claims.json` passed when run separately:

| Claim ID | Result |
| --- | --- |
| `demo-errors` | PASS |
| `review-files` | PASS |
| `demo-private` | PASS |
| `cli-offline` | PASS |
| `demo-temp` | PASS |
| `cli-replay` | PASS |
| `mapping-v1` | PASS |
| `source-unchanged` | PASS |
| `json-output` | PASS |
| `actionable-errors` | PASS |
| `paid-kit` | PASS |
| `license-privacy` | PASS |

## Local product and package verification

All available quality gates passed from this checkout:

```sh
npm test                         # 3 Rust tests; 18 Playwright tests
npm run typecheck
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build                    # creates dist/site
cargo package --allow-dirty      # package verification build passed
```

The packaged crate was installed into a new temporary consumer with
`cargo install --path target/package/import-mapping-replay-0.1.0 --root
<temp>`. The installed `0.1.0` binary had working help and `demo --json`
(5 rows, 3 validation errors, a fresh temporary directory). A normal valid
replay with `--sample 0 --json` returned `valid`, 3 rows, 0 validation errors,
left the source hash unchanged, and wrote zero evidence fields as requested.
The shipped invalid input returned exit code 2 with `review_required`, three
errors, and all four review files. A version-2 mapping returned exit code 1
with “not supported; use version 1.”

## Live deployment, privacy, and accessibility

- Local production output byte-matches live `index.html`, JS, CSS, and hero:
  `8bd373f4bbd6675cb35737f31fbe64e558b85257ee5bb8c68c10778c1ef78176`,
  `4d62468784f24163f5cc5822c7b0d823fb0600d0f808dd573bdd7ff005c7e596`,
  `b147779a7ce40c3436023206d6d0ce151e1709ca4386d514ebd9233c635f86ef`, and
  `3e534cbab9801eccb9c342452c4cee7d25c48cc4ae64a0d9274e3b82e3307a95`.
- Live `/`, `/demo`, `/privacy`, `/terms`, and an unknown route were checked
  at 1440 x 900 and 390 x 844. Each had `lang=en`, exactly one `h1` and
  `main`, no horizontal overflow, no page/console errors, and no Axe
  serious/critical findings.
- Keyboard-only: first Tab focused the Skip to main content link with its
  visible 3 px `#b92f28` focus ring; Enter focused `main`. Reduced-motion
  browser mode set transition and animation duration to `0.00001s`.
- A fresh browser demo request log contained only same-origin document, JS,
  CSS, and bundled poster requests. It left localStorage and cookies empty
  before and after Reset demo. There is no telemetry request. Optional license
  verification is constrained to `https://api.sociobot.in` and is described in
  the privacy page.
- Browser-observed response headers include a self-only CSP (with only the
  declared Sociobot `connect-src`), HSTS, `nosniff`, strict referrer policy,
  HTML 30-second revalidation, and immutable one-year cache headers for hashed
  CSS/JS. JS is 18,172 bytes raw / 5,970 gzip and CSS is 10,770 raw / 3,200
  gzip; the 185,892-byte hero is below the stated budget. Lighthouse was not
  installed in this clean checkout; direct browser, bundle, caching, and
  accessibility gates above were run instead.
- The only server endpoint used by the product, Sociobot license verification,
  enforced throttling from this single client: a 40-request concurrent burst
  returned 30 HTTP 200 invalid-license responses and 10 HTTP 429 responses;
  every 429 included `Retry-After: 4`. Observed allowance: 30 requests per
  burst window. There is no sign-in, PWA/service worker, or product backend;
  the corresponding tenant, offline-page reload, persistence, and backend
  concurrency checks do not apply.

## Defects by severity

### High — release blocking: factual marketing claims are unlisted and untested

`.factory/claims.json` contains no entries/tests for these explicit promises:

- Landing: “Replay costs £0.” and “The CLI stays free.” README: “The CLI is
  free and has no row limit.” The `paid-kit` claim verifies the £24 paid kit;
  it does not assert free core access or an unlimited row count.
- Landing: “Rust 1.85 or newer builds the CLI.” No claim establishes the
  documented minimum compiler version.
- Landing: “It does not schedule or upload imports.” No claim asserts the
  absence of those operations. `cli-offline` proves a bundled demo succeeds
  behind a closed proxy, but is not an observable test of this broader promise.
- Landing: “A refund revokes the license.” No claim tests revoked-license
  behavior. `license-privacy` records a valid verification response only.

Add one claim entry and one separately runnable demo/CLI test for each promise,
or remove/reword the promises to facts the existing claims actually prove.
Then rerun independent verification. The functional product and checkout do
not need a code repair for the prior billing issue.

## Non-blocking notes

`verify-url.sh` was not present in this checkout, so its requested smoke check
could not be run. Equivalent live Playwright checks covered its specified
title, language, main, alt/semantic, and console/error conditions.
