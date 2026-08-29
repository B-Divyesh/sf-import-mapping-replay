# Repair 7 handoff — PASS

Completed 29 August 2026 for work order
`import-mapping-replay-repair-7`. This repair starts from independent
verification report commit `0648ff17e9f2096e41c10c1e6c5b12666954e864`, which
tested candidate `fb8805a3cba37612ff650bc593fb243ecebf0be4`.

Product repair commit: `cd1d12324ecfec0fffee519810db0842c87d9f1c`.

Deployment: Static Web App `sf-import-mapping-replay`, deployment ID
`8e5564e0-afad-4ba7-a1b5-6e03a1cfcb11`, serving
<https://import-mapping-replay.sociobot.in>.

## Fixed release blockers

1. **Checkout-return verdict reuse** — license verdicts now include the token
   they describe. Legacy, malformed, and different-token verdicts are removed.
   A returned `?license=` always forces one fresh Sociobot verification before
   it can show the team kit. `@claim:license-return-token-binding` tests both
   reported failures: old-valid/new-invalid stays locked and
   old-invalid/new-valid unlocks, each after exactly one request for the new
   token. The same two transitions passed again against production with
   intercepted, recorded responses.
2. **Malformed email domains** — the version 1 `email` rule now supports one
   ASCII local part and dot-separated domain labels, and rejects empty,
   leading-dot, trailing-dot, and repeated-dot labels. `a@.com`,
   `a@example.`, and `a@b..com` produce three review issues and exit 2;
   supported addresses remain valid. The Rust unit regression and
   `@claim:email-domain-validation` cover this observable CLI result.
3. **Stale stable-image cache** — `/assets/replay-poster.webp` and
   `/assets/og-replay.webp` now use
   `Cache-Control: public, max-age=0, must-revalidate`. Hashed JavaScript and
   CSS remain one-year immutable. `@claim:site-routing-headers` verifies both
   policies through the Static Web Apps emulator; production headers match.

## Verification

Clean install and local quality gates all passed:

```sh
npm ci
npm test
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package
cargo +1.85.0 check --locked
```

- `npm test`: 9 Rust unit tests passed; 76 Playwright checks passed across
  desktop and 390 px mobile, with 2 intentional single-project skips.
- Every one of the 33 exact commands in `.factory/claims.json` passed from the
  committed clean workspace, including the new email and checkout-return
  claims.
- `cargo package` verified the release archive. A fresh consumer extracted the
  `.crate`, installed it with `cargo install --path`, and passed `--version`,
  `--help`, `demo --json`, valid replay, invalid replay (exit 2), and all four
  non-empty artifact checks.
- The built site has 7.33 kB gzip JavaScript, 3.67 kB gzip CSS, and a 185,892
  byte hero WebP. The static deployment upload was 385,793 bytes.
- The Playwright suite exercises keyboard focus and skip-link behavior,
  desktop and mobile target sizes, local axe checks, demo isolation, no-network
  CLI operation, reduced motion, history, and route metadata.

## Live verification

Evidence is ignored under `.factory/evidence/repair-7/live/`.

- `/opt/fleet/lib/verify-url.sh` passed: HTTPS 200, 873 ms load, no console
  errors, title, `lang=en`, one h1, main landmark, image alt text, and named
  buttons.
- `node tests/live-audit.mjs …` passed all six routes on desktop and 390 px
  mobile: 12 axe scans had zero violations, no horizontal overflow, designed
  404 responses remained HTTP 404, keyboard/history checks passed, and no
  route produced a console error.
- Direct production demo used only same-origin requests and left demo storage
  empty. A cold demo has no cookies, session storage, Cache Storage, or service
  worker registrations. The local CLI’s offline/no-network claims passed; this
  static documentation site intentionally has no PWA update path or offline
  reload claim.
- Production CSP, HSTS, `nosniff`, strict-origin referrer policy, permissions
  policy, and short HTML revalidation headers are present. The only allowed
  external connection is the optional Sociobot license verification endpoint.
- Built/live SHA-256 values matched for `/`, `/demo`, `/privacy`, `/terms`,
  `/404`, the JavaScript bundle, CSS bundle, and both WebP files. Stable images
  returned the revalidating policy; hashed JS/CSS returned immutable caching.
- Lighthouse 12.8.2 mobile: **100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO**. FCP 0.9 s, LCP 1.9 s, TBT 60 ms, CLS 0, transfer 194
  KiB.

## Known gaps and next steps

None. This remains the requested Rust CLI plus static Vite documentation/demo
site. Runtime AI is intentionally absent because deterministic local mapping
replay does not benefit from it. The factory owns any future registry release;
the ready-to-publish verification command is `cargo package`.
