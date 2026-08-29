# Repair 8 handoff — PASS

Import Mapping Replay repair round 8 is complete and deployed at
<https://import-mapping-replay.sociobot.in>.

## What changed

- Standardized every external destination reference on **customer system**.
- Standardized the CLI output set on **review files** in product copy, Rust
  names and errors, metadata, registered claims, and tests.
- Added exact positive and negative regressions so the review-8 wording cannot
  drift back to the rejected variants.
- Updated the verb-first, 79-character catalog line and completed the copy
  audit.
- Rechecked every earlier fix: one-click isolated `/?demo=1`, banner and Reset,
  claim registry, CLI safety, licensing races and outage fallback, routing,
  titles and metadata, GET/HEAD 404s, focus/history, legal links, and mobile
  layout.

The product-specific print-shop/technical-manual visual system is unchanged.
The artifact remains a Rust CLI with a static Vite landing and demo site.

## Deployment

- Deployed code commit: `6e46027a92ce8e49a6700f5ebbc54d34e93a6bab`
- Azure deployment: `ea2f41bc-4b50-466c-94c5-34177c9ae953`
- Command: `/opt/fleet/lib/deploy-static.sh import-mapping-replay dist/site`
- Custom domain: <https://import-mapping-replay.sociobot.in> (HTTP 200)
- Live checkout boundary: HTTP 303 to `checkout.dodopayments.com`

## Verification

The clean clone `/tmp/import-mapping-replay-polish8-clean.PqGqv8/repo` was at
the deployed code commit.

- All 33 claim commands passed independently; every claim ID has exactly one
  tagged test.
- `npm test`: 9 Rust tests and 76 Playwright tests passed; 2 intentional
  cross-project duplicates skipped.
- `npm run typecheck`: passed.
- `cargo fmt --all -- --check`: passed.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `cargo package`: passed; 73 files, 474.1 KiB compressed.
- `npm run build`: passed; output includes the release CLI and `dist/site`.
- Site size: JavaScript 22,961 B raw / 7.33 KiB gzip; CSS 13,124 B raw /
  3.68 KiB gzip.
- `verify-url.sh`: passed with one h1, `lang=en`, a main landmark, complete alt
  text, labeled controls, and no load errors.
- Live cold audit: 12 route/viewport combinations passed with zero Axe
  violations, no overflow, compliant touch targets, no console errors, and
  correct titles. GET and HEAD return 404 for both `/404` and an unknown route.
- Demo live audit: direct `/?demo=1` and landing transition preserve real
  license storage; Reset restores three errors; no cross-origin request remains.
- License outage audit: one 503 recheck retains the cached valid download.
- History audit: Back restores scroll from 3203 to 3203 and focuses
  `#page-title`.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.9 s, CLS 0, TBT 70 ms, Speed Index 0.9 s, 194 KiB transfer.
- Live `index.html`, JavaScript, and CSS hashes match the production build.
- Cold screenshots and reports: `.factory/evidence/polish-8/live/`.

The full finding map is `.factory/polish-8.md`.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
cargo fmt --all -- --check
cargo clippy --all-targets -- -D warnings
cargo package
npm run build
```

Run `import-mapping-replay demo` for the bundled CLI sample. Open
`/?demo=1` for the isolated browser sample.

## Known gaps and next steps

None. Every finding from reviews 1–8 is closed, including all minor findings.
No TODO or deferred acceptance work remains.
