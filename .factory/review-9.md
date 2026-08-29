# Adversarial first-read review 9 — PASS

Reviewed 29 August 2026 against
<https://import-mapping-replay.sociobot.in>, repository commit
`e5c2bbb5d6f8f89fe2aa3f3e5d44175974374c02`, and a fresh no-hardlinks
clone at that commit. This was a complete review, not a diff review.

## Verdict: PASS

There are zero findings, no failed claim test, and no untested public claim.

## Cold first read

I opened `/` without stored data at 390 × 844 and 1440 × 900. Before
scrolling, my reading at both sizes was:

- What it does: replays customer CSV imports before upload and produces a
  reviewed output CSV plus an error report.
- Who it is for: implementation engineers preparing customer uploads.
- What to click first: **Try it with sample data** to see a completed replay
  and three caught errors.

The exact first-screen copy was **“Replay CSV imports before upload”**,
**“For implementation engineers who need a reviewed output CSV and error
report before each customer upload”**, **“Try it with sample data”**, and
**“See a finished replay and three caught errors.”** All three required facts
also ended inside both viewports. There was no horizontal overflow, console
error, or page error.

## Copy audit

Counts use whitespace-separated words. Code and JSON examples are excluded;
headings, controls, and meaningful interface fragments are listed separately.
Exact duplicates are listed once. No item exceeds 22 words. No banned
marketing adjective, unexplained jargon, metaphor heading, mood heading,
inconsistent product term, or non-result-naming button remains. CSV, CLI,
JSON, Rust, ASCII, `localStorage`, and `one_of` are appropriate for the named
implementation-engineer audience.

### Landing page sentences

| Exact sentence | Words | Result |
| --- | ---: | --- |
| For implementation engineers who need a reviewed output CSV and error report before each customer upload. | 16 | Pass |
| See a finished replay and three caught errors. | 8 | Pass: `demo-errors` |
| CSV files stay on your computer. | 6 | Pass: `cli-local-only` |
| The CLI runs without internet. | 5 | Pass: `cli-offline` |
| The core CLI needs no license. | 6 | Pass: `core-no-license`; repeated in the paid section |
| The team kit costs £24 once. | 6 | Pass: `paid-kit` |
| A CSV ticket passes through three mapping rails and becomes an ordered manifest. | 13 | Pass: useful image alt |
| The sample replay transforms five customers and writes four review files. | 11 | Pass: `demo-row-count`, `review-files` |
| It catches three source errors. | 5 | Pass: `demo-errors` |
| Value is not an email address; correct it. | 8 | Pass |
| Value already appears on source row 3; make it unique. | 10 | Pass |
| Value is not allowed; use starter, growth, or enterprise. | 9 | Pass |
| Name each source and target field in a version 1 JSON file. | 12 | Pass: `mapping-v1` |
| Apply trim, case, replacement, and date rules without uploading the CSV. | 11 | Pass: `mapping-v1`, `cli-local-only` |
| Check row errors, before-and-after values, hashes, and untouched source rows. | 10 | Pass: `cli-replay`, `source-unchanged` |
| This package declares Rust 1.85 as its minimum compiler. | 9 | Pass: `rust-msrv` |
| No account is required. | 4 | Pass: `cli-offline` |
| It does not connect to a customer system. | 8 | Pass: `cli-local-only` |
| It processes a source CSV when you run the command. | 10 | Pass: `cli-replay` |
| It does not change a source CSV. | 7 | Pass: `source-unchanged` |
| A rollback manifest cannot undo records imported into a customer system. | 11 | Pass: `rollback-local-scope` |
| Keep the source CSV, mapping, and review files together for each customer upload. | 13 | Pass |
| The team kit adds mapping recipes and a sign-off checklist. | 10 | Pass: `paid-kit` |
| Five named mapping recipes for common template fields. | 8 | Pass: `paid-kit` |
| A review checklist with upload owner and second-engineer approval fields. | 10 | Pass: `paid-kit` |
| One-time purchase. | 2 | Pass: `paid-kit` |
| Checkout opens through Sociobot on Dodo Payments. | 7 | Pass: `checkout-redirect` |
| A revoked license locks the team kit. | 7 | Pass: `revoked-license-lock` |
| Have a license? | 3 | Pass |
| Paste it here. | 3 | Pass |
| The core CLI does not need a license. | 8 | Pass: `core-no-license` |
| Read the privacy notice and terms. | 6 | Pass |
| Replay local CSV mappings with review evidence. | 7 | Pass: `cli-replay` |

Conditional landing states in source were also audited:

| Exact sentence or state | Words | Result |
| --- | ---: | --- |
| Your team kit is ready on this device. | 8 | Pass: `paid-kit` |
| License active. | 2 | Pass: license verification claims |
| The team kit is ready. | 5 | Pass: `paid-kit` |
| Checking the license… | 3 | Pass: status |
| License no longer active. | 4 | Pass: `revoked-license-lock` |
| Check the token or buy the team kit. | 8 | Pass: actionable error |
| Using the last valid check while verification is unavailable. | 9 | Pass: `license-unavailable-fallback` |
| The license could not be checked. | 6 | Pass: error state |
| Check your connection and try again. | 6 | Pass: actionable error |
| Paste a license token, then verify it. | 7 | Pass: actionable error |
| The site is offline. | 4 | Pass: browser state |
| The installed CLI still runs locally. | 6 | Pass: `cli-offline` |

### Landing headings, controls, and interface fragments

| Exact text | Words | Result |
| --- | ---: | --- |
| Import Mapping Replay | 3 | Pass: wordmark |
| Demo / How it works / Privacy | 1 / 3 / 1 | Pass: navigation |
| Local CSV replay | 3 | Pass |
| Replay CSV imports before upload | 5 | Pass: h1 names the job |
| Try it with sample data | 5 | Pass: result-naming action |
| Recorded from the bundled CLI | 5 | Pass: `recorded-cli-sample` |
| See the failed rows before upload | 6 | Pass |
| local terminal · sample run | 5 | Pass |
| Replay complete: 5 source rows | 5 | Pass: `demo-row-count` |
| Validation: 3 errors — review required | 6 | Pass: `demo-errors` |
| Wrote output.csv, evidence.json, validation.json, rollback-manifest.json | 5 | Pass: `review-files` |
| Show the sample replay again | 5 | Pass: result-naming button |
| output.csv / Mapped rows | 1 / 2 | Pass |
| evidence.json / Before and after | 1 / 3 | Pass |
| validation.json / Three issues | 1 / 2 | Pass |
| rollback-manifest.json / Original rows | 1 / 2 | Pass |
| How the replay works | 4 | Pass |
| Replay an import in three steps | 6 | Pass |
| Map the columns / Run the local CLI / Review the evidence | 3 / 4 / 3 | Pass |
| Install locally / Build one binary | 2 / 3 | Pass |
| What the CLI does not do | 6 | Pass |
| Optional team kit / Standardise the review handoff | 3 / 4 | Pass |
| Team mapping kit | 3 | Pass |
| Buy the team kit | 4 | Pass: result-naming action |
| Verify license | 2 | Pass: result-naming action |
| Download team kit | 3 | Pass: result-naming action |
| Privacy / Terms / Built by Param Factory | 1 / 1 / 4 | Pass |
| Version 0.1.0 · build 2026.08.29 | 5 | Pass |

### README sentences and meaningful fragments

| Exact sentence or fragment | Words | Result |
| --- | ---: | --- |
| Replay customer CSV imports from one reviewed mapping file. | 9 | Pass: `cli-replay` |
| The CLI writes an output CSV, field evidence, validation results, and original source rows. | 14 | Pass: `cli-replay`, `review-files` |
| It is for implementation engineers who prepare repeatable template uploads. | 10 | Pass |
| It does not connect to or undo records in a customer system. | 12 | Pass: `cli-local-only`, `rollback-local-scope` |
| The command copies a realistic customer CSV and mapping into a new temporary directory. | 14 | Pass: `demo-temp` |
| It runs the replay and prints every review file path. | 10 | Pass: `demo-temp`, `review-files` |
| This package declares Rust 1.85 as its minimum compiler. | 9 | Pass: `rust-msrv` |
| Install from this source checkout. | 5 | Pass: direct instruction |
| Run cargo package to check the release archive. | 8 | Pass: direct instruction; command passed |
| Add --json for machine-readable command output. | 6 | Pass: `json-output` |
| Successful results include status, row counts, and review file paths. | 10 | Pass: `json-output`, `review-files` |
| Failed commands print `{“status”:“error”,“error”:“...”}` to standard output and still return a nonzero exit code. | 14 | Pass: `json-error-output` |
| A successful run writes: | 4 | Pass: `review-files` |
| `output.csv`: rows in the mapping's declared column order. | 8 | Pass: `cli-replay`, `review-files` |
| `evidence.json`: source and output hashes plus before/after samples. | 8 | Pass: `cli-replay`, `review-files` |
| `validation.json`: every validation issue with its source row. | 8 | Pass: `cli-replay`, `review-files` |
| `rollback-manifest.json`: the original source rows and source hash. | 8 | Pass: `cli-replay`, `review-files` |
| The rollback manifest reconstructs input to this local transformation. | 9 | Pass: `cli-replay` |
| It cannot undo records already uploaded to a customer system. | 10 | Pass: `rollback-local-scope` |
| Mappings have a stable integer version. | 6 | Pass: `mapping-v1` |
| Version 1 maps named source columns to target columns in declaration order. | 12 | Pass: `mapping-v1` |
| Version 1 transforms are `trim`, `lowercase`, `uppercase`, `replace`, and `date`. | 10 | Pass: `mapping-v1` |
| Validation rules are `required`, `email`, `one_of`, and `unique`. | 8 | Pass: `mapping-v1` |
| A field may use `default` when its source cell is empty. | 11 | Pass: `mapping-v1` |
| Email validation accepts one ASCII local part and a domain with two or more labels. | 15 | Pass: `email-domain-validation` |
| It rejects spaces and leading, trailing, or repeated domain dots. | 10 | Pass: `email-domain-validation` |
| Missing mapped columns return exit code 1 and say to check the CSV header or mapping. | 16 | Pass: `actionable-errors` |
| Duplicate CSV headers return exit code 1 before an output directory is created; rename the duplicate headers and run again. | 20 | Pass: `duplicate-source-headers` |
| Validation failures return exit code 2 after writing review files. | 10 | Pass: `cli-replay` |
| The CLI rejects a source or mapping that resolves to a review file. | 13 | Pass: `source-unchanged` |
| It builds all four review files in a staging directory and publishes them only after the replay succeeds. | 18 | Pass: `atomic-review-files` |
| A malformed later row publishes no partial review files. | 9 | Pass: `atomic-review-files` |
| If a complete replay already exists, a failed rerun leaves all four review files unchanged. | 15 | Pass: `atomic-review-files` |
| `npm run build` creates the release binary and the static site in `dist/site`. | 13 | Pass: `build-artifacts` |
| The site demo is available at `/?demo=1` or `/demo` and uses only bundled sample data. | 15 | Pass: `demo-private` |
| Deploy `dist/site` to Azure Static Web Apps. | 7 | Pass: direct instruction |
| Its configuration serves known routes, returns the custom 404 for unknown URLs, and sets security headers. | 16 | Pass: `site-routing-headers` |
| Production site: import-mapping-replay.sociobot.in | 3 | Pass: label |
| CSV processing runs in the local binary. | 7 | Pass: `cli-replay`, `cli-local-only` |
| The CLI makes no network requests while replaying a CSV. | 10 | Pass: `cli-local-only` |
| The website stores only a pasted license and its last verification result in your browser. | 15 | Pass: `website-license-storage-only` |
| See the site’s `/privacy` and `/terms` pages. | 7 | Pass: direct instruction; both links resolve |
| The core CLI needs no license. | 6 | Pass: `core-no-license` |
| A one-time £24 license provides five named mapping recipes and a checklist with upload owner and second-engineer approval fields. | 19 | Pass: `paid-kit` |
| The buy link opens Dodo Payments checkout through Sociobot. | 9 | Pass: `checkout-redirect` |
| After checkout, the site stores the returned license in `localStorage` and removes it from the address bar. | 17 | Pass: `license-return-storage`, `license-url-stripping` |
| It checks that exact token with Sociobot before making the team kit available. | 13 | Pass: `license-return-token-binding` |
| MIT. | 1 | Pass: `mit-license` |
| See LICENSE. | 2 | Pass: direct instruction |

README headings are **Import Mapping Replay** (3), **Try the bundled sample**
(4), **Install** (1), **Run a CSV replay** (4), **Mapping format** (2),
**Develop and verify** (3), **Deploy** (1), **Privacy and price** (3), and
**License** (1). Each names its section without metaphor or mood copy.

Terminology is consistent: **source CSV**, **mapping**, **replay**, **output
CSV**, **evidence**, **rollback manifest**, **customer system**, **review
files**, **team kit**, and **license** each have one meaning. The catalog
description starts with “Replay,” contains 79 characters, and uses no banned
marketing word.

## Demo and sandbox

PASS. **Try it with sample data** opens `/?demo=1` in one click. The first
390 × 844 screen already contains
`Maya.Rivera@Northstar.example → maya.rivera@northstar.example`, the complete
row-5 `not-an-email` issue, and **Fix the sample email**. The persistent banner
says **“Demo — sample data, nothing is saved”** and contains **Reset demo** and
**Start for real**.

Fixing the email reduces the displayed error count from three to two. Reset
restores three errors and focuses **The replay needs review**. A fresh direct
demo with real license and verdict sentinels left them byte-identical. Cookies,
session storage, IndexedDB, and CacheStorage remained empty. The entire direct
demo request log was same-origin. A held real-license request begun on `/` was
aborted on demo entry and could not write after release.

The release CLI was run from an empty temporary working directory with
`demo --json`. It reported five rows and three validation errors, created a
new `/tmp/import-mapping-replay-demo-*` directory, and wrote the four named
review files there. The caller directory remained empty.

## Claims

The clean clone was `/tmp/import-mapping-replay-review9.1JlWuO/repo` at
`e5c2bbb5d6f8f89fe2aa3f3e5d44175974374c02`. After `npm ci`, every exact
`test` command in `.factory/claims.json` was run independently. All 33 IDs are
unique, and each occurs in exactly one tagged test.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-errors` | PASS | Three fixture issues and three displayed demo rows |
| `demo-row-count` | PASS | Five input rows and five output records |
| `recorded-cli-sample` | PASS | Landing recording matches CLI rows, errors, and filenames |
| `review-files` | PASS | Four named, non-empty review files |
| `demo-private` | PASS | Same-origin requests, unchanged sentinels, aborted request race |
| `cli-offline` | PASS | Bundled demo succeeds behind closed proxy settings |
| `cli-local-only` | PASS | Network guard records no connect, send, or DNS call |
| `demo-temp` | PASS | 40 concurrent demos use 40 distinct complete directories |
| `cli-replay` | PASS | Deterministic transformed rows, evidence, and rollback data |
| `mapping-v1` | PASS | Defaults, transforms, dates, and validation rules |
| `email-domain-validation` | PASS | Supported ASCII accepted; six malformed classes rejected |
| `source-unchanged` | PASS | Both collision cases reject and preserve input bytes |
| `atomic-review-files` | PASS | No partial first run; prior complete run remains byte-identical |
| `json-output` | PASS | Success output parses with status, counts, and file paths |
| `json-error-output` | PASS | Missing input returns parseable JSON and nonzero status |
| `duplicate-source-headers` | PASS | Duplicate headers reject before output creation |
| `actionable-errors` | PASS | Missing columns return exit 1 and a next step |
| `paid-kit` | PASS | £24 copy, five recipes, and both checklist fields |
| `checkout-redirect` | PASS | GET and HEAD return 303 to Dodo Payments |
| `license-return-storage` | PASS | Returned token is stored before verification |
| `license-url-stripping` | PASS | Token is removed while other query/hash parts remain |
| `license-return-token-binding` | PASS | Returned token receives its own matching verdict |
| `license-privacy` | PASS | Exact storage key and only the Sociobot verification request |
| `website-license-storage-only` | PASS | Only license and verdict keys; no other browser stores |
| `license-cache-day` | PASS | No recheck inside 24 hours; one after expiry |
| `license-unavailable-fallback` | PASS | Cached valid access survives one recorded 503 |
| `core-no-license` | PASS | Valid replay completes without account or license data |
| `rust-msrv` | PASS | Cargo metadata reports Rust 1.85 |
| `revoked-license-lock` | PASS | Revoked response hides and locks the download |
| `rollback-local-scope` | PASS | Source/outside marker unchanged; writes stay under output |
| `build-artifacts` | PASS | Release binary and complete `dist/site` produced |
| `site-routing-headers` | PASS | Known routes, GET/HEAD 404, and security headers |
| `mit-license` | PASS | Cargo metadata and complete MIT text |

The same clean clone passed `npm test` (9 Rust tests and 76 Playwright checks;
2 intentional cross-project skips), `npm run typecheck`, Rust formatting,
Clippy with warnings denied, `npm run build`, and `cargo package`. The build
created `dist/site`; JavaScript is 22,961 bytes raw / 7.33 KiB gzip and CSS is
13,124 bytes raw / 3.68 KiB gzip. Live route documents, JavaScript, and CSS
byte-match the clean build.

## Earlier finding verification

I read reviews 1–8, polish reports 1–8, and the prior handoff. Each finding
was checked against live behavior and current code/tests.

| Earlier ID | Current live and code confirmation |
| --- | --- |
| F-1-1 | Fixed: live Back restored scroll `3203 → 3203` and focused `#page-title`; history code retains coordinates. |
| F-1-2 | Fixed: live `/404` and unknown paths return the designed 404; routing config uses the response override. |
| F-1-3 | Fixed: Privacy is visible in the 390 px header; no target measured below 44 px. |
| F-1-4 | Fixed: every route has distinct static and rendered title, description, canonical, OG, and Twitter fields. |
| F-1-5 | Fixed: live/source h1 remains “Replay CSV imports before upload.” |
| F-1-6 | Fixed: live/source section label remains “How the replay works.” |
| F-1-7 | Fixed: live/source heading remains “What the CLI does not do.” |
| F-1-8 | Fixed: live/source 404 h1 is “Page not found.” |
| F-1-9 | Fixed: “Show the sample replay again” reruns the transcript. |
| F-1-10 | Fixed: local-only, exact-storage, and rollback-scope claim tests pass; live demo isolation passes. |
| F-1-11 | Fixed: the 24-hour cache claim and time-bound test pass. |
| F-1-12 | Fixed: unsupported merchant/refund/card promises remain absent; only the tested checkout redirect is stated. |
| F-1-13 | Fixed: unsupported buyer/team license scope remains absent. |
| F-1-14 | Fixed: “customer system” is the sole external-destination term in live copy, README, CLI text, and tests. |
| F-2-1 | Fixed: the first mobile demo view shows mapped data and a complete error; correction and Reset change and restore it. |
| F-2-2 | Fixed: all three facts fit in both required first viewports. |
| F-2-3 | Fixed: `demo-row-count` registers and proves five input and output rows. |
| F-2-4 | Fixed: `paid-kit` registers and proves recipes plus the checklist. |
| F-2-5 | Fixed: the paid-kit test inspects exactly five named recipes. |
| F-2-6 | Fixed: the kit test confirms upload-owner and second-engineer-approval fields. |
| F-2-7 | Fixed: recording, error, and review-file claims execute and compare the bundled CLI result. |
| F-2-8 | Fixed: README heading remains “Run a CSV replay.” |
| F-3-1 / F-1-12 | Fixed: the billing/refund regression remains absent on landing, README, Privacy, and Terms. |
| F-3-2 | Fixed: 40 concurrent demos produce 40 distinct complete directories. |
| F-4-1 | Fixed: README gives the honest source-checkout installation path and makes no release claim. |
| F-4-2 | Fixed: README gives a direct `cargo package` instruction; the command passes. |
| F-4-3 | Fixed: `build-artifacts` registers and tests the release binary and site build. |
| F-4-4 | Fixed: the same claim checks `dist/site`, route documents, and hashed assets. |
| F-4-5 | Fixed: routing claim and live checks cover known routes, GET/HEAD 404s, and security headers. |
| F-4-6 | Fixed: README uses the factual “Production site:” label. |
| F-4-7 | Fixed: `mit-license` checks Cargo metadata and complete MIT text; live Terms agrees. |
| F-5-1 | Fixed: demo entry aborts a held license request; release cannot alter real storage or UI. |
| F-6-1 | Fixed: `license-unavailable-fallback` registers and proves cached-valid outage behavior. |
| F-7-1 | Fixed: live GET and HEAD `/404` both return 404; config and claim test cover both. |
| F-7-2 | Fixed: the complete documented ASCII/domain behavior is registered and tested. |
| F-8-1 / F-1-14 | Fixed: removed external-destination synonyms remain absent; live and source use “customer system.” |
| F-8-2 | Fixed: the four replay outputs are consistently “review files”; “artifact” is reserved for build output. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, links, accessibility, and visual identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. `/404` and an arbitrary
  unknown route return 404 for GET and HEAD with the designed page.
- Every route has `lang="en"`, one h1, one main landmark, ordered headings,
  route-specific title/description/canonical/OG/Twitter metadata, SVG favicon,
  180 × 180 touch icon, and 1200 × 630 Open Graph artwork.
- Header and footer are consistent. Privacy and Terms are linked. The skip
  link is first; route changes focus and announce the h1; Back restores scroll
  and focus.
- A crawl of every rendered link found no dead destination. Internal pages
  and fragments resolve, Sociobot returns 200, and checkout returns the tested
  303 to `checkout.dodopayments.com`.
- Axe found zero violations on all six checked routes at desktop and mobile
  sizes. There was no horizontal overflow, undersized mobile target, missing
  alt, unlabeled button, application console error, or page error. Visible
  focus and reduced-motion rules are present.
- Live CSP, `nosniff`, referrer, and permissions headers are correct. No
  analytics, third-party font/script, provider key, or Azure model endpoint is
  present.
- The asymmetric transit-poster composition, ticket rules, numbered rails,
  warm paper/ink/signal palette, clipped controls, and original poster art
  match `.factory/design.md`. It is recognisably product-specific, not a
  generic SaaS template.

## Missed leverage

No finding. The brief calls for deterministic local CSV replay. The CLI
already imports a source CSV and mapping and exports an output CSV, evidence,
validation report, and rollback manifest. Sync would contradict the local
boundary. Model-assisted mapping is not needed for the stated reproducibility
job, and no decorative AI feature or embedded provider key exists.

## What would make this perfect

Nothing remains from this review. The product is clear in the first screen,
immediately tryable with realistic isolated data, honest about its limits,
fully covered by its registered claims, and free of current or regressed
findings.
