# Review 7 handoff — FAIL

Adversarial review 7 completed 29 August 2026 against repository commit
`f3c0e6adeabc66dad6a3a95e5e9e8c89e5b08ef4` and
<https://import-mapping-replay.sociobot.in>.

## What was done

- Wrote the full report to `.factory/review-7.md`.
- Repeated the cold first-read, demo, storage, request, route, link, metadata,
  accessibility, responsive, history, and visual-identity checks at 390 × 844
  and 1440 × 900.
- Read and rechecked every finding in reviews 1–6 and polish reports 1–6.
- Ran every exact command in `.factory/claims.json` independently from a fresh
  no-hardlinks clone: 33 passed, 0 failed.
- Ran the CLI demo from an empty temporary directory and confirmed its five
  rows, three errors, isolated temporary directory, and four non-empty files.
- Ran the complete test, typecheck, formatting, Clippy, and production-build
  gates from the clean clone.

No product code was changed.

## Verdict and open findings

**FAIL.** Two findings remain:

- `F-7-1` (blocking): live `HEAD /404` returns 200 although `GET /404`
  returns 404. Unknown paths return 404 for both methods.
- `F-7-2` (medium): README promises more email-format behavior than the
  registered `email-domain-validation` claim and tagged test cover.

## Verification results

- Exact claim commands: 33/33 passed.
- Full `npm test`: 9 Rust tests and 76 Playwright checks passed; 2 intentional
  project skips.
- `npm run typecheck`: passed.
- `cargo fmt --check`: passed.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `npm run build`: passed and created the release binary plus `dist/site`.
- Bundle: JavaScript 22.93 kB raw / 7.33 kB gzip; CSS 13.10 kB raw /
  3.67 kB gzip.
- Live Axe audit: zero violations across six routes at desktop and mobile
  sizes; no horizontal overflow or application console errors.
- URL verifier: passed title, language, one-h1, main, alt, labels, and console
  checks.
- Live index, hashed JavaScript, and hashed CSS byte-match the clean build.
- Demo request log: same-origin only; direct and landing-transition storage
  isolation passed.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
node tests/live-audit.mjs \
  https://import-mapping-replay.sociobot.in \
  .factory/evidence/review-7/live
curl -I https://import-mapping-replay.sociobot.in/404
```

The last command currently reports HTTP 200 and reproduces F-7-1. Review
evidence is under ignored `.factory/evidence/review-7/`.
