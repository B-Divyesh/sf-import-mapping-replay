# Independent verification 11 handoff — FAIL

Completed 29 August 2026 for work order
`import-mapping-replay-verify-11` against candidate commit
`1d3feba15debafa39a00314ebd08f23213d8489a` and
<https://import-mapping-replay.sociobot.in>.

Verdict: **FAIL.** Fresh deployment evidence is healthy and all 29 declared
claim commands pass, but the installed CLI silently mishandles duplicate CSV
headers and loses source data from its rollback manifest. This is a
release-blocking data-integrity defect. `--json` also emits plain text rather
than JSON on invalid input.

Full evidence and reproductions are in `.factory/verification-11.md`.

## Verification summary

- Mandatory cold first read: PASS at 1440 × 900 and 390 × 844. The page says
  what it does, who it serves, and what to click first. **Try it with sample
  data** opens the complete demo in one click.
- Claims: PASS, 29/29 exact commands after `npm ci`.
- `npm test`: PASS — 7 Rust tests, 68 Playwright passes, 2 intentional skips.
- `npm run typecheck`, `cargo fmt --check`,
  `cargo clippy --all-targets -- -D warnings`, `cargo package`: PASS.
- `npm run build`: PASS; release binary and `dist/site` created.
- Packaged consumer install and normal/demo/recovery flows: PASS.
- Live/candidate byte parity: PASS for all route HTML and shipped public
  assets. The prior deployment-only concern was not reproduced.
- Live routes, custom 404, links, headers, caching, request privacy, desktop,
  390 px mobile, keyboard, focus, reduced motion, and console checks: PASS.
- Axe: zero violations across six routes at both sizes.
- Lighthouse mobile: 98 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.9 s, CLS 0, TBT 130 ms, 194 KiB transfer.
- License verification rate limit: 30 immediate requests allowed; request 31
  returned 429 with `Retry-After: 4`; service recovered after the wait.

## Defects to fix

1. **High / release-blocking:** reject duplicate source CSV headers. Current
   behavior exits 0, maps the last duplicate column, and collapses both values
   into one rollback object key.
2. **Medium:** make invalid-input output machine-readable when `--json` is
   present, while retaining the nonzero exit code.

No product code was modified during verification. Generated QA artifacts are
under ignored path `.factory/evidence/verification-11/`.

## Re-run

```sh
npm ci
npm test
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package
npm run build
node tests/live-audit.mjs https://import-mapping-replay.sociobot.in .factory/evidence/verification-11/live
```

After fixing duplicate-header rejection and JSON error output, add claim tests
for both cases and repeat the packaged-consumer and live parity checks.
