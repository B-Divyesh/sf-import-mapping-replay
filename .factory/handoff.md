# Independent verification 12 handoff — FAIL

Completed 29 August 2026 for work order
`import-mapping-replay-verify-12` against candidate commit
`fb8805a3cba37612ff650bc593fb243ecebf0be4` and
<https://import-mapping-replay.sociobot.in>.

Verdict: **FAIL.** The deployment matches the candidate and the previously
repaired duplicate-header and JSON-error behavior passes. Two independently
reproduced product defects still block release. Full evidence and reproduction
details are in `.factory/verification-12.md`.

## Release blockers

1. **High — checkout-return license cache is not token-bound.** If any fresh
   cached verdict exists, a newly returned `?license=` token is stored but not
   verified. With an old invalid verdict, a new valid buyer remains locked
   out. With an old valid verdict, a newly returned invalid token exposes the
   kit. Both live-browser reproductions made zero verification requests.
   Invalidate the verdict when the token changes, bind it to the token, and
   force verification for checkout-return tokens.
2. **High — obvious invalid email domains pass validation.** The clean
   packaged CLI accepted `a@.com`, `a@example.`, and `a@b..com`, exited 0, and
   wrote `valid:true` with zero issues. Define the supported email syntax,
   reject these cases, and add boundary claim coverage.

## Other defect

- **Medium — stable image names have one-year immutable caching.**
  `/assets/replay-poster.webp` and `/assets/og-replay.webp` are not content
  hashed but receive `max-age=31536000, immutable`. Hash their names or use a
  revalidating policy.

## Passing evidence

- First-read and one-click demo gate: PASS on desktop and 390 px mobile.
- Exact claim commands: PASS, 31/31 after `npm ci`.
- `npm test`: PASS — 8 Rust tests, 72 Playwright passes, 2 intentional skips.
- TypeScript check, Rust format, Clippy with warnings denied, exact production
  build, `cargo package`, and Rust 1.85 locked check: PASS.
- Clean packaged-consumer install: PASS for help/version, bundled demo, normal
  replay, deterministic artifacts, zero rows, BOM/CRLF/quoted CSV, JSON
  errors, and invalid-to-corrected recovery.
- Candidate/live parity: PASS for all route documents and public assets.
- Live audit: zero Axe violations across six routes at desktop and mobile; no
  normal-route console errors or overflow; keyboard, focus, reduced motion,
  reset, and demo isolation pass.
- Privacy: the direct demo made only three same-origin GETs and left all
  browser storage empty. Security headers are present.
- Lighthouse mobile: 97 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 2.0 s, TBT 180 ms, CLS 0, 198,973-byte transfer.
- Sociobot verification limit: 30 immediate requests; request 31 returned 429
  with `Retry-After: 4`; the endpoint recovered after the wait.
- The prior deployment-only failure does not reproduce.

## Re-run

```sh
npm ci
npm test
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package
cargo +1.85.0 check --locked
node tests/live-audit.mjs https://import-mapping-replay.sociobot.in .factory/evidence/verification-12/live
```

No product code was changed. Repair both blockers, add exact regression claims,
correct the image cache policy, rebuild/deploy, and repeat packaged-consumer
and live verification.
