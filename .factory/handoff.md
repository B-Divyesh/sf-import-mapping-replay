# Polish round 6 handoff — PASS

Completed 29 August 2026 for work order
`import-mapping-replay-polish-6` against repair commit
`72a4f0d812aa2fa0a4c0ae4360926ccd21fa9f2d`.

Live site: <https://import-mapping-replay.sociobot.in>

Verdict: **PASS — no known finding remains.** The Rust CLI and static Vite
deployment class are unchanged.

## What changed

- Registered `license-unavailable-fallback` and added its single observable
  browser test. An aged valid result now has explicit evidence that an HTTP 503
  recheck preserves the cached verdict and keeps the team kit available.
- Made **Try it with sample data** open `/?demo=1` directly. `/demo` remains a
  real, reload-safe route. Both paths use the isolated in-memory sample with
  its persistent banner, Reset demo, and Start for real controls.
- Updated the demo documentation, copy audit, live audit, and the 77-character
  verb-first catalog description.
- Re-ran every earlier finding and retained the transit-poster visual system.

The complete finding-to-change-to-evidence map is `.factory/polish-6.md`.

## Exact verification evidence

Clean clone: `/tmp/import-mapping-replay-polish6-clean.tBuhoF/repo` at
`72a4f0d812aa2fa0a4c0ae4360926ccd21fa9f2d`.

- `npm ci`: passed with zero vulnerabilities.
- Every exact command in `.factory/claims.json`: 29/29 passed independently.
- `npm test`: 7 Rust tests and 68 Playwright tests passed; 2 intentional
  browser-project skips.
- `npm run typecheck`: passed.
- `cargo fmt --check`: passed.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `cargo package`: passed and verified the crate.
- `npm run build`: passed; release binary and `dist/site` were created.
- Bundle: JavaScript 22.56 kB raw / 7.22 kB gzip; CSS 13.10 kB raw / 3.67 kB
  gzip.

Deployment `a7360fe1-bcb4-4513-b18e-babd31dce877` used the work-order static
configuration: `npm ci && npm run build:site`, then deployment of `dist/site`.

- `/opt/fleet/lib/verify-url.sh`: passed with no console errors, one h1,
  `lang=en`, a main landmark, complete alt text, and labeled buttons.
- `node tests/live-audit.mjs`: passed in new 1440 × 900 and 390 × 844 browser
  contexts. Six routes per size had zero Axe violations and no overflow.
- `/?demo=1`: same-origin requests only; Reset restored three errors and result
  focus; both real-storage sentinels remained byte-identical.
- Landing-to-demo race: the held verification was aborted, no verdict was
  written, and no cross-origin request remained active.
- Cached-license outage: one recorded HTTP 503 left the aged valid verdict
  unchanged, showed the tested status, and kept Download team kit visible.
- Routing: `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/404` and two
  fresh unknown paths returned the designed page with HTTP 404.
- Every rendered link resolved. Checkout returned 303 to
  `checkout.dodopayments.com`.
- Live index and JavaScript SHA-256 values matched the deployed build exactly.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.8 s, CLS 0, TBT 20 ms, transfer 194 KiB.

Evidence: `.factory/evidence/polish-6/live/verify.json`,
`.factory/evidence/polish-6/live/cold-audit.json`,
`.factory/evidence/polish-6/live/lighthouse.json`, and the cold screenshots in
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

None. Registry publication remains a factory release action; the crate is
packaged and verified but does not claim that a packaged release exists.
