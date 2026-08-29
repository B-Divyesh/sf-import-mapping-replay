# Verification 5 handoff — FAIL

## Status

**FAIL. Do not release candidate
`8b70b0eb04d05939f3ade051095d0aecdec652e4`.**

Independent verification was completed on 29 August 2026 against
<https://import-mapping-replay.sociobot.in>. The deployment byte-matches the
candidate. Full evidence and reproduction steps are in
`.factory/verification-5.md`.

## Release blockers

1. **Critical: source destruction.** If the source is named `output.csv` and
   its parent is passed as `--out-dir`, the CLI overwrites that source with the
   transformed output and exits `0`. The observed SHA-256 changed from
   `1095cf…330b` to `5e9397…124b`.
2. **High: partial artifact on failure.** A malformed later row exits `1` but
   leaves a plausible `output.csv` containing the mapped header and preceding
   transformed rows, without the evidence, validation, or rollback files.
3. **High: claims gap.** Paid checkout/return statements are not represented by
   exact claim records and tagged tests, especially `?license=` storage and URL
   stripping.
4. **High: purchase-law copy gap.** The site does not state that
   Sociobot/Dodo is merchant of record or that refunds are handled there.

## Passing evidence

- Cold first read and one-click `/demo`: PASS.
- `npm ci`: 23 packages, zero reported vulnerabilities.
- All 21 exact `.factory/claims.json` commands after install: PASS.
- `npm test`: 3 Rust tests and 47 Playwright passes; 1 intended project skip.
- `npm run typecheck`, `cargo fmt -- --check`, strict Clippy, `npm run build`,
  and `cargo package --allow-dirty`: PASS.
- Fresh packaged-crate install and normal/demo/zero-row/error/recovery CLI
  flows: PASS except the two safety blockers above.
- Live desktop and 390px routes: zero Axe serious/critical findings, no normal
  route console/page errors, no overflow, 44px mobile targets, keyboard focus,
  reduced motion, and 200% text resizing: PASS.
- Direct demo privacy: same-origin requests only and no new browser storage.
- Live security headers and caching: PASS.
- Candidate/live production file hashes: exact match.
- Bundle: 20,838-byte JS, 12,910-byte CSS, 185,892-byte hero image.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; 1.9s LCP, 0 CLS, 100ms TBT.
- Billing: GET/HEAD checkout now return 303 to Dodo. The verification endpoint
  allowed 30 requests in a burst, then returned 429 with `Retry-After: 3`.

## How to reproduce

```sh
npm ci
npm test
npm run typecheck
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty

qa=$(mktemp -d)
cp examples/valid-customers.csv "$qa/output.csv"
cp examples/mapping.json "$qa/mapping.json"
sha256sum "$qa/output.csv"
target/release/import-mapping-replay run \
  --source "$qa/output.csv" \
  --mapping "$qa/mapping.json" \
  --out-dir "$qa" --json
sha256sum "$qa/output.csv"
```

## Handoff boundary

No product code was modified during verification. Only this handoff and the new
verification report were written. Repair the blockers, add regression claims,
redeploy, and run a new independent verification.
