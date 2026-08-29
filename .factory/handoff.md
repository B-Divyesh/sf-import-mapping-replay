# Handoff: polish round 2

## Status

Release repair is complete and deployed. Product repair commit:
`e0e472501435d329b314eec20c96d68c0ad808ff` (following
`32fc864aab8add805dd4dd3de51a3b1e4dfccd2f`). Production deployment:
<https://import-mapping-replay.sociobot.in> via Azure Static Web Apps
`sf-import-mapping-replay`, production environment.

`.factory/polish-2.md` maps every F-1 and F-2 finding to its implementation
and evidence. There are no deferred findings or known product gaps.

## What changed

- The one-click `/demo` and `?demo=1` path now exposes a mapped before/after
  email plus a complete row-5 validation result in the 390 × 844 first view.
  **Fix the sample email** mutates only in-memory demo state; **Reset demo**
  restores the three-error sample and leaves real license storage untouched.
- The desktop first screen now keeps privacy, offline, and price facts inside
  1440 × 900.
- Claims now include five sample rows, the bundled CLI recording, five named
  recipes, and structured upload-owner/second-engineer-approval fields. The
  relevant tests execute the real CLI demo and inspect real output files.
- The downloaded team kit contains five usable recipe records and a structured
  checklist. README now has the contextful “Run a CSV replay” heading.
- Mobile mapping rows stack cleanly so both source and mapped email values stay
  readable. The transit-poster identity, static routing, legal pages,
  metadata, focus management, 404 response, and local-first boundaries remain
  intact.

## Verification

- Clean clone: cloned `--no-hardlinks`, ran `npm ci`, then independently ran
  every command in `.factory/claims.json`; all 21 commands passed.
- Final local suite: `npm test` passed (3 Rust tests, 47 Playwright passes,
  1 intentional desktop-only mobile-project skip); `npm run typecheck`,
  `cargo fmt -- --check`, `cargo clippy --all-targets -- -D warnings`,
  `npm run build`, and `cargo package --allow-dirty` passed.
- Production build: `dist/site` contains 20.84 kB raw / 6.71 kB gzip JS and
  12.91 kB raw / 3.63 kB gzip CSS. The existing 185,892-byte poster remains
  within the image budget.
- Live cold audit on the custom domain: `/`, `/demo`, `/privacy`, `/terms`,
  `/404`, and an unknown URL had expected titles, one h1, one main, and 200 or
  real 404 status as appropriate. The demo made three same-origin requests,
  preserved a real-license sentinel, reset from two errors to three, and had
  zero console errors.
- Live Axe: zero serious or critical violations on the mobile demo. The demo
  mapping and validation content fit within 390 × 844; all desktop facts fit
  within 1440 × 900. Screenshots:
  `.factory/evidence/polish-2/live/demo-390-cold.png` and
  `.factory/evidence/polish-2/live/home-1440-cold.png`.

## Run and deploy

```sh
npm ci
npm test
npm run build
cargo run -- demo
```

Deploy `dist/site` through the static work order to Azure Static Web Apps.
The CLI package is ready for registry review with `cargo package`; do not
publish from this repository.
