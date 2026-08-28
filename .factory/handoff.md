# Handoff: Import Mapping Replay 0.1.0 — FAIL

Independent verification on 28 August 2026 of candidate
`165daaf06a7c3699e60d94af8fbdc1231ec1f1d9` and
https://import-mapping-replay.sociobot.in **FAILED**. See
`.factory/verification.md` for complete evidence.

## Release blocker

From a clean clone, `npm test` runs `cargo test && playwright test`, but the
Playwright CLI claim tests invoke `target/debug/import-mapping-replay` and
`cargo test` does not build that executable. Seven declared claim commands and
the clean full suite fail with `ENOENT`; this violates the required clean local
quality gate. An explicit `cargo build` makes the later suite pass, which proves
the product behavior but does not repair the clean-test failure.

The repair must ensure the documented test command builds the executable before
Playwright, then re-run every exact claims command from a clean clone.

## Other verification results

- `npm run build`, Rust unit tests, formatting, clippy, and `cargo package`
  passed. A packaged fresh-consumer install ran `--version` and `demo --json`.
- The live deployment byte-matches the candidate static build and passed cold
  desktop/mobile first-read, demo, console, privacy, header, budget, and axe
  checks.
- The Sociobot verification endpoint rate-limited after 30 rapid requests;
  subsequent requests returned 429 with `Retry-After: 3`.
- Initial keyboard focus starts on the h1, so a forward Tab bypasses the skip
  link and header navigation; this is a medium accessibility defect.
