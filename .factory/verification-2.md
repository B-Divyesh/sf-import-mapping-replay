# Independent verification 2 — FAIL

Verified on 28 August 2026 against candidate
`cbfbd8e9e30dc50423de8dcff0a096eaf43f5619` and
<https://import-mapping-replay.sociobot.in>.

## Verdict: FAIL — release blocked

The live **Buy the team kit** link is broken. A fresh normal GET and HEAD to
the required Sociobot URL
`https://api.sociobot.in/api/v1/products/import-mapping-replay/checkout`
both returned HTTP 404, no redirect, with:

```json
{"error":"enabled factory product","status":404}
```

The landing page advertises a £24 one-time purchase, but a customer cannot
enter checkout. Enable/register the `import-mapping-replay` product in
Sociobot billing, or remove the paid offer, then retest this live URL. This is
a deployment/billing registration failure; no product code was changed.

## Required claims and local gates

From the clean candidate checkout, `npm ci` installed 23 packages with zero
reported vulnerabilities. Every exact command in `.factory/claims.json` passed
when run individually before the rest of QA:

| Claim | Result |
| --- | --- |
| `demo-errors` | PASS |
| `review-files` | PASS |
| `demo-private` | PASS |
| `cli-offline` | PASS |
| `demo-temp` | PASS |
| `cli-replay` | PASS |
| `mapping-v1` | PASS |
| `source-unchanged` | PASS |
| `json-output` | PASS |
| `actionable-errors` | PASS |
| `paid-kit` | PASS (recorded response only; it does not prove live checkout) |
| `license-privacy` | PASS |

`npm test` passed all 3 Rust unit tests and 18 Playwright project tests.
`npm run typecheck`, `cargo fmt --check`, `cargo clippy --all-targets -- -D
warnings`, `npm run build`, and `cargo package --allow-dirty` all passed.

A fresh temporary consumer installed the packaged 0.1.0 crate with `cargo
install --path target/package/import-mapping-replay-0.1.0 --root <temp>`.
Its `--version`, `--help`, and `demo --json` commands worked. A valid replay
produced all four artifacts with the source hash unchanged; `--sample 0`
produced zero evidence fields. The invalid sample exited 2 with three errors;
an unwritable output directory exited 1 with an actionable error.

## Product and live checks

- Cold first read passed: the first screen says what the CLI does, names
  implementation engineers, and gives the one-click **Try it with sample
  data** action with its result. `/demo` presents the sample, three errors,
  four review files, and the persistent no-save banner.
- The local production build byte-matches live `index.html`, JS, CSS, hero,
  and OG image. Core hashes: HTML
  `8bd373f4bbd6675cb35737f31fbe64e558b85257ee5bb8c68c10778c1ef78176`, JS
  `4d62468784f24163f5cc5822c7b0d823fb0600d0f808dd573bdd7ff005c7e596`, CSS
  `b147779a7ce40c3436023206d6d0ce151e1709ca4386d514ebd9233c635f86ef`.
- At desktop 1440×900 and mobile 390×844, `/`, `/demo`, `/privacy`, `/terms`,
  and an unknown route had `lang=en`, exactly one main and h1, no horizontal
  overflow, no browser errors, and zero Axe serious/critical violations.
  First Tab reaches the visible 3 px Skip-to-main focus ring; Enter focuses
  main. Reduced motion sets animation/transition duration to 0.00001s.
- Demo requests stayed same-origin, with no cookies or localStorage. Source
  review found no telemetry or CLI network client. The only runtime external
  request is optional Sociobot license verification, explicitly allowed by CSP.
- Response policies: CSP, HSTS, nosniff, strict referrer policy, and restrictive
  permissions policy are live. HTML has 30-second revalidation and hashed
  assets are one-year immutable. JS is 18,172 bytes raw / 5,994 gzip; CSS is
  10,770 / 3,215; hero is 185,892 bytes: all within budget.
- Rate-limit burst: 40 invalid license verification GETs yielded 30 HTTP 200
  and 10 HTTP 429 responses. Each 429 had `Retry-After: 4`; observed threshold
  was 30 successful requests in the concurrent burst window.
- No sign-in, PWA, or product backend exists, so tenant, service-worker,
  persistence, and backend concurrency checks do not apply. Lighthouse was
  attempted but the only available Playwright Chromium crashed under its
  launcher; no Lighthouse score is claimed.

## Defects by severity

### Critical

Live paid checkout returns 404, preventing the only advertised purchase flow.

### Non-blocking limitation

No Lighthouse score was obtainable in this container; direct browser,
accessibility, responsive layout, bundle-budget, headers, and error checks
passed.
