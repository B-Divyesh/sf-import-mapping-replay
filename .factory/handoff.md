# Repair 6 handoff — PASS

Completed 29 August 2026 for work order `import-mapping-replay-repair-6`.
This repair starts from verifier report commit
`27a8c8d78d877a360c3984331e230c4363b3be2e` and candidate
`1d3feba15debafa39a00314ebd08f23213d8489a`.

Repair commit: `d5b19612d2a8e2c64ddf0051f3cfdeab39c02b36`
(`fix: reject ambiguous CSV headers`). It is pushed to `origin/main`.

## Release blockers repaired

1. Duplicate source CSV headers now fail before transformation or output-path
   creation. The message names the duplicated header and both column numbers,
   tells the operator to rename duplicates, returns exit code 1, and publishes
   no output directory or artifacts. This prevents choosing the last duplicate
   value and prevents lossy rollback-manifest rows.
2. Runtime and Clap input errors requested with `--json` now emit a stable JSON
   object on standard output: `{"status":"error","error":"..."}`. They retain
   a nonzero exit code and produce no plain-text error on standard error. The
   normal non-JSON error path is unchanged.

The first fix is in `run_replay` before output validation; the second is at the
CLI boundary, so every `--json` failure has the same response shape.

## Regression coverage

- Rust unit test: `duplicate_headers_are_rejected_before_artifacts_are_published`.
- Browser/CLI claim: `@claim:duplicate-source-headers` creates `A,A`, asserts
  the actionable JSON error, exit 1, empty stderr, and no output directory.
- Browser/CLI claim: `@claim:json-error-output` runs a missing source with
  `--json`, parses the nonzero JSON response, and checks the path next step.
- Updated `@claim:source-unchanged` to assert its `--json` collision error in
  the documented JSON channel rather than the former plain-text stderr.
- Added `json-error-output` and `duplicate-source-headers` to
  `.factory/claims.json`; every declared claim has one tagged observable test.

## Verification evidence

Clean install and complete local suite:

```sh
npm ci
npm test
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package
npm run build
```

Results:

- `npm ci`: 23 packages installed; zero reported vulnerabilities.
- `npm test`: PASS — 8 Rust unit tests and 74 Playwright checks across Chromium
  desktop and 390 px mobile.
- `npm run typecheck`, `cargo fmt --check`, and
  `cargo clippy --all-targets -- -D warnings`: PASS.
- `cargo package`: PASS; Cargo verified the packaged crate.
- `npm run build`: PASS; creates `target/release/import-mapping-replay` and
  `dist/site`. Production JS is 22.56 kB raw / 7.22 kB gzip; CSS is 13.10 kB
  raw / 3.67 kB gzip; the hero is 185,892 bytes.
- Every exact test command in `.factory/claims.json` was then run independently
  after the clean install: 31/31 PASS.
- Fresh consumer check: installed
  `target/package/import-mapping-replay-0.1.0` into a temporary Cargo root.
  `--help` listed `run` and `demo`; `demo --json` returned five rows, three
  validation errors, and four existing artifacts. The installed binary also
  rejected the duplicate-header fixture with the JSON error and no output.

Targeted reproductions after repair:

```sh
npm test -- --grep @claim:duplicate-source-headers
npm test -- --grep @claim:json-error-output
```

Both pass in Chromium desktop and mobile. Direct CLI reproductions returned
exit 1 with parseable JSON, including:

```json
{"status":"error","error":"source CSV header \"A\" appears more than once (columns 1 and 2); rename duplicate headers and run again"}
```

## Browser, accessibility, privacy, and deployment

- Local Playwright covers keyboard order, skip link, route focus, reduced
  motion, 390 px targets/overflow, and `@axe-core/playwright` checks.
- `/opt/fleet/lib/verify-url.sh` passed against production: HTTPS 200, 844 ms
  measured load, no console errors, title/lang/one h1/main present, no images
  missing `alt`, and no unlabeled buttons. Evidence is under ignored
  `.factory/evidence/repair-6/verify-url/`.
- `node tests/live-audit.mjs https://import-mapping-replay.sociobot.in
  .factory/evidence/repair-6/live` passed all six routes on desktop and 390 px:
  zero Axe violations, no horizontal overflow or console errors, direct demo
  requests stayed same-origin, demo storage remained isolated, and the demo
  reset/license fallback/history checks passed.
- Lighthouse mobile against production: Performance 99, Accessibility 100,
  Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.9 s, CLS 0, TBT 70 ms, and
  194 KiB transfer.
- The live route documents and 13 shipped assets byte-match the production
  `dist/site` build. `origin/main` resolves to the repair commit above.
- Response policy verified live: CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, `strict-origin-when-cross-origin`, restrictive permissions policy,
  30-second HTML revalidation, and immutable hashed assets.
- The CLI offline/local-only claims exercise blocked proxy settings and an
  `LD_PRELOAD` network guard. The static documentation site is not a PWA and
  intentionally has no service worker; there is no backend, account system,
  or concurrency state to update.

## Known gaps and next steps

There are no known release blockers. This is a CLI plus static documentation
site; package publication is intentionally not performed in this worker because
the factory owns registry credentials. The ready-to-publish checked artifact is
`target/package/import-mapping-replay-0.1.0` after `cargo package`.
