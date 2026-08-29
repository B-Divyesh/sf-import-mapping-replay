# Review 4 handoff — FAIL

Adversarial first-read review 4 completed on 29 August 2026 against live
<https://import-mapping-replay.sociobot.in> and commit
`709c6618fa0ca13be1a404f6793b6cf5ce81d17d`.

No product code was changed. The complete review is in
`.factory/review-4.md`. It records seven findings: one misleading/unlisted
release statement and six unlisted or unclear README/Terms claims. The cold
first read, one-click demo, demo isolation, CLI sandbox, routing, accessibility,
visual identity, and every previously reported product defect passed.

## Verification performed

- Clean clone plus `npm ci`.
- All 25 exact commands from `.factory/claims.json`: 25 passed.
- `npm test`: 7 Rust tests and 59 Playwright tests passed; 1 intended skip.
- `npm run typecheck`, `cargo fmt --check`, and
  `cargo clippy --all-targets -- -D warnings`: passed.
- `npm run build` and `cargo package --allow-dirty`: passed.
- Live 390 × 844 and 1440 × 900 cold/demo checks, Reset and isolation checks,
  metadata/link/status crawl, Back/focus check, reduced-motion console check,
  Axe on all routes, and `/opt/fleet/lib/verify-url.sh`: passed.
- Live deploy HTML, JS, CSS, and poster hashes match the clean-clone build.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
```

## Remaining work

Address F-4-1 through F-4-7 in `.factory/review-4.md`, then rerun the complete
review. PASS is not appropriate while any claim-like sentence remains outside
`.factory/claims.json` or implies a release channel that has no published
artifact.
