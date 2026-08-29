# Polish 7 handoff — PASS

Deployed repair commit `600ef3a92e457d2c0912c8a895e7f95bddb63ff4` to
<https://import-mapping-replay.sociobot.in> with Azure Static Web Apps
deployment `9e9e2b80-be4c-4f92-98a2-a4ee8b1c385c`.

## What changed

- Routed `/404` through a deliberately missing internal path and the configured
  404 response override. Both `GET` and `HEAD` now return the designed page
  with HTTP 404 in production.
- Expanded `email-domain-validation` into the complete documented email-format
  contract. Its tagged test now proves accepted ASCII examples and rejects
  non-ASCII, spaces, one-label domains, and all three malformed-dot cases.
- Kept the one-click `/?demo=1` sandbox, route metadata, mobile layout,
  accessibility, privacy boundary, legal links, and the art-deco transit
  poster identity intact. The catalog description is now the 88-character,
  verb-first sentence in `.factory/catalog-description.txt`.
- Added live-audit coverage for GET and HEAD on `/404` and an arbitrary missing
  URL.

## Verification

The final no-hardlinks clone was
`/tmp/import-mapping-replay-polish7-deployed.MdtR2R/repo` at deployed commit
`600ef3a92e457d2c0912c8a895e7f95bddb63ff4`.

- All 33 exact commands listed in `.factory/claims.json` passed independently.
- `npm test` passed: 9 Rust unit tests and 76 Playwright checks; 2 intentional
  project skips.
- `npm run typecheck`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`,
  `cargo package`, and `npm run build` passed.
- The clean production bundle is 22,934 B JavaScript (7,366 B gzip) and
  13,100 B CSS (3,684 B gzip). Live `index.html`, JS, and CSS SHA-256 values
  match the build.
- `/opt/fleet/lib/verify-url.sh` passed: title, language, one h1, main,
  image alts, labeled buttons, and browser console all passed. See
  `.factory/evidence/polish-7/live/verify/verify.json`.
- `node tests/live-audit.mjs https://import-mapping-replay.sociobot.in
  .factory/evidence/polish-7/live` passed. It ran Axe with zero violations on
  `/`, `/demo`, `/privacy`, `/terms`, `/404`, and a missing route at desktop
  and 390 px; it also checked cold metadata, no overflow, demo reset and
  storage isolation, the license-request race, cached-license fallback, and
  Back scroll/focus restoration. Screenshots and `cold-audit.json` are under
  `.factory/evidence/polish-7/live/`.
- Live route matrix: GET and HEAD return 404 for `/404` and
  `/polish-7-not-found`; `/`, `/demo`, `/privacy`, and `/terms` return 200.
  Every rendered link was crawled successfully; checkout returns 303 on both
  GET and HEAD.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.885 s, CLS 0, TBT 21 ms, transfer 199,128 B. Report:
  `.factory/evidence/polish-7/live/lighthouse.json`.

## Run and deploy

```sh
npm ci
npm test
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package
npm run build
```

For the CLI sample, run `cargo run -- demo`. For the browser sample, open
`https://import-mapping-replay.sociobot.in/?demo=1`.

The static deployment command is:

```sh
npm ci && npm run build:site
/opt/fleet/lib/deploy-static.sh import-mapping-replay dist/site
```

## Known gaps and next steps

None. The release candidate has no unresolved review finding or deferred
acceptance work.
