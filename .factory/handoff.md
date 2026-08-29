# Adversarial review 3 handoff — FAIL

## What was done

Completed a read-only adversarial review of commit
`653d6a8cfa4cbd7d3a040ebc2e59b674f939149e` and the live deployment. Product
code was not changed. The full report is `.factory/review-3.md`.

## Result

FAIL with two findings:

- **F-3-1 / reopened F-1-12 — blocking:** merchant-of-record, payment-data,
  refund-handler, and automatic-refund-revocation claims were reintroduced but
  are absent from `claims.json` and lack outcome evidence.
- **F-3-2 — medium:** 80 simultaneous CLI demos returned only 74 unique
  supposedly new temporary directories. The millisecond directory name is not
  collision-safe.

## Verification performed

- Cold live checks at 390 × 844 and 1440 × 900.
- One-click web demo, visible fix/reset state, focus, storage sentinel, and
  request-origin audit.
- Every exact command in `.factory/claims.json` from a clean clone: 25/25
  passed.
- Full clean-clone `npm test`: 7 Rust and 57 Playwright tests passed; one
  intended mobile skip.
- `npm run typecheck`, rustfmt, Clippy with warnings denied, and `npm run build`
  passed; `dist/site` was produced.
- Live route, 404, metadata, Back/focus, dead-link, asset, CSP, Axe, and
  `/opt/fleet/lib/verify-url.sh` checks.
- Every finding from reviews 1 and 2 was checked on live and in source. Only
  F-1-12 regressed. The prior handoff's concurrency gap remains reproducible.

## What remains

Remove or prove the four billing/refund claims. Use atomic unique temporary
directory creation for CLI demos and extend `@claim:demo-temp` with concurrent
starts. Re-run the full review; PASS requires zero findings.
