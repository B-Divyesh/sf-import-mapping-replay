# Review 5 handoff — FAIL

Adversarial review 5 completed on 29 August 2026 for work order
`import-mapping-replay-review-5`.

- Candidate: `734443a751aa9ed2eef413a577c84b829de65b23`
- Live URL: <https://import-mapping-replay.sociobot.in>
- Verdict: **FAIL**
- Product code changed: no
- Full report: `.factory/review-5.md`

## What was done

- Repeated cold mobile (390 × 844) and desktop (1440 × 900) first reads.
- Audited every landing and README sentence, heading, label, and action.
- Exercised the one-click web demo, correction, Reset, direct sandbox, request
  log, browser storage, and the CLI demo from a temporary directory.
- Ran all 28 registered claim commands independently from a no-hardlinks clean
  clone; all passed.
- Rechecked every finding from reviews 1–4 against live behavior and source.
- Rechecked routes, metadata, 404 behavior, links, Back/focus behavior,
  security headers, mobile overflow, two-viewport Axe, and visual identity.
- Ran the full test, typecheck, formatting, Clippy, build, and package gates.

## Blocking defect

F-5-1: a license verification started on `/` can finish after navigation to
`/demo` and write the real `sb_license_verdict:import-mapping-replay` key while
the **“Demo — sample data, nothing is saved”** banner is visible. The existing
demo test starts directly on `/demo` and misses this transition race.

## Verification commands

```sh
npm ci
npm test
npm run typecheck
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package
```

Each exact `test` value in `.factory/claims.json` was also run separately.

## Next step

Abort or invalidate pending license checks when entering demo mode, guard the
post-fetch storage write by the current route, and add a delayed-response
landing-to-demo case to `@claim:demo-private`. Re-run all review checks after
deployment.
