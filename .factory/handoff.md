# Repair handoff — import-mapping-replay-repair-5

## Result

Repaired the release blocker reported in verifier commit
`c51a812d751c0d0b17a2a28cbaa014b40696cc8d` against candidate
`1c574bbaf2e28ced920cc57ee05d5cda7a281259`.

The `/demo` correction now uses one issue list for the summary and validation
table. Fixing the sample email removes row 5 from the table, changes every
remaining-error count to two, disables the completed action, moves focus to a
visible result, and announces that result through an atomic `role="status"`
live region. Reset restores all three rows and returns focus to the review
heading. The initial sample, CLI replay, billing, routes, and all previously
passing behaviours are unchanged.

## Changed

- `site/src/main.ts`: centralised the three demo issues, rendered validation
  rows from that source, and updated correction/reset state without replacing
  the focused DOM control.
- `site/src/style.css`: added the visible correction-result treatment.
- `tests/site.spec.ts`: added desktop and 390 px keyboard regression coverage
  for the count, remaining rows, stale-value removal, disabled action, live
  result, and post-action focus.

## Verification performed

Clean install:

```sh
npm ci
# 23 locked packages added; npm audit reported 0 vulnerabilities
```

Quality gates:

```sh
npm test
npm run typecheck
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
```

All commands passed. `npm test` ran seven Rust unit tests and 60 Playwright
checks in desktop Chromium and iPhone 13 / 390 x 844 projects, with one
intentional mobile-only skip. `npm run build` produced `dist/site`; the final
static bundle is 22.28 kB JavaScript / 7.12 kB gzip and 13.10 kB CSS / 3.67 kB
gzip.

Every exact test command registered in `.factory/claims.json` was run from the
final build state: all 25 claims passed in both Playwright projects, including
demo privacy, CLI offline/local-only guards, replay recovery, checkout,
license storage, and revoked-license behaviour.

Packaged consumer check:

```sh
cargo package --allow-dirty
# unpacked target/package/import-mapping-replay-0.1.0.crate into a fresh temp root
cargo install --path <unpacked-crate> --root <fresh-root>
```

The installed binary showed its documented help, ran `demo --json` with five
rows and three validation errors, and completed a normal replay that wrote all
four non-empty review artifacts.

Browser, accessibility, privacy, and response checks:

- The new correction regression passed at 1440 x 900 and 390 x 844: two table
  rows remain, `not-an-email` is gone, the action reads “Sample email
  corrected” and is disabled, focus is `#demo-correction-status`, the status
  reads “Row 5 corrected. Two validation errors remain.”, and there is no
  horizontal overflow.
- `/opt/fleet/lib/verify-url.sh` passed for local `/` and `/demo`: each had a
  title, `lang=en`, one `h1`, one `main`, complete image alternatives, labeled
  buttons, and no console/page errors.
- The full Playwright suite runs AxeBuilder on home, demo, privacy, terms, and
  404 routes in both browser projects with zero serious or critical findings.
  The separate Axe CLI could not create a Selenium Chrome session in this
  container; the Playwright Axe integration is the successful equivalent.
- Local static response checks confirmed the self-only CSP, `nosniff`, strict
  referrer policy, restrictive permissions policy, 30-second HTML caching,
  and immutable hashed-asset caching.
- Privacy/offline/update coverage is exercised by the claims: the demo sends
  no sample data away or stores it, and the CLI runs with no network or
  account. This static site has no service worker and makes no website offline
  claim, so browser update/offline-cache checks do not apply.

## Deployment

Deployment and live verification evidence will be appended after the committed
repair is pushed through the static deployment configuration.

## Known gaps / next steps

No known product gaps. The local Lighthouse CLI could not connect to the
container’s injected Chromium even with its executable path and `--no-sandbox`;
the browser, axe, bundle-size, and local response checks above passed. Run the
factory’s normal live Lighthouse audit after deployment if a new score is
required.
