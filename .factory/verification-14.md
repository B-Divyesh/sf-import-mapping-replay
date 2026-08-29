# Independent verification 14 — PASS

Verified on 29 August 2026 against candidate commit
`964f1f29b3cda5eb1e761a52182d1684d11b3f41` and production
<https://import-mapping-replay.sociobot.in>.

## Verdict

**PASS.** The candidate fulfils the researched brief: its packaged local CLI
replays a versioned CSV mapping into deterministic output, field evidence,
validation findings, and a local rollback manifest. It neither connects to a
customer system nor claims to undo an already-uploaded record. The live static
site byte-matches the candidate build. No release-blocking defect was found.

The deployment-only issue mentioned in the work order was checked afresh and
did not reproduce.

## Cold first read and demo gate

Pass. In a fresh 1440 x 900 browser context, the first screen says **“Replay
CSV imports before upload”**, says it is **“For implementation engineers who
need a reviewed output CSV and error report before each customer upload,”**
and presents **“Try it with sample data.”** The three facts plainly say that
CSV files stay on the computer, the CLI runs without internet, and the core
CLI needs no license. One keyboard-activated click opens `/?demo=1`, showing
five sample rows, three source errors, a before/after mapping, all four output
files, and the persistent **“Demo — sample data, nothing is saved”** banner
with Reset demo and Start for real.

The same content is useful and free of horizontal overflow at 390 x 844.

## Required claims: 33/33 PASS

The checkout began clean at the candidate commit. After `npm ci`, every exact
command in `.factory/claims.json` was executed separately, before the general
test run. All exited zero; command logs are retained in
`/tmp/import-mapping-replay-claims/` for this verification.

| Claim ids verified |
| --- |
| `demo-errors`, `demo-row-count`, `recorded-cli-sample`, `review-files`, `demo-private` |
| `cli-offline`, `cli-local-only`, `demo-temp`, `cli-replay`, `mapping-v1`, `email-domain-validation` |
| `source-unchanged`, `atomic-artifacts`, `json-output`, `json-error-output`, `duplicate-source-headers`, `actionable-errors` |
| `paid-kit`, `checkout-redirect`, `license-return-storage`, `license-url-stripping`, `license-return-token-binding`, `license-privacy`, `website-license-storage-only`, `license-cache-day`, `license-unavailable-fallback`, `core-no-license`, `rust-msrv`, `revoked-license-lock` |
| `rollback-local-scope`, `build-artifacts`, `site-routing-headers`, `mit-license` |

This independently covers the five-row/three-error demo, four artifacts,
offline and network-denied operation, 40 concurrent temporary demos,
deterministic transforms, malformed-row atomicity, duplicate headers, JSON
errors, source/mapping collision safety, email boundaries, licence return and
outage behaviour, checkout, static routing, and MIT packaging.

## Local checks and CLI consumer exercise

All passed:

```text
npm ci
npm test                         9 Rust tests; 78 Playwright tests
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty      package verification succeeded
cargo +1.85.0 check --locked     declared MSRV passed
npm run build                    release CLI and dist/site created
```

`npm test` has two intentional skipped Playwright project instances. There is
no separate lint script.

The packaged crate was unpacked into a new temporary consumer and installed
only with `cargo install --path … --root … --locked`. The installed
`import-mapping-replay 0.1.0` exposes useful `run` and `demo` help. Its
`demo --json` exited 0 with five rows, three validation errors, a unique temp
directory, and all four artifacts. A normal valid CSV run with `--sample 0`
exited 0 with three rows, zero errors, and four non-empty artifacts. A missing
source returned exit 1 and parseable actionable JSON. An invalid five-row run
returned exit 2 with three findings; rerunning into the same directory with
the valid CSV returned exit 0 and an empty `issues` array.

Production build assets are within budget: JS 22,934 B raw / 7,370 B gzip,
CSS 13,100 B raw / 3,689 B gzip, and hero WebP 185,892 B. No third-party font
or runtime script is loaded.

## Live product, privacy, accessibility, and deployment

`node tests/live-audit.mjs https://import-mapping-replay.sociobot.in
/tmp/imr-v14-live-audit.E3mmQv` passed. It checked `/`, `/demo`, `/privacy`,
`/terms`, `/404`, and an unknown path on desktop and 390 px mobile: all 12
Axe scans had zero violations, there was no horizontal overflow and no
console/page error. It also proved demo reset, demo storage isolation,
cancellation of an in-flight licence verification when entering demo, cached
valid-licence fallback after a recorded 503, and Back scroll/focus restoration.

`/opt/fleet/lib/verify-url.sh` passed at
`/tmp/imr-v14-verify.JIACEg`: HTTP 200, title, `lang=en`, one h1, main,
image alts, labelled controls, and no console error. Manual keyboard testing
put Tab first on Skip to main content; Enter focused `#main`; Enter on the
primary demo action opened the demo; and Space on Fix the sample email changed
the count from 3 to 2 and focused its status. In reduced-motion emulation all
nonzero transitions and animations were `0.01 ms`.

Fresh cold landing and direct demo request logs contained only same-origin
document, JS, CSS, and image requests. The direct demo preserved seeded
real-license storage exactly, made no cross-origin request, and left its own
storage empty. A returned invalid licence is tested by the claim suite to be
stored locally, stripped from the URL, and sent only to the documented
Sociobot verification endpoint. No analytics, telemetry, external font, or
runtime AI call was observed.

Live GET/HEAD results: `/`, `/demo`, `/privacy`, and `/terms` return 200;
`/404` and `/v14-not-found` return the designed 404 with HTTP 404. All carry
CSP with response-header `frame-ancestors 'none'`, HSTS, `nosniff`, strict
referrer policy, and the restrictive permissions policy. HTML revalidates at
30 seconds, hashed JS/CSS are immutable for one year, and stable WebP assets
use `max-age=0, must-revalidate`. All rendered links resolved as intended;
checkout GET and HEAD each returned 303 to `checkout.dodopayments.com`.

The candidate and live SHA-256 values match exactly:

| Resource | SHA-256 |
| --- | --- |
| `/` | `b5ebb548c988bc0c64f57fdc3fc1b7d40c151ff5e5ecde02fb3d553bfe83be59` |
| `/demo` | `3b18df043ee7d646df745bd78e5734dbf185a02ad527af41bd9135e7de0ca065` |
| `/privacy` | `7a7efadb0159f4a7378f3757252fbf328738f9fdf5e4dd6b88b92f5c24280d12` |
| `/terms` | `1a128a990a7e9b1d0cacb79ec840ef44131587126c20208b0b0ffcc6924f8595` |
| `/404` | `416cc8a043d51b0a87a4c0fe7419bf484074f2ae95ed37522f340479462a0c83` |
| `/assets/main-CMkI4RUt.js` | `d2c6287d548168733349f187a1f8239c4b3bb7f185ed28d69246c135b73e7126` |
| `/assets/main-CP8GCJAy.css` | `a62a32c367b4566de19f9e66091f7b83d9fba9141c866c380f26492f78ea0604` |
| `/assets/replay-poster.webp` | `3e534cbab9801eccb9c342452c4cee7d25c48cc4ae64a0d9274e3b82e3307a95` |
| `/assets/og-replay.webp` | `10e51eb88670f6d724309e703681f56c8a03c9c93e12a47e6b0e2e29e02a6189` |

The Sociobot product verification endpoint was rate-tested with one invalid
licence from this client: requests 1–30 returned 200 and 31–35 returned 429.
The first 429 contained `Retry-After: 3` and `X-RateLimit-After: 3`. Observed
allowance: 30 immediate requests. This is a static site and local CLI; it has
no product backend, sign-in flow, service worker, or PWA, so backend health /
persistence, Entra, and service-worker update checks do not apply.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
