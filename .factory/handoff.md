# Polish round 4 handoff — PASS

Completed on 29 August 2026 for work order
`import-mapping-replay-polish-4`.

- Product repair commit: `c43b67a4abdba18dc73f1e1f77802a597196938d`
- Cumulative evidence/test commit: `d2e05d8dd9442ceb63b0a8afd7ab577fdd893ffa`
- Branch: `main`, pushed to `origin`
- Deployment: `c3c4247f-21a0-499a-ba84-909537a2e216`
- Production: <https://import-mapping-replay.sociobot.in>

## What changed

All seven review-4 findings are closed.

- Removed the false implication that packaged releases already exist.
- Replaced registry-readiness jargon with a direct `cargo package`
  instruction.
- Added `build-artifacts`, `site-routing-headers`, and `mit-license` to
  `.factory/claims.json`, bringing the registry to 28 claims.
- Added real tests that build isolated release artifacts, exercise Azure
  Static Web Apps routing/headers, and inspect the complete MIT terms.
- Updated the README, catalog description, and copy audit without changing
  the CLI/static artifact class or the Replay Line visual identity.

The cumulative mapping for F-1-1 through F-4-7 is in
`.factory/polish-4.md`.

## Clean-clone verification

Clean clone:
`/tmp/import-mapping-replay-polish4-final.oo7qTX/repo` at the cumulative
evidence/test commit.

After `npm ci`, every exact `test` command in `.factory/claims.json` ran
independently. Result: **28/28 passed**. Each claim id occurs in exactly one
test declaration.

The full clean-clone gates also passed:

```text
npm test                                  7 Rust; 64 Playwright passed; 2 intentional skips
npm run typecheck                         passed
cargo fmt -- --check                      passed
cargo clippy --all-targets -- -D warnings passed
npm run build                             passed; release CLI and dist/site created
cargo package                             passed; verification build passed
```

The packaged crate was installed into
`/tmp/import-mapping-replay-polish4-consumer.tFbTyt`. The installed binary
provided useful `--help`; `demo --json` reported five rows, three validation
errors, a unique temporary directory, and four non-empty review artifacts.

## Live verification

The deployment completed successfully. Local and live `index.html` share
SHA-256
`25bf14edcc9d011b6dcc72d605a5aba169909c9e3d919ef495b9288493d9f5ea`.

Cold production checks covered `/`, `/demo`, `/?demo=1`, `/privacy`,
`/terms`, `/404`, and an unknown path at 1440×900 and 390×844.

- Known routes return 200. `/404` and the unknown path return the designed
  page with HTTP 404.
- Every route has its specific title, description, canonical, Open Graph, and
  Twitter metadata; one h1; one main; `lang=en`; header and legal footer links.
- CSP, HSTS, `nosniff`, referrer policy, permissions policy, and cache policy
  are present on live responses.
- Initial Tab focuses the skip link; Enter focuses main. Client navigation
  focuses the new h1. Back restored scroll `4480 → 4480` and h1 focus.
- Ten live Axe runs found zero serious/critical findings. There were zero
  application console errors, zero mobile targets under 44 px, zero horizontal
  overflow, and zero running reduced-motion animations.
- At 200% root text size, the 390 px page retained all content with zero
  horizontal overflow.
- Both first screens keep all three product facts in view. The demo first
  screen contains the mapped email and complete row-5 error.
- `/?demo=1` correction reduced three errors to two, removed the corrected
  validation row, focused the live result, and announced it. Reset restored
  three errors and focused the result heading.
- The demo requested only its document and same-origin JS/CSS. It left a
  pre-existing real-license sentinel unchanged and created no session storage,
  cookies, IndexedDB databases, or Cache Storage entries.
- Checkout HEAD returns 303 to `checkout.dodopayments.com`.

Evidence:

- `.factory/evidence/polish-4/live/cold-audit.json`
- `.factory/evidence/polish-4/live/verify.json`
- `.factory/evidence/polish-4/live/home-mobile-cold.png`
- `.factory/evidence/polish-4/live/demo-mobile-cold.png`
- `.factory/evidence/polish-4/live/terms-mobile-cold.png`
- `.factory/evidence/polish-4/live/404-mobile-cold.png`

## Performance and privacy

Live Lighthouse 12.8.2 mobile results:

- Performance 99; Accessibility 100; Best Practices 100; SEO 100.
- LCP 1.910 s; CLS 0; TBT 65 ms; Speed Index 0.908 s.
- Total transfer 198,865 bytes.

The production JavaScript is 22,283 bytes raw / 7,159 gzip. CSS is 13,100 /
3,689 gzip. The hero WebP is 185,892 bytes. All budgets pass.

The CLI offline and network-denial claims passed from the clean clone. The
static site makes no offline/PWA claim and has no service worker, so PWA update
testing is not applicable. No analytics, telemetry, third-party font/script,
runtime AI, provider key, or CLI network dependency is present.

## How to verify

```sh
npm ci
npm test
npm run typecheck
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package
```

Demo entry points:

```text
https://import-mapping-replay.sociobot.in/?demo=1
cargo run -- demo
```

## Known gaps and next steps

None within this work order. No packaged release is advertised; future release
publication remains a factory-owned step and is not required for this source
installable 0.1.0 artifact.
