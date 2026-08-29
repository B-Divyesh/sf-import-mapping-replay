# Independent verification 8 — PASS

Verified on 29 August 2026 against candidate commit
`8b8119aa1258febcec46fc501f010714ceb41d9c` and production
<https://import-mapping-replay.sociobot.in>.

## Verdict: PASS

The candidate fulfils the researched job: a local CLI takes a CSV and a
versioned mapping, produces transformed output plus field evidence,
validation findings, and a source-row rollback manifest. It correctly makes
clear that the manifest concerns only the local transformation and cannot undo
records already uploaded elsewhere. The deployed site is byte-identical to
the candidate build.

Product source was not modified during this verification. Only this report
and the required factory handoff were added.

## First-read and demo gates

PASS. A cold live 1440 x 900 page showed, without scrolling:

- **What it does:** “Replay CSV imports before upload.”
- **For whom:** implementation engineers preparing customer uploads.
- **What to click:** “Try it with sample data,” with the immediate outcome
  “See a finished replay and three caught errors.”

The primary action opens `/demo` in one click. The demo shows a realistic
five-row customer import, mapped value, three complete validation errors, all
four review files, and the persistent “Demo — sample data, nothing is saved”
banner with Reset demo and Start for real. `/?demo=1` also enters the isolated
demo.

The correction path that failed verification 7 now passes on both 1440 px and
390 px screens: keyboard Enter on **Fix the sample email** reduces the table
from three to two rows, removes `not-an-email`, focuses
`#demo-correction-status`, and announces “Row 5 corrected. Two validation
errors remain.” Reset restores three rows and focuses the review heading.

## Required claims

PASS — 25 of 25 registered claims passed. After `npm ci`, I ran every exact
`test` command in `.factory/claims.json` independently; the command sweep
completed through `@claim:rollback-local-scope` with exit status zero.

This covers the sample outcome and files, isolated temporary CLI demos,
offline/local-only operation, deterministic mapping transforms, collision and
atomic-write recovery, JSON output and actionable errors, source boundaries,
the £24 team kit, hosted checkout redirect, license return/storage/cache and
revocation behavior, and the declared Rust 1.85 MSRV. The manifest is present,
has 25 entries, and each declared claim test passed. There is no release
blocker from claims.

## Local quality gates and consumer package

All commands completed successfully from the clean candidate checkout:

```text
npm ci
npm test                         7 Rust tests; 60 Playwright tests
npm run typecheck
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build                    release binary and dist/site
cargo package --allow-dirty
```

I unpacked `target/package/import-mapping-replay-0.1.0.crate` into a fresh
temporary consumer root and installed it with `cargo install --path`. The
installed public binary has useful `--help`; `demo --json` created a unique
temporary directory and reported five rows, three validation errors, and four
artifacts. A normal replay wrote four non-empty review files; a valid
header-only CSV returned a valid zero-row result; and a missing source exited
1 with an actionable path error and no output artifact.

## Live deployment, headers, privacy, and rate limiting

Production matches the local candidate exactly:

| File | SHA-256 |
| --- | --- |
| `index.html` | `25bf14edcc9d011b6dcc72d605a5aba169909c9e3d919ef495b9288493d9f5ea` |
| `demo.html` | `f284f56a888026910ec169b7c8597ef940fce9be65a20cd8a6d9bda42505d49f` |
| `assets/main-SvAbbRFQ.js` | `ef7360ca0d8a7e470decd16febd9c34531aedb5d932d50e2ab4f6311f4873915` |
| `assets/main-CP8GCJAy.css` | `a62a32c367b4566de19f9e66091f7b83d9fba9141c866c380f26492f78ea0604` |
| `assets/replay-poster.webp` | `3e534cbab9801eccb9c342452c4cee7d25c48cc4ae64a0d9274e3b82e3307a95` |

`/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns
the designed page with HTTP 404. All landing-page links resolve, including
the documented checkout. Fresh GET and HEAD checkout checks return HTTP 303
to `checkout.dodopayments.com`; the earlier deployment-only checkout failure
does not reproduce.

The live demo load, correction, and reset make only same-origin requests and
leave localStorage, sessionStorage, and cookies empty. A live invalid checkout
return strips `license` while preserving `?ref=qa#team-kit`, stores only
`sb_license:import-mapping-replay` and its verdict, and sends the token only to
`https://api.sociobot.in/api/v1/products/import-mapping-replay/verify`. That
response was 200 with `Cache-Control: no-store` and the expected CORS origin.

The product unlock endpoint enforces a **30 request** single-client allowance:
requests 1–30 returned 200; requests 31–40 returned 429. The first 429 carried
`Retry-After: 3`.

HTML responses use `public, must-revalidate, max-age=30`; hashed assets use
`public, max-age=31536000, immutable`. Live responses include HSTS, `nosniff`,
strict-origin referrer policy, restrictive Permissions-Policy, and the
self-first CSP with only `https://api.sociobot.in` in `connect-src`. No
analytics, third-party fonts/scripts, runtime AI, or CLI network use was
observed. There is no sign-in, product backend, or service worker, so Entra,
backend health/persistence, and PWA update checks are not applicable.

## Accessibility, responsive behavior, and performance

`/opt/fleet/lib/verify-url.sh` passed on live home, demo, Privacy, and Terms:
each had a title, `lang=en`, exactly one h1, main landmark, image alt text,
labeled controls, and no console/page errors. Live Playwright Axe found zero
serious or critical findings on home, demo, Privacy, Terms, and 404 at both
1440 x 900 and 390 x 844.

At 390 px there was no horizontal overflow; all visible interactive controls
meet the 44 px target requirement. Keyboard Tab exposes the skip link; the
demo correction and reset focus transitions work as described above. Under
reduced motion, the tested demo snapshot has no running animation.

Bundle checks pass: JS is 22,283 bytes raw / 7,159 gzip, CSS is 13,100 / 3,689
gzip, and the 185,892-byte WebP hero is below the 300 KB budget. Live
Lighthouse 12.8.2 mobile results were Performance **98**, Accessibility
**100**, Best Practices **100**, SEO **100**; LCP **1.9 s**, CLS **0**, TBT
**110 ms**, and total transfer **194 KiB**.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
