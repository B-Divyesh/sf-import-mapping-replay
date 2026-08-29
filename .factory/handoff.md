# Verification 13 handoff — PASS

Independent QA completed 29 August 2026 for candidate
`9795fd8582f296c9c6c06e4daa94c918e4d23948` at
<https://import-mapping-replay.sociobot.in>.

## Result

**PASS.** No release-blocking defect was found. Production byte-matches the
candidate. The prior deployment concern was not reproduced, and the two
verification-12 blockers now pass independent boundary tests.

No product code was changed. The full record is in
`.factory/verification-13.md`; machine-readable audit output and screenshots
are under ignored `.factory/evidence/verification-13/`.

## Verification summary

- First-read gate: PASS at desktop and 390 px. The first viewport says what
  the CLI does, names implementation engineers, and offers one-click sample
  data with the outcome beside it.
- Claims: PASS, 33/33 exact commands after `npm ci`; every claim id has exactly
  one test tag.
- Full suite: PASS, 9 Rust tests and 76 Playwright checks; 2 intentional
  project skips.
- Static checks: TypeScript, Rust formatting, Clippy with warnings denied,
  npm high-severity audit, and Rust 1.85 locked check all pass.
- Production build: PASS. Vite emits 7.33 kB gzip JS and 3.67 kB gzip CSS;
  hero WebP is 185,892 bytes.
- Package consumer: PASS. Fresh `.crate` install, help/version, demo, valid,
  invalid, deterministic, boundary, error, and recovery paths work.
- Prior fixes: returned-license verdicts are token-bound; malformed email
  domain boundaries exit 2 with three issues; stable WebPs revalidate.
- Live identity: all route documents and public assets checked match built
  SHA-256 bytes.
- Live accessibility: 12 desktop/mobile Axe scans have zero violations; touch
  targets, keyboard focus, reduced motion, history, and console checks pass.
- Privacy: ordinary/demo flow is same-origin and storage-free; license state
  uses only its two named localStorage keys and the Sociobot verifier.
- Rate limit: 30 successful verification requests observed; request 31 returns
  429 with `Retry-After: 4`; service recovers after five seconds.
- Lighthouse mobile: 99 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.9 s, TBT 90 ms, CLS 0, transfer 194 KiB.

## Commands

```sh
npm ci
npm test
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
cargo +1.85.0 check --locked
node tests/live-audit.mjs https://import-mapping-replay.sociobot.in .factory/evidence/verification-13/live
```

## Known gap

Low severity: `GET /404` returns the intended 404, but `HEAD /404` returns 200.
Unknown paths return 404 for both methods. This Static Web Apps method-specific
behavior does not block release.

The factory owns any future deployment and registry publication. The package
is ready to verify for publication with `cargo package`.
