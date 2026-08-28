# Handoff: Import Mapping Replay 0.1.0

## What shipped

- A Rust single-binary CLI with `run`, `demo`, `--help`, version output, JSON results, and non-interactive exit codes.
- Stable version 1 JSON mappings with trim, lower/uppercase, replacement, date formatting, defaults, and four validation rules.
- Deterministic `output.csv`, field-level `evidence.json`, `validation.json`, and source-row `rollback-manifest.json` artifacts.
- A bundled five-row customer sample with three deliberate errors. `import-mapping-replay demo` runs it in a new temporary directory.
- An art-deco transit-poster site with real CLI output, a one-click isolated demo, mobile layout, keyboard routing, privacy, terms, and 404 views.
- A £24 one-time team kit flow through the Sociobot checkout and verification API. The callback license is stored under `sb_license:import-mapping-replay` and stripped from the URL.
- An original factory-generated poster at 184 KB WebP and a derived 1200×630 social image. The prompt and deployment metadata are stored beside it.

## Run and verify

```sh
cargo run -- demo
npm test
npm run build
cargo package --allow-dirty
```

The exact deploy build is `npm run build`. Static output is `dist/site`; its root contains `index.html` and `404.html`.

Verification completed on 28 August 2026:

- `cargo test`: 3 passed.
- Playwright 1.58.2: 18 passed across desktop Chromium and a 390 px mobile profile.
- Every command in `.factory/claims.json` is addressable with `npm test -- --grep @claim:<id>`.
- Axe: no serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, or an unknown route.
- Factory URL check: title, `lang`, main landmark, alt text, and console check passed; zero console errors.
- Lighthouse mobile: performance 98, accessibility 100, best practices 100, SEO 100.
- Lighthouse details: LCP 2.2 s, CLS 0, total blocking time 70 ms.
- Built site assets: 5.93 KB gzip JavaScript, 3.18 KB gzip CSS, and 184 KB hero WebP.
- `cargo package`: passed; crate archive is ready for factory publishing.
- `npm audit --audit-level=high`: zero vulnerabilities.

Local evidence is written to `.factory/evidence/` and is ignored by Git.

## Known gaps and next steps

- The factory must register the paid product and switch its checkout registration to the live site. No product identifier or payment provider secret is stored here.
- The factory must publish platform binaries or the crate. This worker did not use registry credentials.
- The rollback manifest restores the local source rows only. It cannot undo an upload to a third-party product, and the CLI and site state this limit.
