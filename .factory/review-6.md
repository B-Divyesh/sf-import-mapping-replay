# Adversarial first-read review 6 — FAIL

Reviewed 29 August 2026 against live
`https://import-mapping-replay.sociobot.in`, candidate
`4a2aedfdb1901ff7b42379f59ab4c83ed1951dd4`, and a fresh local clone. This
was a full review, not a diff review.

## Verdict: FAIL

There is one finding. It is not a broken core flow, but PASS requires zero
findings and no untested claim. The landing page exposes one paid-license
fallback promise that is absent from `.factory/claims.json` and from tagged
claim coverage.

## Finding

### F-6-1 — Medium — The cached-license fallback is an unlisted claim

**Exact location and quote:** Landing page, dynamic license status after a
previously valid cached result is older than 24 hours and verification is
unavailable: **“Using the last valid check while verification is
unavailable.”** The **Download team kit** action remains visible in this
state.

**Evidence:** In a fresh live browser context, I seeded only a license and an
aged valid verdict, returned HTTP 503 from the Sociobot verification endpoint,
and loaded `/`. The quoted status appeared and **Download team kit** remained
available. The phrase appears in `site/src/main.ts`, but not in
`.factory/claims.json` or any test. `@claim:license-cache-day` proves successful
rechecks before and after 24 hours. `@claim:revoked-license-lock` proves an
explicit invalid response locks the kit. Neither test covers verification
failure with an aged valid result.

**Why this matters:** A buyer can rely on this sentence when deciding whether
paid files remain available during a verification outage. Copy presence and
working behavior do not replace the required registered outcome test.

**Concrete fix:** Add a claim such as `license-unavailable-fallback`: **“If
license verification is unavailable, the last valid result keeps the team kit
available.”** Add exactly one tagged test that seeds an aged valid result,
returns a failed verification response, and asserts the status plus download
availability. If that fallback is not intended, hide the kit on failure and
replace the sentence with a neutral error that does not promise continued
access.

## Cold first read

I opened `/` in fresh 390 × 844 and 1440 × 900 contexts and recorded this
before scrolling:

- What it does: a local CLI replays a customer CSV mapping before upload and
  produces a reviewed output CSV plus an error report.
- Who it is for: implementation engineers preparing customer imports.
- What to click first: **Try it with sample data**.

The exact first-screen copy that supplied those answers was **“Replay CSV
imports before upload”**, **“For implementation engineers who need a reviewed
output CSV and error report before each customer upload”**, and **“Try it with
sample data.”** The privacy, offline, and price facts also fit both first
screens. There was no horizontal overflow or application console error. This
section is not blocking.

## Copy audit

Counts use whitespace-separated words. Headings, controls, labels, terminal
fragments, alt text, and dynamic states are included because a visitor reads
or hears them. Shell commands and JSON examples are not sentences and are not
counted. No item exceeds 22 words. There is no banned marketing adjective,
inconsistent product term, mood heading, metaphor heading, or non-result
action. CLI, CSV, JSON, hashes, exit codes, and Rust fit the explicitly named
implementation-engineer audience. F-6-1 is a claim-inventory flag, not a
plain-language defect.

### Landing page: every sentence and meaningful fragment

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Header | Import Mapping Replay | 3 | Pass |
| Header | Demo / How it works / Privacy | 1 / 3 / 1 | Pass |
| Hero label | Local CSV replay | 3 | Pass |
| H1 | Replay CSV imports before upload | 5 | Pass |
| Hero | For implementation engineers who need a reviewed output CSV and error report before each customer upload. | 16 | Pass |
| Action | Try it with sample data | 5 | Pass |
| Action result | See a finished replay and three caught errors. | 8 | Pass: `demo-errors` |
| Fact | CSV files stay on your computer. | 6 | Pass: `cli-local-only` |
| Fact | The CLI runs without internet. | 5 | Pass: `cli-offline` |
| Fact | The core CLI needs no license. | 6 | Pass: `core-no-license` |
| Fact | The team kit costs £24 once. | 6 | Pass: `paid-kit` |
| Image alt | A CSV ticket passes through three mapping rails and becomes an ordered manifest. | 13 | Pass |
| Preview label | Recorded from the bundled CLI | 5 | Pass: `recorded-cli-sample` |
| H2 | See the failed rows before upload | 6 | Pass |
| Preview | The sample replay transforms five customers and writes four review files. | 11 | Pass: `demo-row-count`, `review-files` |
| Preview | It catches three source errors. | 5 | Pass: `demo-errors` |
| Terminal label | Recorded terminal run with sample data | 6 | Pass |
| Terminal bar | local terminal · sample run | 5 | Pass |
| Terminal | Replay complete: 5 source rows | 5 | Pass: `demo-row-count` |
| Terminal | Validation: 3 errors — review required | 6 | Pass: `demo-errors` |
| Terminal | row 5 · email · not-an-email | 6 | Pass |
| Terminal | Value is not an email address; correct it. | 8 | Pass |
| Terminal | row 6 · external_id · C-1043 | 6 | Pass |
| Terminal | Value already appears on source row 3; make it unique. | 10 | Pass |
| Terminal | row 6 · plan · legacy | 6 | Pass |
| Terminal | Value is not allowed; use starter, growth, or enterprise. | 9 | Pass |
| Terminal | Wrote output.csv, evidence.json, validation.json, rollback-manifest.json | 5 | Pass: `review-files` |
| Button | Show the sample replay again | 5 | Pass |
| Artifact label | Files written by the sample run | 6 | Pass |
| Artifact | output.csv / Mapped rows | 1 / 2 | Pass |
| Artifact | evidence.json / Before and after | 1 / 3 | Pass |
| Artifact | validation.json / Three issues | 1 / 2 | Pass |
| Artifact | rollback-manifest.json / Original rows | 1 / 2 | Pass |
| Process label | How the replay works | 4 | Pass |
| H2 | Replay an import in three steps | 6 | Pass |
| H3 | Map the columns | 3 | Pass |
| Step | Name each source and target field in a version 1 JSON file. | 12 | Pass: `mapping-v1` |
| H3 | Run the local CLI | 4 | Pass |
| Step | Apply trim, case, replacement, and date rules without uploading the CSV. | 11 | Pass: `mapping-v1`, `cli-local-only` |
| H3 | Review the evidence | 3 | Pass |
| Step | Check row errors, before-and-after values, hashes, and untouched source rows. | 10 | Pass: `cli-replay`, `source-unchanged` |
| Install label | Install locally | 2 | Pass |
| H2 | Build one binary | 3 | Pass |
| Install | This package declares Rust 1.85 as its minimum compiler. | 9 | Pass: `rust-msrv` |
| Install | No account is required. | 4 | Pass: `cli-offline` |
| H3 | What the CLI does not do | 6 | Pass |
| Limit | It does not connect to a customer system. | 8 | Pass: `cli-local-only` |
| Limit | It processes a source CSV when you run the command. | 10 | Pass: `cli-replay` |
| Limit | It does not change a source CSV. | 7 | Pass: `source-unchanged` |
| Limit | A rollback manifest cannot undo records imported elsewhere. | 8 | Pass: `rollback-local-scope` |
| Instruction | Keep the source CSV, mapping, and review files together for each customer upload. | 13 | Pass |
| Price label | Optional team kit | 3 | Pass |
| H2 | Standardise the review handoff | 4 | Pass |
| Price intro | The core CLI needs no license. | 6 | Pass: `core-no-license` |
| Price intro | The team kit adds mapping recipes and a sign-off checklist. | 10 | Pass: `paid-kit` |
| Kit item | Five named mapping recipes for common template fields. | 8 | Pass: `paid-kit` |
| Kit item | A review checklist with upload owner and second-engineer approval fields. | 10 | Pass: `paid-kit` |
| Price card | Team mapping kit / £24 / One-time purchase. | 3 / 1 / 2 | Pass: `paid-kit` |
| Checkout | Checkout opens through Sociobot on Dodo Payments. | 7 | Pass: `checkout-redirect` |
| Action | Buy the team kit / at hosted checkout | 4 / 3 | Pass |
| License | A revoked license locks the team kit. | 7 | Pass: `revoked-license-lock` |
| Form | Have a license? / Paste it here / Verify license | 3 / 3 / 2 | Pass |
| Empty status | The core CLI does not need a license. | 8 | Pass: `core-no-license` |
| Form error | Paste a license token, then verify it. | 7 | Pass |
| Pending status | Checking the license… | 3 | Pass |
| Valid status | License active. / The team kit is ready. | 2 / 5 | Pass: `paid-kit`, `license-privacy` |
| Invalid status | License no longer active. / Check the token or buy the team kit. | 4 / 8 | Pass: `revoked-license-lock` |
| Network error | The license could not be checked. / Check your connection and try again. | 6 / 6 | Pass |
| Cached state | Using the last valid check while verification is unavailable. | 9 | **F-6-1** |
| Download panel | Your team kit is ready on this device. / Download team kit | 8 / 3 | Pass: `paid-kit` |
| Legal prompt | Read the privacy notice and terms. | 6 | Pass |
| Footer | Replay local CSV mappings with review evidence. | 7 | Pass |
| Footer | Privacy / Terms / Built by Param Factory / external site | 1 / 1 / 4 / 2 | Pass |
| Footer | Version 0.1.0 · build 2026.08.29 | 5 | Pass |

### README: every prose sentence and meaningful fragment

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| H1 | Import Mapping Replay | 3 | Pass |
| Intro | Replay customer CSV imports from one reviewed mapping file. | 9 | Pass: `cli-replay` |
| Intro | The CLI writes an output CSV, field evidence, validation results, and original source rows. | 14 | Pass: `cli-replay`, `review-files` |
| Intro | It is for implementation engineers who prepare repeatable template uploads. | 10 | Pass |
| Intro | It does not connect to a customer system or undo records already imported elsewhere. | 14 | Pass: `cli-local-only`, `rollback-local-scope` |
| H2 | Try the bundled sample | 4 | Pass |
| Demo | The command copies a realistic customer CSV and mapping into a new temporary directory. | 14 | Pass: `demo-temp` |
| Demo | It runs the replay and prints every output path. | 9 | Pass: `demo-temp`, `review-files` |
| H2 | Install | 1 | Pass |
| Install | This package declares Rust 1.85 as its minimum compiler. | 9 | Pass: `rust-msrv` |
| Install | Install from this source checkout. | 5 | Pass |
| Install | Run cargo package to check the release archive. | 8 | Pass |
| H2 | Run a CSV replay | 4 | Pass |
| Run | Add --json for machine-readable command output. | 6 | Pass: `json-output` |
| Run | A run writes: | 3 | Pass: `review-files` |
| Artifact | output.csv: rows in the mapping's declared column order. | 8 | Pass: `cli-replay` |
| Artifact | evidence.json: source and output hashes plus before/after samples. | 8 | Pass: `cli-replay` |
| Artifact | validation.json: every validation issue with its source row. | 8 | Pass: `cli-replay` |
| Artifact | rollback-manifest.json: the original source rows and source hash. | 8 | Pass: `cli-replay` |
| Run | The rollback manifest reconstructs input to this local transformation. | 9 | Pass: `cli-replay` |
| Run | It cannot undo records already uploaded to another product. | 10 | Pass: `rollback-local-scope` |
| H3 | Mapping format | 2 | Pass |
| Mapping | Mappings have a stable integer version. | 6 | Pass: `mapping-v1` |
| Mapping | Version 1 maps named source columns to target columns in declaration order. | 12 | Pass: `mapping-v1` |
| Mapping | Version 1 transforms are trim, lowercase, uppercase, replace, and date. | 10 | Pass: `mapping-v1` |
| Mapping | Validation rules are required, email, one_of, and unique. | 8 | Pass: `mapping-v1` |
| Mapping | A field may use default when its source cell is empty. | 11 | Pass: `mapping-v1` |
| Error | Missing mapped columns return exit code 1 and say to check the CSV header or mapping. | 16 | Pass: `actionable-errors` |
| Error | Validation failures return exit code 2 after writing review files. | 10 | Pass: `cli-replay` |
| Safety | The CLI rejects a source or mapping that resolves to an output artifact. | 12 | Pass: `source-unchanged` |
| Safety | It builds all four artifacts in a staging directory and publishes them only after the full replay succeeds. | 17 | Pass: `atomic-artifacts` |
| Safety | A malformed later row leaves no partial artifact. | 8 | Pass: `atomic-artifacts` |
| Safety | If a complete replay already exists, a failed rerun leaves all four prior files unchanged. | 15 | Pass: `atomic-artifacts` |
| H2 | Develop and verify | 3 | Pass |
| Build | npm run build creates the release binary and the static site in dist/site. | 13 | Pass: `build-artifacts` |
| Demo | The site demo is available at /demo or /?demo=1 and uses only bundled sample data. | 15 | Pass: `demo-private` |
| H2 | Deploy | 1 | Pass |
| Deploy | Deploy dist/site to Azure Static Web Apps. | 7 | Pass |
| Deploy | Its configuration serves known routes, returns the custom 404 for unknown URLs, and sets security headers. | 16 | Pass: `site-routing-headers` |
| Deploy | Production site: import-mapping-replay.sociobot.in | 3 | Pass: label |
| H2 | Privacy and price | 3 | Pass |
| Privacy | CSV processing runs in the local binary. | 7 | Pass: `cli-replay` |
| Privacy | The CLI makes no network requests while replaying a CSV. | 10 | Pass: `cli-local-only` |
| Privacy | The website stores only a pasted license and its last verification result in your browser. | 14 | Pass: `website-license-storage-only` |
| Privacy | See the site’s /privacy and /terms pages. | 7 | Pass |
| Price | The core CLI needs no license. | 6 | Pass: `core-no-license` |
| Price | A one-time £24 license provides five named mapping recipes and a checklist with upload owner and second-engineer approval fields. | 19 | Pass: `paid-kit` |
| Checkout | The buy link opens Dodo Payments checkout through Sociobot. | 9 | Pass: `checkout-redirect` |
| Checkout | After checkout, the site stores the returned license in localStorage, removes it from the address bar, and verifies it with Sociobot. | 21 | Pass: `license-return-storage`, `license-url-stripping`, `license-privacy` |
| H2 | License | 1 | Pass |
| License | MIT. | 1 | Pass: `mit-license` |
| License | See LICENSE. | 2 | Pass |

Terminology is consistent: **source CSV**, **mapping**, **replay**, **output
CSV**, **evidence**, **rollback manifest**, **customer system**, **team kit**,
and **license** each have one meaning. The catalog description is verb-first,
contains 83 characters, and has no marketing word.

## Demo and sandbox

The main demo contract passes. **Try it with sample data** opens `/demo` in
one click. At 390 × 844, the first view contains
`Maya.Rivera@Northstar.example`, its lowercase mapped result, and the complete
`email · not-an-email` issue. The persistent banner says **“Demo — sample
data, nothing is saved”** and exposes **Reset demo** and **Start for real**.
Fixing the email reduces the count from three to two; Reset restores the
invalid value and three errors, then focuses **The replay needs review**.

A fresh live `/?demo=1` flow made only these requests: its same-origin
document, hashed JavaScript, and hashed CSS. Two pre-existing real-license
sentinels remained byte-identical. Cookies and sessionStorage stayed empty;
IndexedDB and CacheStorage had no entries. The held-response landing-to-demo
race also ended with the original real-license sentinel, no verdict write,
and no active cross-origin request.

The release CLI demo was run from a separate temporary working directory. It
created a new system temporary directory, processed five rows, reported three
validation errors, and wrote the four named artifact paths. The clean-clone
network-guard and offline claim commands passed.

## Claims verification

I cloned the candidate with `git clone --no-hardlinks` into
`/tmp/import-mapping-replay-review6.mJSSfA/repo`, ran `npm ci`, and ran every
exact `test` command in `.factory/claims.json` independently. Results:

| Claim id | Result |
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
| `build-artifacts` | PASS |
| `site-routing-headers` | PASS |
| `mit-license` | PASS |

All 28 listed commands pass. F-6-1 means the inventory is still incomplete.
The same clean clone passed `npm test` (7 Rust tests; 66 Playwright tests; 2
intentional project skips), typecheck, rustfmt, Clippy with warnings denied,
`cargo package`, and `npm run build`. The build created the release binary and
`dist/site`; JavaScript is 22.55 kB raw / 7.22 kB gzip and CSS is 13.10 kB raw
/ 3.67 kB gzip.

## Earlier findings checked again

I read reviews 1–5, polish reports 1–5, and the handoff. Each earlier finding
was checked on the live site and in current code/tests.

| Earlier id | Live and code confirmation | Status |
| --- | --- | --- |
| F-1-1 | Live `/` → `/demo` → Back restored scroll 3203 → 3203 and focused `#page-title`; source retains history coordinates. | Fixed |
| F-1-2 | `/404` and an arbitrary missing route return the designed page with HTTP 404; known routes return 200. | Fixed |
| F-1-3 | Privacy is visible in the 390 px header; every visible mobile target measured at least 44 px. | Fixed |
| F-1-4 | Static and rendered title, description, canonical, OG, and Twitter fields are route-specific on every checked route. | Fixed |
| F-1-5 | The live h1 remains “Replay CSV imports before upload.” | Fixed |
| F-1-6 | The live process label remains “How the replay works.” | Fixed |
| F-1-7 | The live boundary heading remains “What the CLI does not do.” | Fixed |
| F-1-8 | The live 404 h1 remains “Page not found.” | Fixed |
| F-1-9 | The terminal action remains “Show the sample replay again.” | Fixed |
| F-1-10 | Local-only, exact website-storage, and rollback-scope claim commands pass; live demo storage and requests remain isolated. | Fixed |
| F-1-11 | `license-cache-day` remains registered and passes the before/after-24-hours test. | Fixed |
| F-1-12 | Merchant, refund, and card-data promises remain absent; live checkout returns 303 to Dodo Payments. | Fixed |
| F-1-13 | The unproved buyer/team license-scope sentence remains absent. | Fixed |
| F-1-14 | Landing and README consistently use “customer system”; the former substitute remains absent. | Fixed |
| F-2-1 | The first mobile demo view contains mapped sample data and a complete error; correction and Reset visibly change and restore it. | Fixed |
| F-2-2 | All three first-screen facts fit at both 390 × 844 and 1440 × 900. | Fixed |
| F-2-3 | `demo-row-count` proves five source and output rows. | Fixed |
| F-2-4 | `paid-kit` names and proves recipes plus the checklist. | Fixed |
| F-2-5 | The paid-kit test inspects exactly five named recipes. | Fixed |
| F-2-6 | The kit test confirms structured upload-owner and second-engineer-approval fields. | Fixed |
| F-2-7 | Recording, error, and artifact claims execute and compare the bundled CLI result. | Fixed |
| F-2-8 | The README heading remains “Run a CSV replay.” | Fixed |
| F-3-1 / F-1-12 | The prior merchant/refund regression remains absent across landing, Privacy, Terms, and README. | Fixed |
| F-3-2 | `demo-temp` starts 40 concurrent demos and proves distinct complete directories. | Fixed |
| F-4-1 | README gives the honest source-checkout installation path and makes no release-availability claim. | Fixed |
| F-4-2 | README uses the direct `cargo package` instruction; the clean command passes. | Fixed |
| F-4-3 | `build-artifacts` registers and tests the release binary and site build. | Fixed |
| F-4-4 | `build-artifacts` checks `dist/site`, route documents, and hashed assets. | Fixed |
| F-4-5 | `site-routing-headers` checks known routes, custom 404, CSP, `nosniff`, referrer policy, and permissions policy. | Fixed |
| F-4-6 | README retains the non-sentence `Production site:` label; the URL and canonical are live. | Fixed |
| F-4-7 | `mit-license` checks Cargo metadata and the complete MIT text. | Fixed |
| F-5-1 | Entering demo aborts a held license request; releasing it writes no verdict and leaves the real sentinel unchanged. | Fixed |

No earlier finding is reopened.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. `/404` and a new unknown
  URL return 404 with the designed page and a home action.
- Every checked route has `lang=en`, one h1, one main landmark, ordered
  headings, a route-specific title/description/canonical/OG/Twitter set,
  favicon, 180 px Apple icon, and 1200 × 630 product artwork.
- Header/footer, Privacy/Terms links, skip link, deep links, route focus and
  announcement, Back restoration, visible focus, 44 px mobile targets, and
  reduced-motion CSS are present.
- A fresh crawl of every link on all routes found no dead destination. Internal
  pages and fragments resolve; Sociobot returns 200; checkout returns the
  registered 303 to `checkout.dodopayments.com`.
- `robots.txt`, `sitemap.xml`, favicon, Apple icon, and OG image return 200.
  Security headers are live, including response-header `frame-ancestors`.
- Axe found zero violations across six routes at desktop and mobile sizes.
  The factory URL verifier found no console error, missing alt, unlabeled
  button, or structural failure.
- The live `index.html` and hashed JavaScript byte-match the clean production
  build. JavaScript is well below the size limit. No third-party font, script,
  analytics, provider key, or decorative AI control is present.
- The warm ticket-paper palette, clipped destination plates, route rails,
  numbered stops, asymmetric hero, terminal, and original poster art match
  `.factory/design.md`. The site is recognisably product-specific rather than
  a generic SaaS template.

## Missed leverage

No additional AI, sync, or import/export feature is implied by this brief.
The deterministic CLI already imports the source CSV plus mapping and exports
the output CSV, evidence, validation report, and rollback manifest. Model
output would weaken the reproducibility at the center of the job. No runtime
AI feature or provider key is present.

## What would make this perfect

Close F-6-1 by registering and testing the cached-valid outage behavior, or by
removing that fallback promise and access behavior. Then rerun all claim
commands and this cold review. No other defect or missing feature was found.
