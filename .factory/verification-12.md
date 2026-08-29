# Independent verification 12 — FAIL

Verified 29 August 2026 against candidate commit
`fb8805a3cba37612ff650bc593fb243ecebf0be4` and the live deployment
<https://import-mapping-replay.sociobot.in>.

## Verdict

**FAIL.** The candidate and live deployment pass the first-read, declared
claim, build, package, accessibility, privacy, performance, and deployment
identity gates. Independent boundary testing found two release blockers:

1. A returned checkout license can inherit a fresh cached verdict belonging to
   a different token. The new token is not sent for verification. This can
   leave a new buyer locked out, or show the paid kit for a newly returned
   invalid token.
2. The documented `email` validation rule accepts plainly malformed domains,
   including `a@.com`, `a@example.`, and `a@b..com`, and reports the replay as
   valid.

The earlier deployment-only concern was not reproduced. Every built route and
public asset checked byte-matches production.

No product code was modified during this verification.

## Cold first read and one-click demo

PASS. I opened production in a fresh 1440 x 900 context with empty storage.
The first viewport answers all three required questions:

- What it does: **“Replay CSV imports before upload.”**
- For whom: implementation engineers who need reviewed output and an error
  report before each customer upload.
- What to do first: **“Try it with sample data”**, beside **“See a finished
  replay and three caught errors.”**

The action is visible without scrolling at 1440 x 900 and 390 x 844. One
keyboard-operated click opens `/?demo=1`, titled “Demo — Import Mapping
Replay,” with five sample rows, a mapped before/after value, three errors, and
four review filenames. The persistent banner says “Demo — sample data,
nothing is saved” and offers **Reset demo** and **Start for real**. Reset
restores all three errors.

## Mandatory claims

`.factory/claims.json` exists and contains 31 claims. After `npm ci`, I ran
every exact `test` command independently. Result: **31/31 PASS, 0 failed**.
Each manifest id occurs exactly once as an `@claim:<id>` tag in
`tests/site.spec.ts`.

| Claim id | Result | Claim id | Result |
| --- | --- | --- | --- |
| `demo-errors` | PASS | `demo-row-count` | PASS |
| `recorded-cli-sample` | PASS | `review-files` | PASS |
| `demo-private` | PASS | `cli-offline` | PASS |
| `cli-local-only` | PASS | `demo-temp` | PASS |
| `cli-replay` | PASS | `mapping-v1` | PASS |
| `source-unchanged` | PASS | `atomic-artifacts` | PASS |
| `json-output` | PASS | `json-error-output` | PASS |
| `duplicate-source-headers` | PASS | `actionable-errors` | PASS |
| `paid-kit` | PASS | `checkout-redirect` | PASS |
| `license-return-storage` | PASS | `license-url-stripping` | PASS |
| `license-privacy` | PASS | `website-license-storage-only` | PASS |
| `license-cache-day` | PASS | `license-unavailable-fallback` | PASS |
| `core-no-license` | PASS | `rust-msrv` | PASS |
| `revoked-license-lock` | PASS | `rollback-local-scope` | PASS |
| `build-artifacts` | PASS | `site-routing-headers` | PASS |
| `mit-license` | PASS |  |  |

The two blockers below are gaps in the current claim scenarios. The existing
license tests cover a returned token only with empty storage, and the mapping
test covers only an address without `@`.

## Release-blocking defects

### High — a returned license reuses another token's cached verdict

The cached verdict contains only `valid` and `checked`; it is not bound to the
license token. `processReturnedLicense()` saves a newly returned token, but
the following non-forced verification accepts any fresh prior verdict and
returns before making a request.

Fresh-browser reproduction against the live candidate, with the verification
response intercepted only to count whether the new token was checked:

1. Seed `sb_license:import-mapping-replay=old-token` and a fresh cached
   `{valid:false}` verdict.
2. Open `/?license=new-valid-token&ref=qa12#team-kit`.
3. The URL is correctly stripped and `new-valid-token` is stored, but there
   are **zero** verification requests. The old invalid verdict remains, the
   status falls back to “The core CLI does not need a license,” and the kit is
   hidden.
4. Repeat with a fresh `{valid:true}` verdict and a newly returned invalid
   token. Again there are **zero** verification requests; the page says
   “License active” and exposes **Download team kit**.

Observed states:

```text
old invalid -> new returned token: requests 0, kit hidden
old valid   -> new returned token: requests 0, kit visible
```

This violates the paid-unlock requirement to verify a returned license on its
first unlock and makes checkout recovery unreliable. Clear or replace the old
verdict when the returned token changes, bind cached verdicts to their token,
and force verification of checkout-return tokens. Add claim coverage for both
old-valid/new-invalid and old-invalid/new-valid transitions.

### High — `email` validation accepts obvious invalid domains

I installed the packaged crate into a new consumer root and ran this version 1
mapping over four rows:

```text
valid@example.com
a@.com
a@example.
a@b..com
```

The installed public CLI exited **0** and returned:

```json
{"status":"valid","rows":4,"validation_errors":0}
```

`validation.json` likewise contained `{"valid":true,"error_count":0}`.
The rule checks only that there is one `@`, the value does not begin with `@`,
and the domain contains a dot. This misses leading, trailing, and consecutive
dots in the domain. Validation is part of the brief's smallest useful product
and is supposed to catch errors before upload. Define the supported email
syntax, reject these unambiguous malformed forms, and add boundary claim tests.

## Other defect

### Medium — immutable caching is applied to unhashed image URLs

`/assets/replay-poster.webp` and `/assets/og-replay.webp` have stable names but
are covered by `/assets/*` and served with:

```text
Cache-Control: public, max-age=31536000, immutable
```

The visible hero can therefore remain stale for a year after an image update.
Use content-hashed output names for these assets or give stable asset names a
revalidating cache policy. Hashed JavaScript and CSS correctly use immutable
caching; HTML correctly uses `public, must-revalidate, max-age=30`.

## Clean install, tests, build, and package

```text
npm ci                                      PASS: 23 packages; 0 vulnerabilities
npm test                                    PASS: 8 Rust; 72 Playwright; 2 intentional skips
npm run typecheck                           PASS
cargo fmt --check                           PASS
cargo clippy --all-targets -- -D warnings   PASS
npm run build                               PASS
cargo package                               PASS, including package verification build
cargo +1.85.0 check --locked                PASS on the declared MSRV
```

There is no separate JavaScript lint script. The exact production build wrote
`target/release/import-mapping-replay` and `dist/site`.

Production asset sizes:

| Asset | Raw | Gzip from Vite | Budget |
| --- | ---: | ---: | ---: |
| JavaScript | 22,557 B | 7.22 kB | <= 200 KB |
| CSS | 13,100 B | 3.67 kB | <= 50 KB |
| Hero WebP | 185,892 B | n/a | <= 300 KB |

## Packaged consumer and CLI workflow

`cargo package` produced and verified version 0.1.0. I installed
`target/package/import-mapping-replay-0.1.0` into a fresh Cargo root and used
only its public executable.

| Case | Result |
| --- | --- |
| `--help` / `--version` | Lists `run` and `demo`; reports 0.1.0. |
| `demo --json` | Exit 0; five rows, three errors, unique temp path, four non-empty artifacts. |
| Valid three-row replay | Exit 0; valid result and four artifacts. |
| Same valid replay twice | All four artifact directories are byte-identical. |
| Header-only CSV | Exit 0; valid zero-row replay. |
| UTF-8 BOM, CRLF, quoted comma | Exit 0; one correct output row. |
| Missing source | Exit 1 with parseable JSON and “check the path.” |
| Mapping version 2 | Exit 1 with parseable JSON and “use version 1.” |
| Invalid sample then corrected rerun | Exit changes 2 to 0; same output becomes valid. |
| Source preservation | SHA-256 is unchanged through the recovery run. |
| Malformed email domains | **FAIL:** exit 0 and zero validation errors. |

The fixed duplicate-header path also passes both its Rust test and its exact
claim command: duplicate names produce a JSON error, exit 1, and no output.
The repaired JSON failure channel is parseable for runtime and argument errors.

## Live deployment identity, routing, and checkout

Candidate/live SHA-256 values match:

| Resource | SHA-256 |
| --- | --- |
| `/` | `649e52a4441332e2e17f132f0d82a12e496f65856e4e51b5da4846fb92466de3` |
| `/demo` | `4776a44da50c21e6a403cf1251a78084a52f8ab6004220487a02232ff0feba78` |
| `/privacy` | `5b7628ab29d081443d96084609e5b1522f6fdbe278c999c3abd8eb25a82053b7` |
| `/terms` | `f2a8c3c563a65898371e9441000a4ad6f421bfcbb7dd0497fda578eb01cdebdc` |
| `/404` | `a6cd485bfbc3b4b3ab6777744ff9866013e3ea50c980177444b59d08c60ddfca` |
| `main-Cj9ugdBB.js` | `617f10363620a026222f8d321556f1e46b9989a4ff91f5eb705f251a0ca2a474` |
| `main-CP8GCJAy.css` | `a62a32c367b4566de19f9e66091f7b83d9fba9141c866c380f26492f78ea0604` |

The two WebP files, provenance JSON, favicon, Apple icon, robots file, and
sitemap also match byte-for-byte. Home, demo, privacy, and terms return 200;
`/404` and an unknown path return the designed 404 with HTTP 404. All gathered
links resolve as intended. The checkout endpoint returns 303 to
`checkout.dodopayments.com`; the hosted page identifies the one-time Import
Mapping Replay Team Mapping Kit and displays USD $32.49 for this verifier's
locale.

## Privacy, response headers, caching, and allowance

The complete direct `/demo` load, correction, and reset made only these
requests:

```text
GET /demo
GET /assets/main-Cj9ugdBB.js
GET /assets/main-CP8GCJAy.css
```

They were all same-origin. Afterwards localStorage, sessionStorage, cookies,
IndexedDB, Cache Storage, and service-worker registrations were empty. A
separate live invalid-license return stripped the token from the address bar,
stored only the license and verdict keys, and made one request to the exact
Sociobot verification endpoint. Its response used `Cache-Control: no-store`.

Live documents include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, a
strict-origin referrer policy, and restrictive camera, microphone, and
geolocation permissions. A conditional request for the hashed JavaScript
returned 304.

The Sociobot verification endpoint enforces a **30-request immediate
allowance** for one client. Requests 1–30 returned 200. Requests 31–33 returned
429; request 31 included `Retry-After: 4` and `X-RateLimit-After: 4`. After five
seconds, the next request returned 200. CORS allowed the tested product origin.

## Accessibility, responsive behavior, and performance

- `/opt/fleet/lib/verify-url.sh` passed production: HTTP 200, 1,144 ms load,
  title, `lang=en`, one h1, main, image alt text, button names, and no
  console/page errors.
- The live audit checked home, demo, privacy, terms, the explicit 404, and an
  unknown route at 1440 x 900 and 390 x 844. Axe reported zero violations on
  all 12 checks; there was no horizontal overflow or normal-route console
  error.
- Every visible mobile link, button, and input measured at least 44 x 44 CSS
  pixels in the live audit.
- At 200% browser zoom, the visual viewport became 195 x 422 CSS pixels; the
  headline and primary action remained present, and the action still opened
  the demo by keyboard after scrolling it into view.
- Keyboard Tab reaches the skip link first. After the focus frame it is at
  `(8, 8)` with a 3 px visible outline. Enter focuses `main`. Enter activates
  the demo link; Space applies the sample correction and focuses its live
  result; Enter resets it and focuses the result heading. No trap was found.
- With reduced motion requested, the media query matches, animation duration
  is `0.01 ms`, and iteration count is one.
- Lighthouse 12.8.2 mobile: Performance **97**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 1.0 s, LCP 2.0 s, TBT 180 ms, CLS 0,
  Speed Index 1.0 s, transfer 198,973 bytes.

Evidence screenshots and machine-readable live audit output are under ignored
`.factory/evidence/verification-12/`.

## Applicability and product review

This is a static documentation/demo site plus a local CLI. It has no product
backend, account sign-in, service worker, or installable PWA, so backend
concurrency/persistence/health, Entra authority, and PWA update/offline reload
checks do not apply. CLI offline and no-network behavior passed the declared
network-guard claims.

The deterministic mapping job does not benefit from runtime AI, so there is no
missed AI feature. Connectors, scheduled ETL, cloud storage, and automatic
third-party imports remain correctly out of scope. The rollback warning does
not imply that an external import can be undone.
