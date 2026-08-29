# Polish round 3 handoff — PASS

## Delivered

The repair at `7cb152580d3ecdefd9d1b2450b3caab33522c10d` removes every
unproved merchant, payment, refund, and refund-revocation statement. It also
creates each CLI demo directory atomically with process, nanosecond, and
sequence entropy, retries collisions, and proves isolation with concurrent
demo runs.

The verified static build was deployed as Azure Static Web Apps deployment
`5b756fb3-4a8d-4c5f-8bd8-2a7224407fa4` at
<https://import-mapping-replay.sociobot.in>.

`.factory/polish-3.md` maps every finding from reviews 1–3 to its change and
evidence. The catalog line is verb-first and 70 characters:
“Replay CSV imports into an output file and error report before upload.”

## How to run and verify

```sh
npm ci
npm test
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
npm run build
```

For the CLI sample, run `cargo run -- demo`. For the isolated web sample, open
`/demo` or `/?demo=1`; the banner supplies Reset demo and Start for real.

## Exact evidence

- Fresh GitHub clone at `7cb152580d3ecdefd9d1b2450b3caab33522c10d`: `npm ci`,
  then all 25 exact `.factory/claims.json` test commands independently with
  fail-fast completion. Result: 25/25 passed.
- Local `npm test`: 7 Rust tests and 58 Playwright checks passed.
- `npm run typecheck`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`,
  `cargo package --allow-dirty`, and `npm run build` passed. Build output is
  `dist/site`; initial assets are 6,814 B gzip JS and 3,646 B gzip CSS.
- Local Lighthouse: performance 98, accessibility 100, best practices 100,
  SEO 100; LCP 2.2 s, CLS 0, TBT 50 ms.
- Live `/opt/fleet/lib/verify-url.sh` passed: title present, `lang=en`, one h1,
  main landmark, complete alt text, labeled buttons, and no application console
  errors. Live Playwright Axe has zero violations on all five routes.
- Live cold audit confirmed 200s for `/`, `/demo`, `/privacy`, `/terms`; 404s
  for `/404` and an unknown route; per-route metadata; mobile Privacy target;
  one-click `?demo=1`; demo reset/focus/isolation; and Back scroll restoration.
- Live checkout GET and HEAD each return 303 to `checkout.dodopayments.com`.
  The landing, Privacy, and Terms pages contain only this observable checkout
  behavior and no merchant, payment-data, refund, or refund-revocation claim.
- A release run of 80 simultaneous CLI demos produced 80 unique temporary
  directories with 80 complete artifact sets.

Evidence files are in `.factory/evidence/polish-3/` for this work order.

## Known gaps and next steps

None. The product has no unresolved review finding. The factory owns future
release publishing and deployment.
