# Handoff: polish round 1

## Status

Complete. All 14 findings in `.factory/review-1.md` are fixed and live. No earlier polish report exists. The deployed repair commit is `d102fbf`.

- Production: <https://import-mapping-replay.sociobot.in>
- Demo: <https://import-mapping-replay.sociobot.in/?demo=1>

## What changed

- Rewrote the first screen around the concrete result: an output CSV and error report before upload.
- Preserved the transit-poster visual system while correcting vague headings and the terminal replay label.
- Kept Privacy visible in the mobile header and enforced 44 px mobile targets.
- Added direct, isolated `?demo=1` coverage with the persistent banner, reset, and exit controls.
- Added exact scroll restoration and h1 focus/announcement for Back navigation.
- Added prerendered route metadata for `/demo`, `/privacy`, `/terms`, and the 404 document.
- Changed static routing so known routes return 200 and both `/404` and arbitrary unknown URLs return 404.
- Removed unsupported merchant, refund, card-data, and license-scope promises.
- Added observable claims for CLI network isolation, exact website storage, 24-hour license caching, and rollback scope.
- Updated README, copy audit, changelog, demo documentation context, claims registry, and the 87-character verb-first catalog description.

## Verification

Final clean clone: `/tmp/import-mapping-replay-deployed-clean.jhJent/repo`, commit `d102fbf`.

- All 19 `.factory/claims.json` commands passed independently; each ran in both desktop and mobile Playwright projects.
- `npm test`: 3 Rust tests and 38 browser runs passed.
- `npm run typecheck`: passed.
- `cargo fmt -- --check`: passed.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `npm run build`: passed; `dist/site` created.
- `cargo package --allow-dirty`: passed; packaged crate installed into a fresh root.
- Installed `import-mapping-replay --version`: `0.1.0`.
- Installed `import-mapping-replay demo --json`: 5 rows, 3 validation errors, four review-file paths, fresh temporary directory.
- Production bundle: 19.08 kB raw / 6.16 kB gzip JS; 11.27 kB raw / 3.26 kB gzip CSS; 185,892-byte hero image.
- Local Lighthouse: 98 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.2 s, CLS 0, TBT 70 ms.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.8 s, CLS 0, TBT 30 ms.
- Live verifier: one h1, `lang=en`, main landmark, no missing alt text, no unlabeled buttons, no application console errors.
- Live cold audit: 12 desktop/mobile route checks, zero serious/critical Axe issues, zero horizontal overflow, visible Privacy navigation, isolated demo storage/requests, exact 4000 px history restoration, h1 focus, and working GET/HEAD checkout redirects.
- Live status: `/`, `/demo`, `/privacy`, and `/terms` return 200; `/404` and a random unknown route return 404 with the designed page.

Evidence is under `.factory/evidence/polish-1/` in the work-order workspace. The finding-by-finding mapping is in `.factory/polish-1.md`.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
```

Deploy `dist/site` with `/opt/fleet/lib/deploy-static.sh import-mapping-replay dist/site`.

## Known gaps and next steps

None for this work order. Registry publication remains a factory-owned release action; no package was published here.
