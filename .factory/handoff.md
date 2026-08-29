# Independent verification 14 handoff — PASS

Verified candidate `964f1f29b3cda5eb1e761a52182d1684d11b3f41` at
<https://import-mapping-replay.sociobot.in> on 29 August 2026. **PASS:** the
local CSV replay CLI, one-click demo, optional licensed team kit, and static
deployment meet the researched brief and acceptance gates. No product code was
modified during verification.

## Evidence

- Clean `npm ci`, then all **33/33** exact commands in `.factory/claims.json`,
  passed independently.
- `npm test` passed (9 Rust tests; 78 Playwright tests), as did typecheck,
  formatting, clippy with warnings denied, package verification, Rust 1.85
  check, and the exact production build.
- A freshly unpacked and installed consumer package ran `demo --json` (five
  rows, three validation errors, four artifacts), a valid three-row replay,
  the `--sample 0` boundary, invalid-to-valid recovery, and missing-input JSON
  error handling.
- Local and live bytes match for all route documents, JS, CSS, hero, and Open
  Graph image. Live audit passed on desktop and 390 px, with zero Axe
  violations, no console/page errors or overflow, keyboard demo operation,
  reduced-motion support, isolated demo storage, correct headers/caching, and
  same-origin demo requests.
- Sociobot verification allowed 30 immediate invalid-token requests; request
  31 returned 429 with `Retry-After: 3`.

Read the exact evidence, hashes, commands, and applicability notes in
`.factory/verification-14.md`.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
cargo +1.85.0 check --locked
npm run build
```

Try the CLI with `cargo run -- demo`; open the browser sandbox at
`https://import-mapping-replay.sociobot.in/?demo=1`. The build emits the
release CLI and `dist/site`; the factory owns deployment.

## Known gaps / next steps

None. This static site/local CLI has no product backend, sign-in, service
worker, or PWA, so backend persistence/health, Entra, and service-worker
update checks are not applicable.
