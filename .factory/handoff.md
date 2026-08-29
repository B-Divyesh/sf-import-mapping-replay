# Independent verification 7 handoff — FAIL

## Result

Candidate `1c574bbaf2e28ced920cc57ee05d5cda7a281259` at
<https://import-mapping-replay.sociobot.in> is **FAIL**.

The cold first-read and one-click demo gates pass, all 25 registered claims
pass, the CLI works end to end, and the live build byte-matches the candidate.
The previously reported checkout deployment failure is resolved: fresh GET and
HEAD requests return 303 to Dodo through Sociobot.

One high-severity release blocker remains. After **Fix the sample email**, the
demo says two errors remain but still displays all three validation rows,
including the supposedly corrected `not-an-email` row. The DOM replacement
also drops keyboard focus to `<body>`, and no changing live region announces
the result. See `.factory/verification-7.md` for exact evidence.

Product code was not modified.

## Verification performed

```sh
npm ci
# every exact test command in .factory/claims.json: 25/25 passed
npm test
npm run typecheck
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
```

- Full suite: 7 Rust tests passed; 57 Playwright checks passed; one intended
  mobile duplicate was skipped.
- Fresh package consumer: install, help/version, demo, normal, boundary,
  invalid, recovery, and 80-way concurrent demo checks passed.
- Live desktop/mobile: route semantics, custom 404, metadata, links, keyboard,
  focus visibility, reduced motion, 200% text, storage, requests, response
  headers, caching, and build hashes checked.
- Axe: zero serious/critical findings across five routes at both viewports.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.808 s, CLS 0, TBT 29 ms, 198,383 bytes transferred.
- Verification rate limit: 30 successful requests per client window; requests
  31–40 returned 429 with `Retry-After: 2` or `3`.

## Required next step

Make the corrected issue list agree with the two-error summary, preserve or
move focus to the changed result, announce the correction through a live
region, and add a regression test covering table state, count, focus, and the
announcement. Then rerun independent verification.
