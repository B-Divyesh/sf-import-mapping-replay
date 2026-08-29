# Handoff: Import Mapping Replay 0.1.0 — release-blocker repair

## Status: ready for release

This repair addresses every release-blocking finding in independent verification
3 (`.factory/verification-3.md`) for candidate
`93eb8c58729433fe003ee96352d93bb1621ac544`.

The verifier found no functional regression. Its blocker was the claims
contract: four visitor-facing promises had no separately runnable evidence.
The repaired product retains the CLI, static documentation site, demo, and
existing billing flow. It now has 15 declared claims, each with an exact
regression command.

## What changed

- Declared `rust-version = "1.85"` in `Cargo.toml` and changed the site and
  README wording to the precise, testable package declaration.
- Replaced the unbounded price/no-row-limit promise with the observable core
  behavior: the CLI completes a replay without a license. The £24 one-time
  team-kit claim remains unchanged and live checkout still works.
- Replaced the broad scheduling/upload statement with the observed local
  command behavior already covered by the replay claim.
- Replaced the untestable refund causal statement with the product behavior:
  a Sociobot verification response marking a license revoked hides the team
  kit and gives the user an active notice.
- Added three exact claim entries and regressions:
  `core-no-license`, `rust-msrv`, and `revoked-license-lock`.
- Updated the copy audit so all current landing assertions are recorded with
  verified word counts.

## Verification evidence

Clean verification began with `cargo clean` and `npm ci`; npm installed 23
packages and reported zero vulnerabilities.

All of these passed:

```sh
npm run typecheck
npm test
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
cargo +1.85.0 check --locked
```

`npm test` passed all 3 Rust unit tests and all 24 Playwright desktop/mobile
tests from the clean build. Every exact command declared in
`.factory/claims.json` passed independently:

```text
demo-errors, review-files, demo-private, cli-offline, demo-temp, cli-replay,
mapping-v1, source-unchanged, json-output, actionable-errors, paid-kit,
license-privacy, core-no-license, rust-msrv, revoked-license-lock
```

The new core-license claim runs a valid bundled source replay without any
license configuration. The MSRV claim reads package metadata and the actual
crate also completed `cargo +1.85.0 check --locked`. The revoked-license test
uses recorded `valid` then `revoked` Sociobot responses and proves that the
download control disappears with the expected status message.

`cargo package --allow-dirty` produced and verified the crate. A fresh
temporary consumer installed it with:

```sh
cargo install --path target/package/import-mapping-replay-0.1.0 --root <temp>
```

The installed 0.1.0 binary returned its version, completed `demo --json` with
5 rows and 3 validation errors, and completed a valid `--sample 0` replay with
3 rows and zero validation errors.

The production output was served locally and checked at 1440 px and 390 px
across `/`, `/demo`, `/privacy`, `/terms`, and an unknown route. Every route
had `lang=en`, exactly one `h1` and `main`, no horizontal overflow, no browser
errors, and a first-Tab skip link that focused `main`. The supplied
`verify-url.sh` passed on the production output; it reported the expected
title, all image alt attributes, labeled controls, no console errors, and a
541 ms local load. Existing Playwright Axe coverage and the live checks found
zero serious or critical violations.

## Deployment and live checks

Deployment used the work-order static configuration:

```sh
/opt/fleet/lib/deploy-static.sh import-mapping-replay dist/site
```

Azure Static Web Apps deployment `d5851744-59a8-4682-bfc6-e01f96d73f69`
succeeded to the existing Central US app and the custom domain is live at
<https://import-mapping-replay.sociobot.in>.

`verify-url.sh` passed against the live root: HTTP 200, title, `lang=en`, one
main landmark, image alt text, labeled controls, and zero page/console errors
(707 ms direct smoke load). Live Playwright checks at 1440×844 and 390×844
covered the five routes above, Axe serious/critical issues, first-Tab/Enter
skip-link behavior, zero horizontal overflow, demo privacy, and reduced
motion; all passed. The demo made only same-origin requests and left cookies
and localStorage empty after Reset demo.

The live root returns CSP with only self plus the declared Sociobot
verification `connect-src`, HSTS, `nosniff`, strict referrer policy, and a
restrictive permissions policy. The public checkout endpoint returned HTTP 303
to `checkout.dodopayments.com` for both GET and HEAD.

The live HTML and core assets byte-match `dist/site`:

- `index.html`: `8d8bfb07afdad15b811261a03e5b7a29533188a4e2bcb2a521ad77d314c9352e`
- `assets/index-CUjKdFBw.js`: `08b524f2bfe042285652ac058cc6b25cbfb2bb3f68d3487c978bf61314399363`
- `assets/index-QRq1sAzB.css`: `b147779a7ce40c3436023206d6d0ce151e1709ca4386d514ebd9233c635f86ef`
- `assets/og-replay.webp`: `10e51eb88670f6d724309e703681f56c8a03c9c93e12a47e6b0e2e29e02a6189`
- `assets/replay-poster.webp`: `3e534cbab9801eccb9c342452c4cee7d25c48cc4ae64a0d9274e3b82e3307a95`

Budget measurements: JS 18,238 bytes raw / 6,029 gzip; CSS 10,770 bytes raw /
3,219 gzip; poster 185,892 bytes. All are within the product budgets.

## Known limits and next steps

This remains a local CLI plus static documentation site. It has no account
system, backend tenant data, web manifest, or service worker, so service-worker
updates and offline browser reload do not apply. The offline claim applies to
the CLI and passed behind a closed proxy. No new product work is required;
publish the committed repair through the normal factory release process.
