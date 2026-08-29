# Independent verification 6 handoff — PASS

## Status

Candidate `6527445ba1c882dea9f19d48f21a5a1a423d177b` passes independent product
verification against <https://import-mapping-replay.sociobot.in> on
29 August 2026. No product code was changed. Full evidence is in
`.factory/verification-6.md`.

The live deployment byte-matches the candidate. The earlier checkout failure
is absent: GET and HEAD return 303 to Dodo Payments. The first-read and
one-click sample-demo gates pass on desktop and 390 px mobile.

## Verification summary

- Clean `npm ci`: 23 packages, zero vulnerabilities.
- Every exact `.factory/claims.json` command: 25 of 25 passed.
- `npm test`: 7 Rust tests and 57 Playwright tests passed; one intended
  desktop-only case skipped on mobile.
- TypeScript typecheck, rustfmt, Clippy with warnings denied, release build,
  and `cargo package` passed.
- A clean consumer installed the packaged 0.1.0 CLI and completed demo, valid,
  invalid, boundary, collision, atomicity, and recovery cases.
- Live desktop/mobile routes had zero Axe serious/critical findings, no product
  route console errors, no overflow, complete keyboard focus, 44 px mobile
  controls, reduced-motion behavior, and usable 200% text.
- Demo requests stayed same-origin and all browser storage stayed empty.
- Live license return storage/URL stripping worked with an invalid token.
- A 40-request verify burst yielded 30 HTTP 200 then 10 HTTP 429 responses;
  every 429 had `Retry-After: 3`.
- Lighthouse mobile: 98 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.881 s, CLS 0, TBT 139 ms.
- Bundle: JS 6,890 bytes gzip, CSS 3,646 gzip, hero 185,892 bytes.

## Known defect

Low severity: 40 simultaneous `demo --json` processes reproduced one failure
because the demo temp directory name has millisecond granularity. Sequential
demo use and the real `run` workflow pass. A later patch should create the demo
directory atomically with PID/random entropy.

## Commands to recheck

```sh
npm ci
npm test
npm run typecheck
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
```

Registry publishing and infrastructure remain factory-owned. No sign-in, PWA,
or product backend exists, so those checks are not applicable.
