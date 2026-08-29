# Independent verification 4 — PASS

Verified on 29 August 2026 against candidate commit
`2eff99f38d1907cdfaefe839d28b29bc8355e5ea` and
<https://import-mapping-replay.sociobot.in>.

## Verdict: PASS

The candidate satisfies the researched brief: it is a local CLI for
implementation engineers to replay versioned CSV mappings, produce a
transformed CSV plus field evidence, validation output, and a source-row
rollback manifest. It makes the important rollback boundary explicit: it does
not undo records already imported to another system.

The earlier deployment-only checkout failure is repaired. Fresh `GET` and
`HEAD` requests to
`https://api.sociobot.in/api/v1/products/import-mapping-replay/checkout`
returned `303` redirects to `checkout.dodopayments.com`.

## Cold first read and demo

Fresh live browser evidence at the top of the landing page says:

- What it does: **“Replay CSV mappings with proof.”**
- Who it is for: implementation engineers who need customer imports reviewed,
  rerun, and traced.
- What to click first: **“Try it with sample data”**, with the adjacent result
  “See a finished replay and three caught errors.”

The action opened `/demo` in one click. It showed the persistent
“Demo — sample data, nothing is saved” banner, Reset demo, Start for real,
three validation issues, and `output.csv`, `evidence.json`,
`validation.json`, and `rollback-manifest.json`.

## Required claims from the clean candidate

`npm ci` installed 23 packages with zero reported vulnerabilities. Every exact
test command listed in `.factory/claims.json` was run sequentially before the
rest of QA and passed:

| Claim | Result |
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
| `core-no-license` | PASS |
| `rust-msrv` | PASS |
| `revoked-license-lock` | PASS |

## Local product and package checks

These passed from the candidate checkout:

```sh
npm test
npm run typecheck
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
```

`npm test` covers 3 Rust unit tests and 24 Playwright tests. `npm run build`
created `dist/site`; the built static bundle is 18,238 bytes JS (5,994 gzip)
and 10,770 bytes CSS (3,200 gzip). The 185,892-byte poster is also within the
static-product budget.

The packaged crate was installed into a fresh temporary consumer using
`cargo install --path target/package/import-mapping-replay-0.1.0 --root <temp>`.
The installed public binary supplied useful `--help` and `--version`, and
`demo --json` produced 5 rows, 3 validation errors, and a new temporary demo
directory. A valid `run --sample 0 --json` produced all four files, zero
evidence rows, 3 valid source rows, and left the source SHA-256 unchanged.
Missing mapped columns exited 1 with an actionable header/mapping message;
an unsupported version-2 mapping also exited 1.

## Live deployment, privacy, and accessibility

The candidate production assets byte-match the deployment:

- `index.html`: `8d8bfb07afdad15b811261a03e5b7a29533188a4e2bcb2a521ad77d314c9352e`
- `assets/index-CUjKdFBw.js`: `08b524f2bfe042285652ac058cc6b25cbfb2bb3f68d3487c978bf61314399363`
- `assets/index-QRq1sAzB.css`: `b147779a7ce40c3436023206d6d0ce151e1709ca4386d514ebd9233c635f86ef`
- `assets/og-replay.webp`: `10e51eb88670f6d724309e703681f56c8a03c9c93e12a47e6b0e2e29e02a6189`
- `assets/replay-poster.webp`: `3e534cbab9801eccb9c342452c4cee7d25c48cc4ae64a0d9274e3b82e3307a95`

Fresh Playwright checks exercised `/`, `/demo`, `/privacy`, `/terms`, and an
unknown route at 1440×900 and 390×844. Every route had `lang=en`, exactly one
`h1` and `main`, zero horizontal overflow, no console/page errors, and zero
Axe serious/critical findings. The first desktop Tab reached the visible
3-pixel Skip-to-main focus ring. At reduced motion the route animation duration
was `0.00001s`. Screenshots were inspected for desktop and 390 px layouts.

In a fresh demo browser context, outgoing requests stayed same-origin; it left
localStorage and cookies empty. The optional returned-license flow stripped the
token from the URL, stored it under `sb_license:import-mapping-replay`, and its
only external request was the documented Sociobot verification URL. Live
headers include CSP restricted to self plus that endpoint, HSTS, `nosniff`,
strict-origin referrer policy, and a restrictive permissions policy. HTML uses
30-second revalidation; the hashed JS has one-year immutable caching.

There is no sign-in, PWA/service worker, product backend, or product-owned
server persistence, so tenant, service-worker update, offline-page reload, and
backend persistence/concurrency checks do not apply. `verify-url.sh` is not in
this checkout; equivalent live browser checks covered its requested title,
language, landmark, alt/control, and console conditions.

The documented server-side allowance is enforced. A fresh 40-request
single-client concurrent invalid-license burst returned 30 HTTP 200 responses
and 10 HTTP 429 responses; each 429 supplied `Retry-After: 4`. Observed
allowance: 30 requests per burst window.

## Defects by severity

No release-blocking defects found.

Non-blocking: Lighthouse was not installed in this clean checkout. Direct
browser accessibility, responsive, console, response-header, caching, and
bundle-budget checks passed.
