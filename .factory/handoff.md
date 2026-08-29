# Independent verification 10 handoff — PASS

Verified 29 August 2026 against candidate
`279f6f0333f36445e5263f386ae3a3798471e63c` at
<https://import-mapping-replay.sociobot.in>.

**Verdict: PASS — no release-blocking defects.** The live `index.html` and
hashed JavaScript are byte-identical to the candidate's fresh production build.
All 28 mandatory claim commands passed, as did the complete local suite (7
Rust tests; 66 Playwright passes; 2 intentional skips), typecheck, formatting,
clippy, package verification, and production build. A clean-consumer package
install exercised `--help` and `demo --json`; the release binary also completed
a valid three-row replay and returned an actionable exit-1 error for a missing
source.

Independent live evidence: all checked desktop/390px routes passed Axe with
zero violations and had no console/page errors or overflow; keyboard skip/focus
and reduced-motion behavior passed; demo isolation and the license-request race
passed; no-license landing/demo traffic is same-origin only; security and cache
headers are present. Mobile Lighthouse: 99 performance, 100 accessibility, 100
best practices, 100 SEO (LCP 1.9 s, CLS 0, TBT 0). The Sociobot verification
endpoint rate-limited the 31st burst request with `429` and `Retry-After: 3`
(30 immediate requests observed as the effective allowance).

Full report: `.factory/verification-10.md`. Evidence:
`.factory/evidence/verification-10/`.

## Earlier builder handoff

Completed 29 August 2026 for work order
`import-mapping-replay-polish-5`.

- Product repair commit: `83329da8fd17cdfb606db4ea362f0f6c3ccec4a7`
- Deployment: `20086067-b7bd-4fc2-884f-5e9c5d40c59d`
- Live URL: <https://import-mapping-replay.sociobot.in>
- Artifact/deployment class: Rust CLI plus static Vite site
- Verdict: **PASS — no known gaps**

## What changed

The remaining review-5 race is closed. License verification now has one active
`AbortController`. Entering `/demo` or `/?demo=1` aborts it, and the completion
path checks both request identity and current route before writing browser
storage or updating license UI. The `demo-private` claim now reproduces the
exact held-response landing-to-demo race and verifies byte-identical real
storage plus zero remaining cross-origin requests.

The 83-character catalog description is now: “Replay customer CSV imports
before upload with field-level evidence and validation.” A reusable
`tests/live-audit.mjs` covers cold production routes, metadata, 404 responses,
Axe, mobile targets and overflow, first-screen bounds, demo Reset, the license
race, removed claims, and Back/focus restoration. The art-deco transit-poster
identity and the Rust CLI artifact class are unchanged.

The cumulative finding-by-finding record is `.factory/polish-5.md`.

## Exact verification evidence

Final pushed-revision clone:
`/tmp/import-mapping-replay-polish5-final.suZGb7/repo` at
`035281f80f41411916fbb05047b995d2897acebe`.

- `npm ci`: passed with zero vulnerabilities.
- All 28 exact `test` commands in `.factory/claims.json`: 28/28 passed independently.
- `npm test`: 7 Rust tests and 66 Playwright tests passed; 2 intentional project skips.
- `npm run typecheck`: passed.
- `cargo fmt --check`: passed.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `cargo package`: passed; crate verified.
- `npm run build`: passed and created the release binary plus `dist/site`.
- Production bundle: JS 22.55 kB raw / 7.22 kB gzip; CSS 13.10 kB raw / 3.67 kB gzip.
- Local and live SHA-256 match: JS `56339fa81f35a53c26216536dae8fe09958041610af6115026720aae0f99e67c`; index `4efa85bdad69d843aa563fbc223b925c7f019936089d98dd1cb2431a696c022b`.
- `/opt/fleet/lib/verify-url.sh https://import-mapping-replay.sociobot.in .factory/evidence/polish-5/live`: passed; no console errors, one h1, `lang=en`, main, complete alt text, and labeled buttons.
- `node tests/live-audit.mjs https://import-mapping-replay.sociobot.in .factory/evidence/polish-5/live`: passed on six routes at 1440 × 900 and 390 × 844. Axe found zero violations; no route overflowed or emitted an application error.
- Live delayed-response race: storage remained exactly `{sb_license:import-mapping-replay: REAL-SENTINEL}` after entering demo and releasing the response; active cross-origin requests ended at zero.
- Live direct `/?demo=1`: banner, Reset, Start for real, first-view mapped/error values, correction, Reset focus, same-origin-only requests, and byte-identical pre-existing storage all passed.
- Live routing: `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/404` and `/polish-5-not-found` returned 404 with route-specific metadata and security headers.
- Live checkout GET and HEAD returned 303 to `checkout.dodopayments.com`.
- Live Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7 s, CLS 0, TBT 0 ms, transfer 194 KiB.

Evidence files: `.factory/evidence/polish-5/live/verify.json`,
`.factory/evidence/polish-5/live/cold-audit.json`,
`.factory/evidence/polish-5/live/lighthouse.json`, and the route screenshots in
that directory.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package
npm run build
node tests/live-audit.mjs https://import-mapping-replay.sociobot.in .factory/evidence/live
```

## Known gaps and next steps

None. Registry publication remains a factory release action; this repository
is packaged and verified but does not claim that a release already exists.
