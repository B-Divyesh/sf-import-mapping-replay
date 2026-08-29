# Independent verification 11 — FAIL

Verified 29 August 2026 against candidate commit
`1d3feba15debafa39a00314ebd08f23213d8489a` and the live deployment
<https://import-mapping-replay.sociobot.in>.

## Verdict

**FAIL.** The candidate and live site pass the declared claims, build,
deployment, accessibility, privacy, and performance gates. The installed CLI
nevertheless has one release-blocking data-integrity defect: duplicate CSV
headers are silently accepted, the last duplicate value is mapped, and the
rollback manifest loses the earlier value. A second defect makes `--json`
non-machine-readable on invalid input.

The deployment-only concern mentioned in the work order was not reproduced.
The live HTML, JavaScript, CSS, images, icons, and metadata assets byte-match
the candidate production build.

## Cold first read and demo gate

Opened `/` cold in fresh 1440 × 900 and 390 × 844 browser contexts.

- What it does: **“Replay CSV imports before upload.”**
- For whom: implementation engineers who need reviewed output and an error
  report before customer uploads.
- What to do first: **Try it with sample data**, with the next result stated
  beside it.
- The action is visible without scrolling at both sizes. At 390 px, all three
  product facts also fit in the 844 px first viewport.
- One keyboard-activated click opens `/?demo=1`, shows the persistent
  **Demo — sample data, nothing is saved** banner, and immediately presents a
  five-row replay, one before/after value, three validation errors, and four
  review filenames. Reset restores the three-error state.

Result: **PASS** for the mandatory first-read and one-click demo gate.

## Mandatory claims

Ran `npm ci` from the clean candidate checkout (23 packages, zero reported
vulnerabilities), then ran every exact `test` command in
`.factory/claims.json` independently. All 29 commands exited 0. The
`build-artifacts` selection had one applicable pass and one intentional
browser-project skip; every other selection passed in both configured browser
projects.

| Claim | Result | Claim | Result |
| --- | --- | --- | --- |
| demo-errors | PASS | demo-row-count | PASS |
| recorded-cli-sample | PASS | review-files | PASS |
| demo-private | PASS | cli-offline | PASS |
| cli-local-only | PASS | demo-temp | PASS |
| cli-replay | PASS | mapping-v1 | PASS |
| source-unchanged | PASS | atomic-artifacts | PASS |
| json-output | PASS | actionable-errors | PASS |
| paid-kit | PASS | checkout-redirect | PASS |
| license-return-storage | PASS | license-url-stripping | PASS |
| license-privacy | PASS | website-license-storage-only | PASS |
| license-cache-day | PASS | license-unavailable-fallback | PASS |
| core-no-license | PASS | rust-msrv | PASS |
| revoked-license-lock | PASS | rollback-local-scope | PASS |
| build-artifacts | PASS | site-routing-headers | PASS |
| mit-license | PASS |  |  |

The passing manifest does not cover duplicate source headers, and its JSON
claim covers successful command results rather than invalid-input results.
That gap allowed the defects below to pass the declared suite.

Evidence: `.factory/evidence/verification-11/claims.log`.

## Clean build, package, and CLI checks

- `npm test`: PASS — 7 Rust unit tests, 68 Playwright tests passed, 2
  intentional skips.
- `npm run typecheck`: PASS.
- `cargo fmt --check`: PASS.
- `cargo clippy --all-targets -- -D warnings`: PASS.
- `cargo package`: PASS and package verification compiled successfully.
- `npm run build`: PASS; it created `target/release/import-mapping-replay` and
  `dist/site`.
- Production JavaScript: 22.56 kB raw / 7.22 kB gzip. CSS: 13.10 kB raw /
  3.67 kB gzip. No font payload. Hero image: 185,892 bytes.
- Installed the staged crate from
  `target/package/import-mapping-replay-0.1.0` into an empty temporary Cargo
  root. `--help` exposed `run` and `demo`; `demo --json` returned five rows,
  three expected validation errors, and four non-empty review artifacts in a
  new temporary directory.
- Normal replay: exit 0, `status: valid`, 3 rows, 0 errors, and all four
  artifacts. Two independent runs were byte-identical. `--sample 0` produced
  zero evidence fields without affecting output.
- Review-required replay: exit 2, 5 rows, 3 errors, and complete review files.
- Missing source: exit 1 with “could not read source CSV …; check the path.” A
  corrected rerun to the same selected output directory then succeeded.
- Negative `--sample=-1`: exit 2 with a clear parser error and `--help` next
  step.

## Live deployment

- Candidate/live parity: all five route documents and every shipped public
  asset checked byte-for-byte equal to the local `npm run build` output.
  Examples: `index.html`
  `649e52a4441332e2e17f132f0d82a12e496f65856e4e51b5da4846fb92466de3`;
  JavaScript
  `617f10363620a026222f8d321556f1e46b9989a4ff91f5eb705f251a0ca2a474`.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/404` and a new
  unknown route returned the designed page with status 404.
- Every rendered link resolved. The buy link returned 303 to
  `checkout.dodopayments.com`; the external Param Factory link returned 200.
- HTML caching is `public, must-revalidate, max-age=30`. Hashed assets use
  `public, max-age=31536000, immutable`.
- Browser response headers include CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, `strict-origin-when-cross-origin`, and a restricted permissions
  policy.
- `/opt/fleet/lib/verify-url.sh` passed with one h1, `lang=en`, a main
  landmark, complete image alternatives, labeled controls, and no console
  errors.

## Privacy, limits, accessibility, and performance

- Direct demo flow requested only its same-origin document, JavaScript, and
  CSS. It left localStorage, sessionStorage, cookies, IndexedDB, and Cache
  Storage empty. There were no failed requests or console/page errors.
- A fresh invalid-license flow made exactly one cross-origin request, to the
  documented Sociobot verification endpoint. It stored only
  `sb_license:import-mapping-replay` and
  `sb_license_verdict:import-mapping-replay`; no cookies were set.
- The verification API allowed 30 immediate requests from one client; request
  31 returned 429 with `Retry-After: 4` and `X-RateLimit-After: 4`. A later
  probe recovered to 200 after waiting five seconds.
- Live Axe checks found zero violations on six routes at desktop and 390 px.
  There was no horizontal overflow and every visible mobile target was at
  least 44 × 44 CSS px.
- Keyboard-only smoke test: Tab exposed the skip link with a 3 px focus ring;
  Enter focused `main`; the next Tab reached the demo action; Enter routed and
  focused the new h1; Tab then Space applied the sample correction and moved
  focus to the result. Focus contrast measured 5.02:1 on the paper surface.
- Reduced-motion emulation matched the product's 0.01 ms override and left no
  visible sustained motion in the demo flow.
- Lighthouse mobile: Performance 98, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.9 s, CLS 0, TBT 130 ms, 194 KiB transfer. Browser
  Event Timing measured the tested demo interaction at 16 ms; click-to-visible
  result including automation overhead was 74 ms.
- This is a CLI with a static documentation/demo site: PWA offline-update,
  product-backend persistence/concurrency, and sign-in-provider checks are not
  applicable. The page has no service worker. AI would not improve the brief's
  deterministic mapping job, so no missed AI leverage was found.

Evidence is under ignored path `.factory/evidence/verification-11/`.

## Defects

### F-11-1 — High — duplicate CSV headers silently select and lose source data

Reproduction with the installed package:

```sh
printf 'A,A\nfirst,second\n' > duplicate.csv
printf '%s\n' '{"version":1,"fields":[{"target":"chosen","source":"A"}]}' > mapping.json
import-mapping-replay run --source duplicate.csv --mapping mapping.json --out-dir out --json
```

Actual: exit 0 and `status: valid`; `output.csv` has header `chosen` and row
value `second`. The rollback manifest records headers `["A","A"]` but its row
object is only `{"A":"second"}`. The first value is irretrievable from the
manifest.

Expected: reject ambiguous duplicate headers before transformation, exit
nonzero with an actionable message, and publish no artifacts. Silent selection
can upload the wrong customer value, while loss from the rollback manifest
breaks the documented source reconstruction and evidence guarantees.

Evidence: `.factory/evidence/verification-11/cli/duplicate.csv`, `output.csv`,
and `rollback-manifest.json`.

### F-11-2 — Medium — `--json` errors are not JSON

Reproduction:

```sh
import-mapping-replay run --source does-not-exist.csv \
  --mapping examples/mapping.json --out-dir out --json
```

Actual: exit 1, empty stdout, and a plain-text `Error:` message on stderr.
Expected: when `--json` is requested, emit a stable JSON error object suitable
for CI parsing while preserving the nonzero exit. This does not affect the
successful replay, but it contradicts the broad README statement that
`--json` provides machine-readable command output.
