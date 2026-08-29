# Independent verification 10 — PASS

Verified 29 August 2026 against candidate commit
`279f6f0333f36445e5263f386ae3a3798471e63c` and the live deployment
<https://import-mapping-replay.sociobot.in>.

## Verdict

**PASS.** The live static application byte-matches the candidate build and the
Rust CLI completes the brief's local, repeatable CSV replay workflow. No
release-blocking defects were found.

## Cold first read

Opened `/` in a fresh browser context at 1440 × 900. The first screen says
“Replay CSV imports before upload”; it says this is for implementation
engineers who need a reviewed output CSV and error report before each customer
upload; and its primary action is **Try it with sample data**, with the result
explained beside it (“See a finished replay and three caught errors.”). The
three first-screen facts cover local CSV handling, offline CLI operation, and
the free core/£24 optional kit. This satisfies the plain-words and one-click
demo contract.

## Mandatory claim manifest

`npm ci` completed with zero vulnerabilities. I then ran each of the 28 exact
`test` commands in `.factory/claims.json` from this checkout. All passed; the
last-run result was `passed` with no failed tests. I also reran the final three
manifest selections while recording terminal output: build/site routing (2
tests) and MIT license (2 tests) passed.

| Claim ID | Result |
| --- | --- |
| demo-errors | PASS |
| demo-row-count | PASS |
| recorded-cli-sample | PASS |
| review-files | PASS |
| demo-private | PASS |
| cli-offline | PASS |
| cli-local-only | PASS |
| demo-temp | PASS |
| cli-replay | PASS |
| mapping-v1 | PASS |
| source-unchanged | PASS |
| atomic-artifacts | PASS |
| json-output | PASS |
| actionable-errors | PASS |
| paid-kit | PASS |
| checkout-redirect | PASS |
| license-return-storage | PASS |
| license-url-stripping | PASS |
| license-privacy | PASS |
| website-license-storage-only | PASS |
| license-cache-day | PASS |
| core-no-license | PASS |
| rust-msrv | PASS |
| revoked-license-lock | PASS |
| rollback-local-scope | PASS |
| build-artifacts | PASS |
| site-routing-headers | PASS |
| mit-license | PASS |

## Local product and package checks

- `npm test`: PASS — 7 Rust unit tests, 66 Playwright tests passed, 2
  intentional skips.
- `npm run typecheck`, `cargo fmt --check`, and
  `cargo clippy --all-targets -- -D warnings`: PASS.
- `cargo package`: PASS; package verification compiled successfully.
- `npm run build`: PASS; produced `target/release/import-mapping-replay` and
  `dist/site`.
- Production initial assets: JavaScript 22.55 kB raw / 7.22 kB gzip; CSS
  13.10 kB raw / 3.67 kB gzip — within the static-product budgets.
- Fresh-consumer exercise: installed the packaged crate with `cargo install
  --path target/package/import-mapping-replay-0.1.0 --root <temp>`; `--help`
  exposed `run` and `demo`; `demo --json` produced five rows, three validation
  errors, and all four review files in a new temporary directory.
- End-to-end normal case: the release binary replayed
  `examples/valid-customers.csv` with `examples/mapping.json`, returned
  `status: valid`, `rows: 3`, `validation_errors: 0`, and wrote non-empty
  `output.csv`, `evidence.json`, `validation.json`, and
  `rollback-manifest.json`. Invalid recovery: a nonexistent source returned
  exit code 1 and “could not read source CSV …; check the path”. Boundary and
  malformed-row atomicity are additionally covered by the passing exact claim
  tests.

## Live deployment, privacy, accessibility, and performance

- Candidate/live parity: local and live `index.html` SHA-256 both
  `4efa85bdad69d843aa563fbc223b925c7f019936089d98dd1cb2431a696c022b`;
  local and live JavaScript SHA-256 both
  `56339fa81f35a53c26216536dae8fe09958041610af6115026720aae0f99e67c`.
- Routes `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/404` and an
  unknown route returned the designed 404 with 404 status. All carried CSP
  (including `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`,
  strict referrer policy, permissions policy, and HSTS. HTML uses
  `max-age=30`; the hashed JS uses `max-age=31536000, immutable`.
- `tests/live-audit.mjs` passed on all six checked routes at 1440 × 900 and
  390 × 844. It found zero Axe violations, no console/page errors, no
  horizontal overflow, ≥44 px mobile targets, correct route metadata, working
  demo correction/reset/focus behavior, and browser Back scroll/focus
  restoration.
- `/opt/fleet/lib/verify-url.sh` passed: title, `lang=en`, one h1, main,
  image alt text, and button labels are present; no console errors.
- Keyboard check: Tab lands first on the skip link with a 3 px visible focus
  outline; Enter moves focus to `main`. The primary demo action, replay
  control, purchase link, license input, and verification control remain
  keyboard-operable with the same visible focus treatment. Reduced-motion
  emulation reports the product's 0.01 ms motion override.
- Privacy/request log: fresh landing and direct `/demo` made same-origin-only
  requests, left localStorage empty, and set no browser cookies. Demo with
  pre-existing real-license sentinels preserved those values through reset.
  A returned license is stripped from the visible URL, stored as
  `sb_license:import-mapping-replay`, and the sole cross-origin verification
  request targets `https://api.sociobot.in/api/v1/products/import-mapping-replay/verify`.
  The held landing-to-demo verification race aborted with no cross-origin
  request remaining and no demo storage contamination.
- Request allowance: a burst of invalid verification requests received 429 on
  the 31st request in the rate test, with `Retry-After: 3` and
  `X-RateLimit-After: 3`; the observed effective allowance was 30 immediate
  requests (after one earlier single invalid-license probe).
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.9 s, CLS 0, TBT 0 ms, transfer 194 KiB.

Evidence: `.factory/evidence/verification-10/live/cold-audit.json`, route
screenshots in that directory, `lighthouse-mobile.json`, and
`.factory/evidence/verification-10/verify-url/`.

## Defects

None found. No severity entries.
