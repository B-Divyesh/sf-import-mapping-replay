# Independent verification 9 — PASS

Verified on 29 August 2026 for work order
`import-mapping-replay-verify-9`.

- Candidate: `1ea1bc3a9606059927140582a12d9bd22387dcf5`
- Branch: `main`
- Live URL: <https://import-mapping-replay.sociobot.in>
- Acceptance sources: `.factory/brief.json`, the supplied researched brief,
  `.factory/design.md`, and the attached factory skills
- Product source changes during verification: none

## Verdict: PASS

The candidate completes the brief's smallest useful job. The local CLI replays
a versioned CSV mapping, produces a deterministic output CSV, field evidence,
validation findings, and a source-row rollback manifest. It provides useful
error exits and preserves prior complete artifacts on a failed rerun. Its copy
does not imply that the manifest can undo records already imported elsewhere.

The live deployment is byte-identical to the candidate build. All required
claims, local gates, package-consumer checks, browser checks, accessibility
checks, privacy checks, and performance budgets pass. The earlier reported
deployment-only checkout failure does not reproduce.

## Release gates

### Claims manifest

PASS. `.factory/claims.json` exists with 28 entries. After the clean install,
every exact `test` command in the file was run independently. Result: **28/28
passed, 0 failed**. The test source contains exactly 28 claim tags, with one
occurrence for every registered claim id and no missing or duplicate ids.

| Claim id | Result | Observable evidence asserted by the tagged test |
| --- | --- | --- |
| `demo-errors` | PASS | Bundled demo reports three source errors. |
| `demo-row-count` | PASS | Demo processes five rows and writes five output records. |
| `recorded-cli-sample` | PASS | Landing recording matches the bundled CLI counts and filenames. |
| `review-files` | PASS | All four named output/review files are present. |
| `demo-private` | PASS | Demo storage is empty and all requests are same-origin. |
| `cli-offline` | PASS | CLI demo succeeds with network proxies pointed at a closed port. |
| `cli-local-only` | PASS | The replay makes no connect, send, or DNS call under the network guard. |
| `demo-temp` | PASS | Forty concurrent demos use distinct temporary directories and complete artifacts. |
| `cli-replay` | PASS | Replay transforms CSV rows and writes deterministic evidence and rollback data. |
| `mapping-v1` | PASS | Defaults, trim, case, replace, date, and validation behavior are applied. |
| `source-unchanged` | PASS | Input/output collisions exit 1 without changing either input. |
| `atomic-artifacts` | PASS | A malformed later row publishes nothing and preserves an earlier complete run. |
| `json-output` | PASS | `--json` returns parseable status, row, and validation counts. |
| `actionable-errors` | PASS | Invalid input exits non-zero and names the next check. |
| `paid-kit` | PASS | A recorded valid license exposes five recipes and the two required approval fields. |
| `checkout-redirect` | PASS | Fresh GET and HEAD requests return 303 to Dodo Payments checkout. |
| `license-return-storage` | PASS | A returned token is stored before verification. |
| `license-url-stripping` | PASS | The license parameter is removed while other query/hash parts remain. |
| `license-privacy` | PASS | The token is stored locally and sent only to Sociobot verification. |
| `website-license-storage-only` | PASS | Only the license and verdict keys exist; other browser stores remain empty. |
| `license-cache-day` | PASS | A fresh verdict is not rechecked within 24 hours and is rechecked after expiry. |
| `core-no-license` | PASS | A normal replay completes without an account or license. |
| `rust-msrv` | PASS | Cargo metadata declares Rust 1.85. |
| `revoked-license-lock` | PASS | A recorded revoked verdict hides the team kit. |
| `rollback-local-scope` | PASS | Writes stay in the output directory and source/outside files remain unchanged. |
| `build-artifacts` | PASS | The isolated production build creates the release CLI and complete `dist/site`. |
| `site-routing-headers` | PASS | The SWA emulator serves routes, a real 404, and the named security headers. |
| `mit-license` | PASS | Cargo metadata and the complete license text are MIT. |

The landing page, legal routes, copy audit, and README were cross-checked
against the registry. Their outcome, privacy, storage, price, licensing,
mapping, and safety statements are represented by the claims above. No
unlisted reliability claim was found.

### First-read and one-click demo

PASS. A new 1440 x 900 browser context opened production with no stored state.
The first viewport answered all three required questions in plain words:

- What: **“Replay CSV imports before upload.”**
- For whom: **“For implementation engineers who need a reviewed output CSV
  and error report before each customer upload.”**
- What to click: **“Try it with sample data”**, beside **“See a finished
  replay and three caught errors.”**

Exactly one action with that name is present. One click opens `/demo`, titled
“Demo — Import Mapping Replay,” with five realistic customer rows, a mapped
email before/after, three validation errors, and all four review filenames.
The persistent banner says “Demo — sample data, nothing is saved” and provides
Reset demo and Start for real. `/?demo=1` enters the same isolated demo.

Keyboard activation of **Fix the sample email** removes the row-5 email issue,
changes the table from three errors to two, focuses the live status, and
announces “Row 5 corrected. Two validation errors remain.” Reset restores all
three issues and focuses the result heading.

## Clean checkout and production build

The repository started clean at the exact candidate. `origin/main` also
resolved to that commit. The declared install completed with 23 npm packages,
zero audit vulnerabilities.

```text
npm ci                                      PASS
npm test                                    PASS: 7 Rust; 64 Playwright; 2 intentional project skips
npm run typecheck                           PASS
cargo fmt -- --check                        PASS
cargo clippy --all-targets -- -D warnings   PASS
npm run build                               PASS
cargo package                               PASS, including Cargo's package verification build
```

There is no separate lint script. The exact production build created the
optimized binary and the complete `dist/site` static site.

## Package and CLI consumer verification

`cargo package` produced a verified 0.1.0 crate with 59 files (707.7 KiB,
429.8 KiB compressed). It was unpacked into a fresh temporary consumer and
installed with `cargo install --path`; the installed public executable then
provided useful `--help` and `--version`. The public Git install command was
also exercised against the exact candidate revision and installed version
0.1.0 successfully.

Independent installed-binary cases:

| Case | Result |
| --- | --- |
| `demo --json` | Exit 0; five rows, three errors, unique temporary directory, four paths. |
| Valid three-row replay | Exit 0; valid JSON result and four non-empty artifacts. |
| Same input in two output directories | Byte-identical artifact directories. |
| `--sample 0` | Exit 0; zero evidence samples without losing output rows. |
| Deliberately invalid five-row sample | Exit 2; three findings and all four review artifacts. |
| Header-only CSV | Exit 0; valid zero-row output and four artifacts. |
| Missing source | Exit 1; names the missing path and says to check it. |
| Mapping version 2 | Exit 1; says version 1 is required. |
| Output artifact already a directory | Exit 1; preserves the directory and publishes no other artifact. |
| Review-required run followed by corrected run | Exit changes 2 to 0; same output directory becomes valid with three rows. |

The rollback manifest explicitly says it cannot undo records already imported
into another product. The LD_PRELOAD claim test independently rejected and
recorded connect/send/DNS calls; none occurred.

## Live deployment identity and routing

The candidate build and production bytes match:

| Resource | SHA-256 |
| --- | --- |
| `/` | `25bf14edcc9d011b6dcc72d605a5aba169909c9e3d919ef495b9288493d9f5ea` |
| `/demo` | `f284f56a888026910ec169b7c8597ef940fce9be65a20cd8a6d9bda42505d49f` |
| `/privacy` | `bbfa06e35827aa605fdd9f0d7fec369e7bac013099665d2d918537a82b47d376` |
| `/terms` | `5c28fca3f40ed4050328d9e8d5caa1dee830fef353827ea33f277e75224e44c4` |
| `/404` | `e7e06d3094a3a581d60452704ddce83fb53bbcdf4e87ac8c85ee4dbcb8774597` |
| `main-SvAbbRFQ.js` | `ef7360ca0d8a7e470decd16febd9c34531aedb5d932d50e2ab4f6311f4873915` |
| `main-CP8GCJAy.css` | `a62a32c367b4566de19f9e66091f7b83d9fba9141c866c380f26492f78ea0604` |
| `replay-poster.webp` | `3e534cbab9801eccb9c342452c4cee7d25c48cc4ae64a0d9274e3b82e3307a95` |
| `og-replay.webp` | `10e51eb88670f6d724309e703681f56c8a03c9c93e12a47e6b0e2e29e02a6189` |

The favicon, Apple icon, robots file, and sitemap also match byte-for-byte.
Home, demo, privacy, and terms return 200. `/404` and a random unknown path
return the designed 404 document with HTTP 404. All 13 distinct links found
across the site resolve as intended; the only 404 link is the 404 page's own
skip fragment. The checkout link returns 303 to
`checkout.dodopayments.com`; the external factory link returns 200.

Client navigation updates titles and focuses the new h1. Back navigation
restored a recorded landing scroll position from 2500 to 2500 and focused the
landing h1.

## Privacy, headers, caching, and server allowance

The complete live demo load, correction, and reset request log contained only:

```text
GET /demo
GET /assets/main-SvAbbRFQ.js
GET /assets/main-CP8GCJAy.css
```

All were same-origin. Afterwards localStorage, sessionStorage, cookies,
IndexedDB, and Cache Storage were empty. There are no analytics, telemetry,
third-party fonts/scripts, runtime AI calls, or embedded provider keys.

A separate live invalid-license return proved the paid flow without exposing a
real credential. The site changed
`/?license=qa9-invalid-license&ref=qa9#team-kit` to
`/?ref=qa9#team-kit`, stored only
`sb_license:import-mapping-replay` and
`sb_license_verdict:import-mapping-replay`, and sent the token only to the
documented Sociobot verification URL. The API returned 200, CORS for the
product origin, and `Cache-Control: no-store`; the page quietly reported the
inactive license.

The product verifier enforces a **30-request single-client allowance**.
Requests 1–30 in a fresh burst returned 200. Requests 31–33 returned 429; the
first 429 included `Retry-After: 4`.

Browser and curl response headers agree:

- HTML: `public, must-revalidate, max-age=30`.
- Hashed assets: `public, max-age=31536000, immutable`; an ETag revalidation
  returned 304.
- CSP: self-only resources, with only `https://api.sociobot.in` permitted for
  connections and forms; `frame-ancestors 'none'` is a response header.
- HSTS, `nosniff`, strict-origin referrer policy, and restrictive camera,
  microphone, and geolocation permissions are present.

This is a static site plus a local CLI. It has no product backend, account
login, service worker, or manifest, so backend persistence/health, Entra, and
PWA update/offline checks are not applicable. The CLI's offline claim was
tested separately and passed.

## Accessibility, responsive behavior, and performance

The factory `verify-url.sh` passed against live home, demo, privacy, and terms.
Each has a route-specific title, `lang=en`, one h1, one main landmark, image
alt text, labeled buttons, and no console/page errors.

Playwright Axe checked home, demo, privacy, terms, and the designed 404 at both
1440 x 900 and 390 x 844: **zero serious or critical findings in all ten
runs**. The only console entry in this matrix was Chromium's expected failed
document message for the intentionally requested HTTP 404; no application or
subresource error occurred on a normal route.

- No route has horizontal overflow at either viewport.
- Every visible link, button, and input is at least 44 x 44 CSS px.
- Keyboard Tab reaches every control without a trap; every tested focus state
  has a 3 px designed outline. Focus contrast is 5.02:1 on paper and 8.91:1 on
  dark surfaces.
- Skip-link activation, one-click demo navigation, sample correction, reset,
  route focus, and Back restoration work with the keyboard.
- At 200% root text size on 390 px, there is no horizontal overflow and the
  primary demo action remains visible.
- With `prefers-reduced-motion: reduce`, the media query matches and no
  animation remains running.

Production bundle sizes:

| Asset | Raw | Gzip | Budget |
| --- | ---: | ---: | ---: |
| JavaScript | 22,283 B | 7,159 B | <= 200 KB |
| CSS | 13,100 B | 3,689 B | <= 50 KB |
| Hero WebP | 185,892 B | n/a | <= 300 KB |

Fresh Lighthouse 12.8.2 mobile results:

- Performance **99**; Accessibility **100**; Best Practices **100**; SEO
  **100**.
- FCP **1.0 s**; LCP **1.9 s**; TBT **70 ms**; CLS **0**; Speed Index
  **1.1 s**.
- Total transfer **198,895 bytes**.

## Product/design review

The transit-poster “Replay Line” identity in `.factory/design.md` is visibly
implemented: warm ticket paper, ink/red/brass tokens, compressed display type,
rails and numbered stops, an original locally hosted poster, square destination
plates, and a reduced-motion fallback. The first screen is asymmetric rather
than a generic centered SaaS hero. Asset provenance is recorded beside the
asset and in the design file.

An AI feature would not improve this deterministic, privacy-first replay job;
no missed AI leverage was found. Connectors, automatic third-party imports,
scheduling, and cloud storage remain correctly out of scope.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Known gaps

None within the acceptance contract. Publication to a package registry remains
a factory-owned release action and is not advertised as complete.
