# Independent verification 13 — PASS

Verified 29 August 2026 against candidate commit
`9795fd8582f296c9c6c06e4daa94c918e4d23948` and the live deployment
<https://import-mapping-replay.sociobot.in>.

## Verdict

**PASS.** The candidate works end to end for the researched local CSV replay
job. The first-read and one-click demo gates pass, all 33 declared claims pass,
the clean build and packaged consumer pass, and production byte-matches the
candidate. The two blockers from verification 12 are fixed. No release blocker
was found.

No product code was modified during verification.

## Cold first read and one-click demo

PASS. A new 1440 x 900 browser context opened production with empty storage.
The first viewport answers the required questions in plain words:

- What: **“Replay CSV imports before upload.”**
- Who: implementation engineers needing reviewed output and an error report
  before a customer upload.
- First action: **“Try it with sample data”**, beside **“See a finished replay
  and three caught errors.”**

The action is visible without scrolling. One keyboard-operated action opens
`/?demo=1`, immediately showing five sample rows, a before/after mapping, three
specific errors, and all four review files. The persistent banner says
**“Demo — sample data, nothing is saved”** and includes **Reset demo** and
**Start for real**. Fixing the sample email reduces the count to two; Reset
restores three and moves focus to the result heading.

The same useful first view fits at 390 x 844. Screenshots are under ignored
`.factory/evidence/verification-13/`.

## Mandatory claims

`.factory/claims.json` exists and contains 33 entries. After the clean
`npm ci` dependency install, every exact `test` command was run independently:
**33/33 PASS, 0 failed**. Every id has exactly one corresponding
`@claim:<id>` tag in the test source.

| Claim id | Result | Claim id | Result |
| --- | --- | --- | --- |
| `demo-errors` | PASS | `demo-row-count` | PASS |
| `recorded-cli-sample` | PASS | `review-files` | PASS |
| `demo-private` | PASS | `cli-offline` | PASS |
| `cli-local-only` | PASS | `demo-temp` | PASS |
| `cli-replay` | PASS | `mapping-v1` | PASS |
| `email-domain-validation` | PASS | `source-unchanged` | PASS |
| `atomic-artifacts` | PASS | `json-output` | PASS |
| `json-error-output` | PASS | `duplicate-source-headers` | PASS |
| `actionable-errors` | PASS | `paid-kit` | PASS |
| `checkout-redirect` | PASS | `license-return-storage` | PASS |
| `license-url-stripping` | PASS | `license-return-token-binding` | PASS |
| `license-privacy` | PASS | `website-license-storage-only` | PASS |
| `license-cache-day` | PASS | `license-unavailable-fallback` | PASS |
| `core-no-license` | PASS | `rust-msrv` | PASS |
| `revoked-license-lock` | PASS | `rollback-local-scope` | PASS |
| `build-artifacts` | PASS | `site-routing-headers` | PASS |
| `mit-license` | PASS |  |  |

The landing page, legal pages, and README were cross-checked against the
manifest. No unlisted product claim was found.

## Clean install, tests, build, and package

```text
npm ci                                      PASS: 23 packages; 0 vulnerabilities
npm audit --audit-level=high                PASS: 0 vulnerabilities
npm test                                    PASS: 9 Rust; 76 Playwright; 2 intentional skips
npm run typecheck                           PASS
cargo fmt --check                           PASS
cargo clippy --all-targets -- -D warnings   PASS
npm run build                               PASS
cargo package --allow-dirty                 PASS, including verification build
cargo +1.85.0 check --locked                PASS on declared MSRV
```

There is no separate JavaScript lint script. The exact production command
created `target/release/import-mapping-replay` and `dist/site`.

| Asset | Raw | Gzip from Vite | Budget |
| --- | ---: | ---: | ---: |
| JavaScript | 22,934 B | 7.33 kB | <= 200 KB |
| CSS | 13,100 B | 3.67 kB | <= 50 KB |
| Hero WebP | 185,892 B | n/a | <= 300 KB |

No third-party font or runtime script is loaded.

## Packaged consumer and CLI workflow

`cargo package` produced and verified version 0.1.0. The `.crate` was extracted
into a new temporary consumer and installed with `cargo install --path ...
--root ... --locked`. Only that installed executable was used below.

| Case | Result |
| --- | --- |
| `--help` / `--version` | PASS: lists `run` and `demo`; reports 0.1.0. |
| `demo --json` | PASS: exit 0, five rows, three errors, unique temp directory, four paths. |
| Valid three-row replay | PASS: exit 0, valid result, four non-empty artifacts. |
| Valid replay twice | PASS: all four artifacts are byte-identical. |
| Validation-error replay | PASS: exit 2, three errors, four review artifacts. |
| `--sample 0` boundary | PASS: valid result and zero evidence samples. |
| Missing source | PASS: exit 1, actionable JSON, no output directory. |
| Invalid source then fixed rerun | PASS: same output recovers from exit 2 to valid with zero issues. |
| Malformed domain boundaries | PASS: `a@.com`, `a@example.`, and `a@b..com` each produce an email issue; exit 2. |

The broader claim suite also covers duplicate headers, missing mapped columns,
source/mapping output collisions, malformed later rows, prior-output atomicity,
40 concurrent demos, network denial, and rollback write boundaries.

## Prior blockers retested

The verification-12 failures are resolved:

1. **Returned-license token binding:** with an old valid verdict and a new
   invalid token, production made one verification request for the new token
   and kept the kit locked. With an old invalid verdict and a new valid token,
   it made one request for the new token and unlocked. In each case the new
   token replaced the old token in both storage records.
2. **Email domain validation:** the installed package rejected leading,
   trailing, and repeated domain dots as three separate issues while retaining
   the supported address.
3. **Stable image caching:** both stable WebP URLs now use
   `public, max-age=0, must-revalidate`; hashed JS and CSS remain one-year
   immutable.

## Live deployment identity, routing, and links

Built and live bytes match exactly:

| Resource | SHA-256 |
| --- | --- |
| `/` | `b5ebb548c988bc0c64f57fdc3fc1b7d40c151ff5e5ecde02fb3d553bfe83be59` |
| `/demo` | `3b18df043ee7d646df745bd78e5734dbf185a02ad527af41bd9135e7de0ca065` |
| `/privacy` | `7a7efadb0159f4a7378f3757252fbf328738f9fdf5e4dd6b88b92f5c24280d12` |
| `/terms` | `1a128a990a7e9b1d0cacb79ec840ef44131587126c20208b0b0ffcc6924f8595` |
| `/404` body | `416cc8a043d51b0a87a4c0fe7419bf484074f2ae95ed37522f340479462a0c83` |
| `main-CMkI4RUt.js` | `d2c6287d548168733349f187a1f8239c4b3bb7f185ed28d69246c135b73e7126` |
| `main-CP8GCJAy.css` | `a62a32c367b4566de19f9e66091f7b83d9fba9141c866c380f26492f78ea0604` |
| `replay-poster.webp` | `3e534cbab9801eccb9c342452c4cee7d25c48cc4ae64a0d9274e3b82e3307a95` |
| `og-replay.webp` | `10e51eb88670f6d724309e703681f56c8a03c9c93e12a47e6b0e2e29e02a6189` |

The favicon, Apple icon, robots file, and sitemap also match. Home, demo,
privacy, and terms return 200. `/404` and an unknown GET return the designed
404 with HTTP 404. All gathered links resolve as intended; checkout returns
303 to `checkout.dodopayments.com`, and `sociobot.in` returns 200.

## Privacy, headers, caching, and request allowance

The complete cold landing-to-demo flow requested only the document, candidate
JS/CSS, and the same-origin hero image. It left localStorage and sessionStorage
empty. The deeper demo test retained byte-identical real-license sentinels,
canceled an in-flight real-license request on demo entry, and had no active
cross-origin request after entry.

A separate real invalid-license return:

- removed the token from the visible URL while preserving `ref` and the hash;
- stored only `sb_license:import-mapping-replay` and
  `sb_license_verdict:import-mapping-replay`;
- sent the token to the exact Sociobot verification URL;
- received a `Cache-Control: no-store` invalid verdict; and
- left cookies, sessionStorage, IndexedDB, Cache Storage, and service-worker
  registrations empty.

Live documents send CSP with `frame-ancestors 'none'`, HSTS, `nosniff`,
strict-origin referrer policy, and restrictive camera, microphone, and
geolocation permissions. HTML revalidates after 30 seconds. Stable WebPs
always revalidate. Hashed JS/CSS are one-year immutable; an ETag conditional
request for JS returned 304.

The Sociobot verification endpoint allows **30 immediate successful requests
per client** in the observed window. Request 31 returned **429** with
`Retry-After: 4`; a request after five seconds returned 200. CORS allowed the
product origin.

## Accessibility, responsive behavior, and performance

- `/opt/fleet/lib/verify-url.sh` passed production: HTTP 200, 624 ms load,
  title, `lang=en`, one h1, main, image alt text, named buttons, and no console
  or page error.
- The live audit covered home, demo, privacy, terms, explicit 404, and an
  unknown route at 1440 x 900 and 390 x 844. All 12 Axe scans had zero
  violations; there was no horizontal overflow or console/page error.
- Every visible mobile link, button, and input measured at least 44 x 44 CSS
  pixels.
- Keyboard Tab reveals the skip link at `(8, 8)` with a 3 px outline; Enter
  focuses `main`. Keyboard activation opens the demo, and Space applies the
  sample correction. No trap was found.
- Reduced motion matched. Animations and transitions were reduced to 0.01 ms
  with one iteration.
- Lighthouse 12.8.2 mobile: **99 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO**. FCP 0.9 s, LCP 1.9 s, TBT 90 ms, CLS 0, Speed Index
  1.3 s, total transfer 194 KiB.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: the explicit `/404` route returns 404 to GET but 200 to HEAD. An
  arbitrary unknown path returns 404 to both methods, so normal navigation and
  not-found crawling are correct. This is a Static Web Apps route-method quirk,
  not a release blocker.

## Applicability and product review

This is a static documentation/demo site plus a local CLI. It has no product
backend, sign-in, service worker, or installable PWA. Backend health,
persistence, Entra authority, and PWA update/offline-reload checks do not
apply. The 40-way CLI demo claim covers relevant concurrent temp-directory
isolation.

The deterministic mapping job does not benefit from runtime AI. Connectors,
scheduled ETL, warehouse modeling, cloud storage, and third-party imports stay
correctly out of scope. The product clearly limits the rollback manifest to
the local transform and does not claim to undo an external import.
