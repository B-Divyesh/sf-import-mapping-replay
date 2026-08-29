# Independent verification 5 — FAIL

Verified on 29 August 2026 against candidate commit
`8b70b0eb04d05939f3ade051095d0aecdec652e4` and
<https://import-mapping-replay.sociobot.in>.

## Verdict: FAIL

The deployed site is the candidate, the first-read/demo gates pass, and all 21
declared claim commands pass after a clean `npm ci`. The release nevertheless
fails the real CLI job because a valid argument combination silently overwrites
the customer's source CSV and exits successfully. A malformed CSV can also
leave a plausible partial `output.csv` behind. These are unsafe failure modes
for an import-preparation tool.

## Release-blocking findings

### Critical — source/output path collision destroys the source CSV

The site and README promise that a replay does not change the source CSV. The
CLI does not reject an input file whose path is the generated output path.

Safe reproduction in a temporary directory:

```sh
qa=$(mktemp -d)
cp examples/valid-customers.csv "$qa/output.csv"
cp examples/mapping.json "$qa/mapping.json"
sha256sum "$qa/output.csv"
target/release/import-mapping-replay run \
  --source "$qa/output.csv" \
  --mapping "$qa/mapping.json" \
  --out-dir "$qa" --json
sha256sum "$qa/output.csv"
```

Observed:

- command exit: `0`, status `valid`, 3 rows, 0 validation errors;
- original source SHA-256:
  `1095cf51486f95d97eb60f335b4c12c653dc57c660a59cd4f2b2427c8b4c330b`;
- source after replay SHA-256:
  `5e93978ad9925953d46901af59e498256eccefb8d977b4a0b70ad3f4c1f2124b`;
- the source was replaced with the mapped columns
  `external_id,email,start_date,plan`.

The existing `@claim:source-unchanged` test hashes only the shipped source in a
separate output directory, so it misses this boundary. Before release, resolve
all input and output paths and reject collisions. Staging all artifacts in a
separate temporary directory before atomic replacement would also protect the
source.

### High — malformed CSV leaves a usable-looking partial output

With one valid row followed by a row having too few fields, the CLI exits `1`
and correctly reports `source CSV row 3 is malformed`. It nevertheless leaves
`output.csv` in the chosen output directory. The file contains the mapped
header and the first transformed row (70 bytes), while the evidence,
validation, and rollback files are absent. An implementation engineer can
mistake this stale partial file for the upload artifact.

Write to a temporary staging location and publish all four artifacts only
after the complete source has parsed and every artifact has been written.
Clean or preserve the previous complete replay on failure.

### High — paid checkout/return claims are not registered as claims

The live privacy and terms pages say “Checkout opens on Dodo” and “This website
handles the license after checkout.” `.factory/claims.json` has no claim entry
for the checkout return flow. The `paid-kit` test incidentally checks the Dodo
redirect, but no exactly tagged claim test sends `?license=...`, asserts the
token is stored, and asserts that the token is removed from the address bar.

The live behavior worked in this audit: an invalid return token was stored,
the URL was stripped to `/`, the Sociobot verification endpoint was called,
and the kit stayed locked. The claims contract still requires the advertised
behavior to be listed and tested on every build.

### High — required merchant/refund terms are absent

The paid-unlock contract requires the purchase copy or legal pages to state
that Sociobot/Dodo is the merchant of record and that refunds are handled
there. The landing, privacy, and terms pages say only that checkout opens on
Dodo. This must be present before accepting payments.

## First-read and one-click demo gate: PASS

A fresh 1365×768 browser opened the live root with no stored state.

- What it does: **“Replay CSV imports before upload.”**
- For whom: **“For implementation engineers who need a reviewed output CSV
  and error report before each customer upload.”**
- What to click first: **“Try it with sample data,”** beside “See a finished
  replay and three caught errors.”

The link opened `/demo` in one click. The first mobile view showed a mapped
email, the complete row-5 validation issue, and the persistent “Demo — sample
data, nothing is saved” banner with Reset demo and Start for real. Fixing the
sample reduced the error count from 3 to 2; keyboard-activating Reset restored
3 and moved focus to the replay result heading.

## Declared claims after clean install

`npm ci` installed 23 packages, reported zero vulnerabilities, and was followed
by every exact command in `.factory/claims.json`. All passed. The combined log
for this disposable worker is
`/tmp/import-mapping-replay-claim-tests-installed.log`.

| Claim | Result |
| --- | --- |
| `demo-errors` | PASS |
| `demo-row-count` | PASS |
| `recorded-cli-sample` | PASS |
| `review-files` | PASS |
| `demo-private` | PASS |
| `cli-offline` | PASS |
| `cli-local-only` | PASS |
| `demo-temp` | PASS |
| `cli-replay` | PASS |
| `mapping-v1` | PASS |
| `source-unchanged` | PASS, but inadequate collision coverage; see Critical finding |
| `json-output` | PASS |
| `actionable-errors` | PASS |
| `paid-kit` | PASS |
| `license-privacy` | PASS |
| `website-license-storage-only` | PASS |
| `license-cache-day` | PASS |
| `core-no-license` | PASS |
| `rust-msrv` | PASS |
| `revoked-license-lock` | PASS |
| `rollback-local-scope` | PASS |

A preliminary invocation before installing local dev dependencies reached
Playwright and failed to resolve `@playwright/test`; it was not treated as an
installed-checkout product result. The clean-checkout acceptance run above was
performed immediately after `npm ci`.

## Local quality and package gates

The following passed:

```sh
npm test
npm run typecheck
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
```

`npm test` passed 3 Rust unit tests and 47 Playwright cases, with one intentional
desktop-only check skipped in the mobile project. No separate lint script is
declared; strict Clippy was used for Rust. The release build produced
`dist/site` and the packaged crate verified successfully.

The crate was installed from
`target/package/import-mapping-replay-0.1.0` into a fresh temporary Cargo root.
The installed CLI supplied useful `--help` and `--version`; `demo --json`
reported 5 rows and 3 validation errors. A valid replay with `--sample 0`
reported 3 rows, 0 errors, wrote all four artifacts, emitted no evidence sample
fields, and preserved its normally named source. A headers-only CSV produced a
valid zero-row replay. Missing source and version-2 mapping errors exited `1`
with a next step. Rerunning valid input over the malformed-run directory
recovered to a complete four-file result.

## Deployment identity, browser, and privacy

The live deployment byte-matches the candidate production build:

| Asset | SHA-256 |
| --- | --- |
| `index.html` | `5fb8fe2a4d0bae078c0cfee820b9899d63f3f14ba607b4d426098cdd0854ad31` |
| `demo.html` | `5292977491a8cbf81936c86890489b75b63ba043da2059dd6f1647ff569a8959` |
| `privacy.html` | `f095b5880e1859922c12ff2042af34cd995d0623f206658dd339ad87ef5a025e` |
| `terms.html` | `29dfa3805b7e88560e81d978fb4d20917e5e69ab29eea3d3c6e628b4fcac571c` |
| `404.html` | `519c07bb705912588f5b8ebb8e2e1495a1734f165bd054656df5c54517ae8a9c` |
| `assets/main-CL23Jumh.js` | `5e17799bffbfbd010fbe9c1bd7287254b8fed89af7b15a3f7c0cee3bed011ea9` |
| `assets/main-l53q5lpH.css` | `81fe0b14e446ef50e4e764044f61cbf19c0f205534f758d209445ac1c9851bce` |
| `assets/replay-poster.webp` | `3e534cbab9801eccb9c342452c4cee7d25c48cc4ae64a0d9274e3b82e3307a95` |
| `assets/og-replay.webp` | `10e51eb88670f6d724309e703681f56c8a03c9c93e12a47e6b0e2e29e02a6189` |

Fresh Playwright contexts checked `/`, `/demo`, `/privacy`, `/terms`, and an
unknown route at 1440×900 and 390×844. Each rendered route had `lang=en`, one
`h1`, one `main`, ordered headings, no horizontal overflow, no missing image
alt text, and zero Axe serious/critical findings. Every visible mobile control
was at least 44×44 CSS pixels. Normal routes had no console or page errors; the
unknown route produced only Chromium's expected failed-resource message for
its deliberate HTTP 404.

Keyboard Tab exposed a 3px red skip-link focus ring (5.02:1 against the paper)
and Enter focused `main`. Demo controls worked with Enter. At 200% root text
size the 390px view had no horizontal overflow. Reduced-motion mode reduced
animations and transitions to `0.01ms`. The single-mode palette is explicitly
documented; measured text/focus contrasts were at least 4.54:1 for text and
5.02:1 for focus.

A direct fresh `/demo` session made only three same-origin requests and left
localStorage, sessionStorage, cookies, IndexedDB, and CacheStorage empty. A
direct seeded demo preserved the real-license sentinel but did not read,
verify, or change it. The returned-license path contacted only the documented
Sociobot endpoint after same-origin assets.

Live headers include a self-restricted CSP with only the Sociobot API in
`connect-src`, HSTS, `nosniff`, strict-origin referrer policy, and a restrictive
permissions policy. HTML revalidates after 30 seconds; hashed assets use
one-year immutable caching. All links from the live root returned 200 or the
intended checkout redirect.

## Performance and endpoint checks

The production bundle is far inside budget:

- JS: 20,838 bytes raw / 6,770 bytes gzip;
- CSS: 12,910 bytes raw / 3,646 bytes gzip;
- hero image: 185,892 bytes;
- Lighthouse total transferred size: 194 KiB.

Lighthouse 12.8.2 mobile results were performance 99, accessibility 100, best
practices 100, and SEO 100. LCP was 1.9s, CLS 0, and total blocking time 100ms.
Lab INP was not available because Lighthouse did not generate an interaction.

Fresh checkout `GET` and `HEAD` requests returned HTTP 303 to
`checkout.dodopayments.com`, so the previously reported deployment-only
checkout failure is not present.

The only server endpoint used by the product is the Sociobot license service.
A fresh 45-request concurrent burst from one client returned 30 HTTP 200
responses followed by 15 HTTP 429 responses. All 429 responses supplied
`Retry-After: 3`. Observed allowance: **30 requests per burst window**.

This is not a PWA, does not require sign-in, and has no product-owned backend;
service-worker update, Entra authority, product persistence, and backend
concurrency checks are not applicable. No missed AI feature was found: the
brief calls for deterministic, local, reviewable transforms, for which a model
would weaken reproducibility and privacy.

## Required next steps

1. Refuse canonical input/mapping paths that collide with any output artifact.
2. Stage and atomically publish all four artifacts; never leave partial output
   after a failed parse or transform.
3. Add exact claims and tagged tests for checkout redirect and license-return
   storage/URL stripping.
4. Add the merchant-of-record and refund statements required by the paid
   unlock contract.
5. Rerun every claim, the packed-consumer collision/malformed cases, and this
   live verification after redeployment.
