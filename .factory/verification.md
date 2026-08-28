# Independent verification — FAIL

Verified on 28 August 2026 against candidate commit
`165daaf06a7c3699e60d94af8fbdc1231ec1f1d9` and
https://import-mapping-replay.sociobot.in.

## Verdict

**FAIL — release blocked.** The required test command and seven declared claim
commands fail from a clean clone. `package.json` runs `cargo test && playwright
test`, but the Playwright CLI claim tests execute
`target/debug/import-mapping-replay`; `cargo test` does not create that binary.
The resulting error is `spawnSync /work/repo/target/debug/import-mapping-replay
ENOENT`.

This is a test/release-gate defect, not a live-deployment mismatch: a fresh
production build and the deployed static files match byte-for-byte.

## Cold first read

Pass. On a cold desktop and 390 px mobile visit, the first screen says
“Replay CSV mappings with proof”; identifies implementation engineers preparing
customer imports; and offers the single-click **Try it with sample data** action
with the immediate result (“See a finished replay and three caught errors”).
The action opens `/demo`, which shows the sample data and persistent demo banner.

## Required claim commands from the clean clone

`npm ci` completed successfully. Every exact `test` command in
`.factory/claims.json` was then run before any explicit `cargo build`.

| Claim id | Result | Fresh-run evidence |
| --- | --- | --- |
| `demo-errors` | PASS | 2 Playwright projects passed. |
| `review-files` | PASS | 2 Playwright projects passed. |
| `demo-private` | PASS | 2 Playwright projects passed. |
| `cli-offline` | FAIL | Both projects: expected executable is absent (`ENOENT`). |
| `demo-temp` | FAIL | Same shared test, `ENOENT`. |
| `cli-replay` | FAIL | Both projects: expected executable is absent (`ENOENT`). |
| `mapping-v1` | FAIL | Same shared test, `ENOENT`. |
| `source-unchanged` | FAIL | Same shared test, `ENOENT`. |
| `json-output` | FAIL | Same shared test, `ENOENT`. |
| `actionable-errors` | FAIL | Both projects receive `status: null`, not required exit 1, because the executable is absent. |
| `paid-kit` | PASS | Recorded verification response unlocked and downloaded the kit in both projects. |
| `license-privacy` | PASS | Verification URL and browser-only storage assertions passed in both projects. |

The clean `npm test` result was **12 passed, 6 failed** Playwright project
instances (the three CLI-oriented shared tests fail in Chromium and mobile),
after all three Rust unit tests passed. Once an out-of-band `cargo build` had
created the debug executable, the same `npm test` passed all **18/18** tests.
That later pass does not satisfy the clean-clone acceptance gate.

## Product and package exercise

- `npm run build`: passed; release binary and `dist/site` were produced.
- `cargo test`: passed (3 tests); `cargo fmt -- --check`: passed; `cargo clippy
  --all-targets -- -D warnings`: passed.
- `cargo package --allow-dirty`: passed and verified the 0.1.0 crate.
- The packaged crate was extracted into a fresh temporary consumer, installed
  with `cargo install --path ... --root ...`, and its public `--version` and
  `demo --json` commands worked. Demo reported 5 rows, 3 validation errors,
  and all four review-artifact paths.
- The release binary transformed `examples/valid-customers.csv` into the
  expected ordered CSV and all four artifacts. The invalid bundled sample
  exited 2 with `review_required` and three errors. A missing source path
  exited 1 with an actionable “check the path” message. `--sample 0` retained
  row counts while producing an empty evidence field list.

## Live deployment, privacy, security, and UI checks

- Deployment is the candidate: SHA-256 values matched for `index.html`, JS,
  CSS, hero WebP, and Open Graph WebP between `dist/site` and the live URL.
- Cold desktop and 390 px mobile pages rendered without console or page errors.
  The one-click demo works. The live demo made only same-origin requests and
  left localStorage and cookies empty.
- Local Playwright axe checks passed with no serious or critical issues for
  `/`, `/demo`, `/privacy`, `/terms`, and an unknown route. Live root axe also
  reported zero serious/critical findings. `<title>`, `lang`, one `<h1>`, and
  one `<main>` were present on each route checked.
- Reduced motion sets transition and animation duration to `0.01ms`; 390 px
  layout had no horizontal overflow. The primary keyboard focus ring is visible.
- Live headers include CSP, `X-Content-Type-Options: nosniff`, strict referrer
  policy, HSTS, and restrictive permissions policy. Hashed assets have
  `Cache-Control: public, max-age=31536000, immutable`; HTML has short
  revalidation caching. `/`, `/demo`, `/privacy`, `/terms`, and the unknown
  route returned the expected SPA document; `robots.txt` and `sitemap.xml`
  returned 200.
- The static initial bundle is 5,946 bytes gzip JS and 3,197 bytes gzip CSS;
  the hero is 185,892 bytes. All are within the stated budgets. Lighthouse
  could not run in this container because its launcher rejects the preinstalled
  Playwright-only Chromium as an installed stable Chrome; no score is claimed.
- There is no `verify-url.sh` in this repository. Equivalent live title/lang/
  main/alt/console checks were performed directly.
- Rate-limit test: 40 concurrent invalid-license GETs to
  `https://api.sociobot.in/api/v1/products/import-mapping-replay/verify` yielded
  30 HTTP 200 responses, then 10 HTTP 429 responses with `Retry-After: 3`.

## Defects

### Critical — clean claim and quality gate failure

`npm test` is documented as the clean verification command but does not build
the debug CLI executable required by its own Playwright tests. This fails seven
claims (`cli-offline`, `demo-temp`, `cli-replay`, `mapping-v1`,
`source-unchanged`, `json-output`, and `actionable-errors`) and fails the full
test gate from a clean checkout. Make the test script build the debug binary
before invoking Playwright, then re-run every exact claim command from a clean
clone.

### Medium — initial keyboard focus bypasses skip link and header navigation

On first load, client rendering programmatically focuses `#page-title`. A
forward Tab starts at **Try it with sample data**, bypassing the document-order
skip link and header navigation; they are reachable only with reverse Tab. This
does not meet the stated keyboard/skip-link expectation. Reserve h1 focus for
client-side route changes, or otherwise preserve the normal first-tab path.

## Known non-blocking notes

- The product is a static CLI landing page, not a PWA or backend; service-worker
  update/offline reload and persistence/concurrency probes do not apply.
- No sign-in flow exists. The optional paid kit uses only the Sociobot endpoint;
  no third-party authentication provider was observed.
