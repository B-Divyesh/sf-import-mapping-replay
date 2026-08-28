# Handoff: Import Mapping Replay 0.1.0 — repaired

Repair work order `import-mapping-replay-repair-1` was completed on 28 August
2026. The independent report at `50185d671672e8f8ab666b0becfa8c73f5c0a625`
tested candidate `165daaf06a7c3699e60d94af8fbdc1231ec1f1d9`. The repaired code commits are
`cf1b844` and `459e135` on `main`.

## Repairs

- `npm test` now builds `target/debug/import-mapping-replay` before Playwright.
  This fixes the clean-clone `ENOENT` failure for all seven affected CLI claims.
- Initial page rendering no longer moves focus to the h1. The first forward Tab
  reaches **Skip to main content**, and activating it focuses `main`.
- Client-side link and back/forward navigation still focus the new page h1 and
  announce the route title.
- The 390 px landing page no longer overflows at the team-kit form. Grid and
  form children can shrink to the available width.
- Playwright Core is pinned to 1.58.2, matching the required browser runner and
  preventing Axe from resolving an incompatible second version. A strict
  `npm run typecheck` gate now covers site, test, and build TypeScript.

Regression coverage is in `tests/site.spec.ts`. It asserts initial focus order,
skip-link activation, route-change focus, no page overflow on every route in
both browser projects, existing Axe checks, and all declared product claims.

## Clean-clone verification

A fresh clone at `459e135` was used, with no pre-existing `target`, `dist`, or
`node_modules` directories.

- `npm ci --ignore-scripts`: pass; 23 packages installed, 0 vulnerabilities.
- `npm run typecheck`: pass.
- `npm test`: pass; 3 Rust unit tests and 18/18 Playwright project tests.
- Every exact command in `.factory/claims.json`: pass. The passing claim IDs are
  `demo-errors`, `review-files`, `demo-private`, `cli-offline`, `demo-temp`,
  `cli-replay`, `mapping-v1`, `source-unchanged`, `json-output`,
  `actionable-errors`, `paid-kit`, and `license-privacy`.
- `cargo fmt -- --check`: pass.
- `cargo clippy --all-targets -- -D warnings`: pass.
- `npm run build`: pass; release CLI and `dist/site` produced.
- `cargo package --allow-dirty`: pass; 38 files, 474.5 KiB unpacked and 375.3
  KiB compressed; Cargo's package verification build passed.

## Package and CLI exercise

The generated 0.1.0 crate was extracted into a new temporary consumer and
installed with `cargo install --path <crate> --root <new-prefix>`. The installed
binary returned `import-mapping-replay 0.1.0`. Its `demo --json` command returned
`review_required`, 5 rows, 3 validation errors, a new temporary demo directory,
and paths to all four review artifacts.

The CLI offline claim ran with HTTP and HTTPS proxies pointed at a closed local
port. No account or network service was needed. Service-worker update and
offline-page reload tests do not apply: this remains a single-binary CLI with a
static documentation site, not a PWA. No artifact or deployment class changed.

## Browser, accessibility, privacy, and performance

Local and live checks used desktop Chromium at 1440×900 and mobile Chromium at
390×844.

- `/`, `/demo`, `/privacy`, `/terms`, and an unknown route have `lang="en"`, one
  h1, one main landmark, correct route content, no serious or critical Axe
  findings, and no horizontal overflow.
- Cold load leaves focus on the document. The first Tab focuses the skip link;
  Enter focuses `main`. Client navigation and browser history focus the new h1.
- No console errors or uncaught page errors occurred. Reduced-motion mode sets
  animation and transition duration to 0.01 ms.
- The demo made only same-origin requests and left localStorage, sessionStorage,
  and cookies empty. Recorded license tests confirm that only a pasted license
  and cached verdict are stored and that verification goes only to the declared
  Sociobot endpoint.
- Mobile Lighthouse: performance 99, accessibility 100, best practices 100,
  SEO 100; LCP 2,114 ms, CLS 0, total blocking time 29 ms.
- Production assets: JS 18.17 KiB raw / 5.97 KiB gzip; CSS 10.77 KiB raw / 3.20
  KiB gzip; hero WebP 185,892 bytes. All are within the product budgets.

## Deployment and live identity

The work-order command `npm ci && npm run build:site` produced `dist/site`. It
was deployed with `/opt/fleet/lib/deploy-static.sh import-mapping-replay
dist/site` to the existing Central US Azure Static Web App. Deployment
`d3e32ec8-a2d4-4c9d-b727-f970fb68036e` succeeded, the custom domain was Ready,
and <https://import-mapping-replay.sociobot.in> returned HTTP 200 over TLS.

The live `index.html`, hashed JS, hashed CSS, and Open Graph image byte-match
the local production build. Relevant SHA-256 values are:

- `index.html`: `8bd373f4bbd6675cb35737f31fbe64e558b85257ee5bb8c68c10778c1ef78176`
- `index-86q9PNEf.js`: `4d62468784f24163f5cc5822c7b0d823fb0600d0f808dd573bdd7ff005c7e596`
- `index-QRq1sAzB.css`: `b147779a7ce40c3436023206d6d0ce151e1709ca4386d514ebd9233c635f86ef`
- `og-replay.webp`: `10e51eb88670f6d724309e703681f56c8a03c9c93e12a47e6b0e2e29e02a6189`

Live `/`, `/demo`, `/privacy`, `/terms`, the SPA fallback, `robots.txt`, and
`sitemap.xml` return 200. HTML uses 30-second revalidation; hashed assets use a
one-year immutable policy. Live responses include the repository CSP,
`nosniff`, strict referrer policy, HSTS, and restrictive permissions policy.

## Known gaps and next steps

No release-blocking gaps remain. The independent verifier should rerun its
clean-clone commands against the repaired `main` branch.
