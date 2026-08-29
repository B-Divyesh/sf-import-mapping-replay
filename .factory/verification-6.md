# Independent verification 6 — PASS

Verified on 29 August 2026 against candidate commit
`6527445ba1c882dea9f19d48f21a5a1a423d177b` and
<https://import-mapping-replay.sociobot.in>.

## Verdict: PASS

The candidate performs the researched job end to end. The Rust CLI replays a
versioned local CSV mapping, writes a deterministic output CSV, field evidence,
validation results, and a source-row rollback manifest. It catches review
errors without implying that the manifest can undo an upload to another
product. The free core needs no account or license.

The previously reported deployment-only checkout failure is not present.
Fresh GET and HEAD requests returned HTTP 303 to
`checkout.dodopayments.com`. The live deployment byte-matches this candidate.

One low-severity concurrency defect was found in the optional CLI demo. It does
not block the normal demo or the replay workflow and is documented below.

## Mandatory first-read and demo gate

A cold browser context at 1440 x 900 showed all required information in the
first viewport:

- What it does: **“Replay CSV imports before upload.”**
- Who it is for: implementation engineers who need a reviewed output CSV and
  error report before a customer upload.
- What to click first: **“Try it with sample data.”** The adjacent text says it
  shows a finished replay and three caught errors.

The same content and action fit the first 390 x 844 viewport. The action opened
`/demo` in one click. The resulting screen already showed a before/after email,
a complete validation issue, five source rows, three errors, and all four
review files. The persistent banner said “Demo — sample data, nothing is
saved” and exposed **Reset demo** and **Start for real**. This gate passes.

## Required claims — 25 of 25 pass

The checkout started clean at the candidate commit. `npm ci` installed 23
packages and reported zero vulnerabilities. Before the broader review, every
exact `test` command in `.factory/claims.json` was run separately. Each command
passed both Playwright projects as well as the seven Rust tests invoked by the
script.

| Claim ID | Result |
| --- | --- |
| `demo-errors` | PASS |
| `demo-row-count` | PASS |
| `recorded-cli-sample` | PASS |
| `review-files` | PASS |
| `demo-private` | PASS |
| `cli-offline` | PASS |
| `cli-local-only` | PASS |
| `demo-temp` | PASS |
| `cli-replay` | PASS |
| `mapping-v1` | PASS |
| `source-unchanged` | PASS |
| `atomic-artifacts` | PASS |
| `json-output` | PASS |
| `actionable-errors` | PASS |
| `paid-kit` | PASS |
| `checkout-redirect` | PASS |
| `license-return-storage` | PASS |
| `license-url-stripping` | PASS |
| `license-privacy` | PASS |
| `website-license-storage-only` | PASS |
| `license-cache-day` | PASS |
| `core-no-license` | PASS |
| `rust-msrv` | PASS |
| `revoked-license-lock` | PASS |
| `rollback-local-scope` | PASS |

Every claim ID occurs exactly once as a test tag. A manual cross-check of the
live copy, README, privacy page, terms, and `.factory/copy-audit.md` found no
unlisted material claim.

## Clean local gates and package consumer

All repository checks passed:

```text
npm test                                  7 Rust passed; 57 Playwright passed; 1 intentional mobile skip
npm run typecheck                         passed
cargo fmt -- --check                      passed
cargo clippy --all-targets -- -D warnings passed
npm run build                             passed; release binary and dist/site produced
cargo package --allow-dirty               passed; package verification build passed
```

The crate was installed from
`target/package/import-mapping-replay-0.1.0` into a new Cargo root. The
installed binary reported version 0.1.0 and useful `--help`. Its `demo --json`
returned five rows, three validation errors, a new temporary location, and
four existing artifacts.

Independent consumer cases:

- Normal: three valid rows returned exit 0 and `valid`; the source SHA-256 was
  unchanged and all four artifacts were present.
- Sampling boundary: `--sample 0` produced zero evidence fields while retaining
  all three output and rollback rows.
- Empty-data boundary: a header-only CSV returned a valid zero-row output with
  all four artifacts.
- Common CSV boundary: a UTF-8 BOM header was accepted and replayed correctly.
- Validation and recovery: a custom three-row input exercised trim, upper/lower
  case, replacement, default, date, required, email, one-of, and unique rules.
  The first run exited 2 with four precise issues. Correcting the source and
  rerunning into the same directory exited 0, replaced all four artifacts, and
  reported zero errors.
- Fatal input: a missing source and a version-2 mapping each exited 1 with an
  actionable message. Fatal `--json` errors remain human-readable on stderr;
  successful and review-required runs are JSON.
- Safety: the authored and independent tests confirmed source/mapping output
  collisions are rejected, malformed later rows publish nothing, and a failed
  rerun preserves an earlier complete replay byte-for-byte.

## Live deployment identity

The exact production build and live files have matching SHA-256 values:

| File | SHA-256 |
| --- | --- |
| `index.html` | `113c292919d9f015689b2a8b9e9b0ea886e30cb45533263c4107c630d97b4a69` |
| `demo.html` | `0391a57f0361593092aaaddb3466bf6f82dbbe41fe573c97621e2e67fc9f520b` |
| `privacy.html` | `e17a596672ad30e71f0d94997eefc98ee57c60915bc0d6f3cfb8a2d23c01f757` |
| `terms.html` | `46cf4ebfe965a6f25dab8e784a175d9b44352b4ede6343fb92f4ee5624ec73a9` |
| `404.html` | `5cdf72fcb7d5b7746e8132f25468a6d38b3ad3ff1f8b5f4c99db4447fa41e894` |
| `assets/main-DflpbkrJ.js` | `1e57be58798019b36c52ef58399be06b127677c4ce60937c0c63e6896125e9c0` |
| `assets/main-l53q5lpH.css` | `81fe0b14e446ef50e4e764044f61cbf19c0f205534f758d209445ac1c9851bce` |
| `assets/replay-poster.webp` | `3e534cbab9801eccb9c342452c4cee7d25c48cc4ae64a0d9274e3b82e3307a95` |
| `assets/og-replay.webp` | `10e51eb88670f6d724309e703681f56c8a03c9c93e12a47e6b0e2e29e02a6189` |

## Live UX and accessibility

Fresh Playwright contexts exercised `/`, `/demo`, `/privacy`, `/terms`, and an
unknown route at 1440 x 900 and 390 x 844.

- Public routes returned 200; the styled unknown route returned a real 404.
- Each route had `lang=en`, its own plain title, exactly one `h1`, one `main`,
  ordered headings, and no horizontal overflow.
- Images loaded with meaningful alt text. No third-party font or script loaded.
- Axe found zero serious or critical findings on every route and viewport.
- Every visible mobile link, button, and input was at least 44 x 44 CSS pixels.
- The first Tab reached the skip link with a visible 3 px focus outline; Enter
  focused `main`. A 30-step tab traversal wrapped without a trap.
- On mobile, keyboard activation fixed the sample and reduced the error count
  from three to two. Keyboard Reset restored three and moved focus to the
  replay-result heading.
- `prefers-reduced-motion: reduce` left no active animation or transition.
- A 200% root text-size check at 390 px retained all content and controls with
  no horizontal overflow.
- There were no console or page errors on the four product routes. Chromium
  logs the expected failed-resource diagnostic for the top-level 404 response.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, title, `lang`, one `h1`, a
  main landmark, complete alt text, labeled buttons, and zero console errors.

## Privacy, billing, rate limit, and response policy

A complete fresh `/demo` flow (load, fix, reset) requested only its document,
same-origin JS, and same-origin CSS. It left localStorage, sessionStorage,
cookies, IndexedDB, and Cache Storage empty. Source review found no analytics,
telemetry, service worker, runtime AI, or CLI networking dependency.

The optional live license return was tested with an invalid token. The site:

- stored `sb_license:import-mapping-replay` and its verdict only;
- removed `license` while preserving `?ref=checkout#team-kit`;
- sent the token only to the Sociobot product verification endpoint;
- displayed the inactive-license recovery message and kept the download locked.

Fresh GET and HEAD checkout requests returned HTTP 303 to
`checkout.dodopayments.com`. A concurrent burst of 40 invalid license checks
from one client produced 30 HTTP 200 responses and 10 HTTP 429 responses.
Every 429 included `Retry-After: 3`. The observed allowance is 30
verification requests per window.

Live responses include a matching self-first CSP, HSTS, `nosniff`, strict
referrer policy, and a restrictive permissions policy. HTML uses
`public, must-revalidate, max-age=30`; hashed assets use one-year immutable
caching. All internal links returned their intended 200/404 statuses, the
factory link returned 200, and checkout returned its intended 303.

There is no product backend, sign-in, or PWA. Backend persistence/health,
Entra-authority, and service-worker update checks are therefore not applicable.

## Performance

Mobile Lighthouse 12.8.2 against the live root reported:

- performance 98;
- accessibility 100;
- best practices 100;
- SEO 100;
- LCP 1.881 s, CLS 0, TBT 139 ms;
- total transfer 198,491 bytes.

Production assets remain inside contract budgets: JavaScript is 21,493 bytes
raw / 6,890 gzip, CSS is 12,910 / 3,646 gzip, the hero WebP is 185,892 bytes,
and there are no font files.

## Defects by severity

### Low — simultaneous CLI demos can share a millisecond temp name

Forty `demo --json` processes launched simultaneously produced 39 successful
unique demos and one exit-1 failure:

```text
Error: source column "Customer ID" is missing; check the CSV header or mapping
```

`demo` names its directory from the current millisecond and uses
`create_dir_all`, so two processes can share a directory and race while writing
the bundled source and mapping. This does not affect ordinary sequential demo
use or `run`, writes only disposable sample data, and recovers by rerunning.
Use an atomic unique-temp primitive or add PID/random entropy in a later patch.

No release-blocking defect was found.
