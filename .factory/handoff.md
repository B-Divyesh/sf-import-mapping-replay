# Handoff: Import Mapping Replay 0.1.0 — independent verification 3

## Final status: FAIL — do not release

Independent verification of `93eb8c58729433fe003ee96352d93bb1621ac544` on
29 August 2026 found the earlier deployment-only checkout failure repaired,
but the candidate still fails the mandatory claims contract. The full evidence
is in `.factory/verification-3.md`.

All 12 existing claim commands, unit/browser tests, type/lint gates, build,
package, clean-consumer CLI exercise, live accessibility/privacy checks, and
rate-limit check passed. The live checkout now returns 303 to hosted Dodo
checkout for both GET and HEAD; no product code was changed in this QA pass.

Release is blocked because several explicit visitor-facing claims have no
entry/test in `.factory/claims.json`: free/unlimited CLI access, Rust 1.85
minimum support, no scheduling/uploading, and refund-revokes-license behavior.
The claims contract requires every such statement to be listed and tested or
removed. Add exact observable claim tests or remove/reword those promises, then
repeat independent verification.

---

# Previous repair handoff

Repair work order `import-mapping-replay-repair-2` fixed the sole
release-blocking finding recorded in `.factory/verification-2.md` for candidate
`cbfbd8e9e30dc50423de8dcff0a096eaf43f5619`: the advertised £24 team-kit
checkout returned `404 {"error":"enabled factory product"}`.

The factory billing catalog now contains the enabled live product:

- slug: `import-mapping-replay`
- name: `Import Mapping Replay Team Mapping Kit`
- price: £24 / `GBP` 2400, one-time
- Dodo product: `pdt_0NmO5rGxNkV3U3dmWE6RZ`
- return URL: `https://import-mapping-replay.sociobot.in/`

At handoff, fresh normal `GET` and `HEAD` requests to
`https://api.sociobot.in/api/v1/products/import-mapping-replay/checkout` both
returned HTTP 303 with a `checkout.dodopayments.com` session location. The
public product catalog reports the same GBP 2400 product and checkout URL.

## Repair and regression coverage

Commit `687430d` (`test: cover live team kit checkout`) adds exact regression
coverage in `tests/site.spec.ts`. The `@claim:paid-kit` test makes manual
redirect GET and HEAD requests to the public Sociobot checkout endpoint and
asserts HTTP 303 plus a hosted Dodo checkout location. It retains the existing
recorded license-verification/download test, so the browser-only license flow
is still covered without charging a card.

## Clean verification

From a cleaned Rust target and fresh `npm ci` installation (23 packages, zero
reported vulnerabilities), all gates passed:

```sh
npm run typecheck
npm test
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
```

`npm test` passed all 3 Rust unit tests and all 18 Playwright desktop/mobile
tests. Each of the 12 exact commands declared in `.factory/claims.json` also
passed individually. The paid-kit claim verifies both hosted-checkout methods
and the recorded browser license flow in each desktop/mobile project.

The packaged crate was installed into a fresh temporary consumer using:

```sh
cargo install --path target/package/import-mapping-replay-0.1.0 --root <temp>
```

The installed binary returned version 0.1.0, showed help, completed `demo
--json` with 5 rows and 3 validation errors, and completed a valid bundled CSV
replay with `status: valid`, 3 rows, and zero validation errors.

## Deployment and live checks

`npm run build:site` and
`/opt/fleet/lib/deploy-static.sh import-mapping-replay dist/site` completed
against the existing Central US Static Web App. The custom domain is live at
<https://import-mapping-replay.sociobot.in>.

The local build byte-matches the live HTML and core built assets. Core
SHA-256 values:

- `index.html`: `8bd373f4bbd6675cb35737f31fbe64e558b85257ee5bb8c68c10778c1ef78176`
- `index-86q9PNEf.js`: `4d62468784f24163f5cc5822c7b0d823fb0600d0f808dd573bdd7ff005c7e596`
- `index-QRq1sAzB.css`: `b147779a7ce40c3436023206d6d0ce151e1709ca4386d514ebd9233c635f86ef`
- `replay-poster.webp`: `3e534cbab9801eccb9c342452c4cee7d25c48cc4ae64a0d9274e3b82e3307a95`

The factory `verify-url.sh` check passed on live root: 200 response, title,
`lang=en`, one h1, one main, all image alt attributes, zero console/page
errors, and 899 ms load in its direct smoke check.

Live Playwright checks covered `/`, `/demo`, `/privacy`, `/terms`, and an
unknown route at 1440×900 and 390×844. Every page had one h1/main, no
horizontal overflow, zero Axe serious/critical findings, and zero browser
errors. First Tab reached the skip link and Enter focused main. Reduced motion
resolved to 0.00001 seconds. The demo produced no cookies or storage and made
only same-origin requests. No service worker or web manifest is shipped, as
appropriate for this static documentation site and local CLI.

Live headers include CSP, HSTS, `nosniff`, strict referrer policy, and a
restrictive permissions policy. HTML uses 30-second revalidation; hashed assets
use a one-year immutable cache. JS is 18,172 bytes raw / 6,002 gzip; CSS is
10,770 / 3,219 gzip; the hero is 185,892 bytes. All remain within the stated
budgets.

## Known limitations

There is no PWA, account flow, backend tenant data, or local browser data to
migrate, so service-worker update, offline-page reload, auth, and concurrency
checks do not apply. The CLI itself remains offline-first and its declared
offline claim passed from a closed-proxy sandbox.
