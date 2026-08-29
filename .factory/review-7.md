# Adversarial first-read review 7 — FAIL

Reviewed 29 August 2026 against live
<https://import-mapping-replay.sociobot.in>, repository commit
`f3c0e6adeabc66dad6a3a95e5e9e8c89e5b08ef4`, and a fresh no-hardlinks
clone. This was a complete review, not a diff review.

## Verdict: FAIL

There are two findings. One is blocking because a public route returns the
wrong HTTP status for `HEAD`. The other is an unlisted README claim. All 33
listed claim commands pass, but PASS requires zero findings and no untested
claim.

## Cold first read

I opened `/` in fresh 390 × 844 and 1440 × 900 browser contexts and recorded
the first viewport before scrolling.

- What it does: a local CLI replays a customer CSV import before upload and
  produces a reviewed output CSV plus an error report.
- Who it is for: implementation engineers preparing customer uploads.
- What to click first: **Try it with sample data**.

The exact copy that supplied those answers was **“Replay CSV imports before
upload”**, **“For implementation engineers who need a reviewed output CSV and
error report before each customer upload”**, and **“Try it with sample data.”**
The adjacent result text says **“See a finished replay and three caught
errors.”** All three product facts fit inside both first viewports. Neither
viewport had horizontal overflow, a console error, or a page error. The cold
first-read gate passes.

## Findings

### F-7-1 — BLOCKING — The designed `/404` route returns 200 to `HEAD`

**Exact location and evidence:** Live route
`https://import-mapping-replay.sociobot.in/404`. A fresh `GET /404` returns
404, but `HEAD /404` returns 200. For comparison, both `GET` and `HEAD` on
`/review-7-not-found` return 404. The route is declared as
`{ "route": "/404", "statusCode": 404 }` in
`site/public/staticwebapp.config.json`. The tagged
`@claim:site-routing-headers` test checks only `GET` for `/404` and an unknown
path.

**Why this fails:** `HEAD` must report the status that `GET` would report.
Monitoring, link checkers, and cache validation can therefore treat the
product's explicit not-found route as a valid page. The structure contract
classifies broken routing as blocking. The prior handoff disclosed this as a
known gap, so the product cannot honestly receive a zero-finding PASS while it
remains live.

**Concrete fix:** Configure the deployed host so `GET /404` and `HEAD /404`
both return 404 with the designed document. Extend
`@claim:site-routing-headers` and the post-deploy crawl to assert both methods
for `/404` and an arbitrary unknown URL.

### F-7-2 — Medium — Two email-format promises exceed the registered claim

**Exact location and quotes:** `README.md`, Mapping format:
**“Email validation accepts one ASCII local part and a domain with two or more
labels.”** and **“It rejects spaces and leading, trailing, or repeated domain
dots.”**

**Evidence:** `.factory/claims.json` registers only **“Email validation rejects
domains with a leading, trailing, or repeated dot.”** The single tagged test
uses `valid@example.com`, `a@.com`, `a@example.`, and `a@b..com`. It does not
test the public promises about ASCII-only local parts, a minimum of two domain
labels, or spaces. The Rust implementation contains relevant checks, but an
implementation branch and untagged knowledge are not the required observable
claim test.

**Why this fails:** An engineer can rely on these sentences when deciding
which customer addresses the mapping accepts. Parts of that behavior are not
listed in the claim registry and are not exercised by its tagged test.

**Concrete fix:** Expand `email-domain-validation` to state the complete
supported email form. Add accepted and rejected fixtures for an ASCII local
part, a one-label domain, spaces, and all three dot boundaries to its one
tagged test. The narrower copy-only alternative is: **“Email validation
rejects domains with a leading, trailing, or repeated dot.”**

## Copy audit

Counts use whitespace-separated words. Commands and JSON examples are not
sentences, but visible headings, controls, labels, terminal output, and useful
accessible text are included. No item exceeds 22 words. No banned marketing
word, inconsistent product term, metaphor heading, mood heading, or
non-result action appears. CLI, CSV, JSON, hashes, exit codes, and Rust are
appropriate for the explicitly named implementation-engineer audience.

### Landing page: every sentence and meaningful fragment

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Header | Import Mapping Replay | 3 | Pass |
| Header link | Demo | 1 | Pass |
| Header link | How it works | 3 | Pass |
| Header link | Privacy | 1 | Pass |
| Hero label | Local CSV replay | 3 | Pass |
| H1 | Replay CSV imports before upload | 5 | Pass |
| Hero | For implementation engineers who need a reviewed output CSV and error report before each customer upload. | 16 | Pass |
| Primary action | Try it with sample data | 5 | Pass |
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
| Price card | Team mapping kit | 3 | Pass |
| Price card | £24 | 1 | Pass: `paid-kit` |
| Price card | One-time purchase. | 2 | Pass: `paid-kit` |
| Price card | Checkout opens through Sociobot on Dodo Payments. | 7 | Pass: `checkout-redirect` |
| Action | Buy the team kit | 4 | Pass |
| Action context | at hosted checkout | 3 | Pass |
| License | A revoked license locks the team kit. | 7 | Pass: `revoked-license-lock` |
| Form label | Have a license? | 3 | Pass |
| Form label | Paste it here | 3 | Pass |
| Button | Verify license | 2 | Pass |
| Empty state | The core CLI does not need a license. | 8 | Pass: `core-no-license` |
| Form error | Paste a license token, then verify it. | 7 | Pass |
| Pending state | Checking the license… | 3 | Pass |
| Valid state | License active. | 2 | Pass |
| Valid state | The team kit is ready. | 5 | Pass: `paid-kit` |
| Invalid state | License no longer active. | 4 | Pass: `revoked-license-lock` |
| Invalid state | Check the token or buy the team kit. | 8 | Pass |
| Network error | The license could not be checked. | 6 | Pass |
| Network error | Check your connection and try again. | 6 | Pass |
| Cached state | Using the last valid check while verification is unavailable. | 9 | Pass: `license-unavailable-fallback` |
| Download state | Your team kit is ready on this device. | 8 | Pass: `paid-kit` |
| Button | Download team kit | 3 | Pass |
| Legal prompt | Read the privacy notice and terms. | 6 | Pass |
| Footer | Replay local CSV mappings with review evidence. | 7 | Pass: `cli-replay` |
| Footer links | Privacy / Terms / Built by Param Factory / external site | 1 / 1 / 4 / 2 | Pass |
| Footer | Version 0.1.0 · build 2026.08.29 | 5 | Pass |

### README: every sentence and meaningful fragment

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
| Run | Successful results include status, row counts, and review-file paths. | 9 | Pass: `json-output`, `review-files` |
| Run | Failed commands print {“status”:“error”,“error”:“...”} to standard output and still return a nonzero exit code. | 14 | Pass: `json-error-output` |
| Run | A successful run writes: | 4 | Pass: `review-files` |
| Artifact | output.csv: rows in the mapping's declared column order. | 8 | Pass: `cli-replay` |
| Artifact | evidence.json: source and output hashes plus before/after samples. | 8 | Pass: `cli-replay` |
| Artifact | validation.json: every validation issue with its source row. | 8 | Pass: `cli-replay` |
| Artifact | rollback-manifest.json: the original source rows and source hash. | 8 | Pass: `cli-replay` |
| Run | The rollback manifest reconstructs input to this local transformation. | 9 | Pass: `cli-replay` |
| Run | It cannot undo records already uploaded to another product. | 9 | Pass: `rollback-local-scope` |
| H3 | Mapping format | 2 | Pass |
| Mapping | Mappings have a stable integer version. | 6 | Pass: `mapping-v1` |
| Mapping | Version 1 maps named source columns to target columns in declaration order. | 12 | Pass: `mapping-v1` |
| Mapping | Version 1 transforms are trim, lowercase, uppercase, replace, and date. | 10 | Pass: `mapping-v1` |
| Mapping | Validation rules are required, email, one_of, and unique. | 8 | Pass: `mapping-v1` |
| Mapping | A field may use default when its source cell is empty. | 11 | Pass: `mapping-v1` |
| Mapping | Email validation accepts one ASCII local part and a domain with two or more labels. | 15 | **F-7-2** |
| Mapping | It rejects spaces and leading, trailing, or repeated domain dots. | 10 | **F-7-2** |
| Error | Missing mapped columns return exit code 1 and say to check the CSV header or mapping. | 16 | Pass: `actionable-errors` |
| Error | Duplicate CSV headers return exit code 1 before an output directory is created; rename the duplicate headers and run again. | 20 | Pass: `duplicate-source-headers` |
| Error | Validation failures return exit code 2 after writing review files. | 10 | Pass: `cli-replay` |
| Safety | The CLI rejects a source or mapping that resolves to an output artifact. | 13 | Pass: `source-unchanged` |
| Safety | It builds all four artifacts in a staging directory and publishes them only after the full replay succeeds. | 18 | Pass: `atomic-artifacts` |
| Safety | A malformed later row leaves no partial artifact. | 8 | Pass: `atomic-artifacts` |
| Safety | If a complete replay already exists, a failed rerun leaves all four prior files unchanged. | 15 | Pass: `atomic-artifacts` |
| H2 | Develop and verify | 3 | Pass |
| Build | npm run build creates the release binary and the static site in dist/site. | 13 | Pass: `build-artifacts` |
| Demo | The site demo is available at /?demo=1 or /demo and uses only bundled sample data. | 15 | Pass: `demo-private` |
| H2 | Deploy | 1 | Pass |
| Deploy | Deploy dist/site to Azure Static Web Apps. | 7 | Pass |
| Deploy | Its configuration serves known routes, returns the custom 404 for unknown URLs, and sets security headers. | 16 | Pass: `site-routing-headers`; see F-7-1 for explicit `/404` HEAD |
| Deploy label | Production site: import-mapping-replay.sociobot.in | 3 | Pass |
| H2 | Privacy and price | 3 | Pass |
| Privacy | CSV processing runs in the local binary. | 7 | Pass: `cli-replay` |
| Privacy | The CLI makes no network requests while replaying a CSV. | 10 | Pass: `cli-local-only` |
| Privacy | The website stores only a pasted license and its last verification result in your browser. | 15 | Pass: `website-license-storage-only` |
| Privacy | See the site’s /privacy and /terms pages. | 7 | Pass |
| Price | The core CLI needs no license. | 6 | Pass: `core-no-license` |
| Price | A one-time £24 license provides five named mapping recipes and a checklist with upload owner and second-engineer approval fields. | 19 | Pass: `paid-kit` |
| Checkout | The buy link opens Dodo Payments checkout through Sociobot. | 9 | Pass: `checkout-redirect` |
| Checkout | After checkout, the site stores the returned license in localStorage and removes it from the address bar. | 17 | Pass: `license-return-storage`, `license-url-stripping` |
| Checkout | It checks that exact token with Sociobot before making the team kit available. | 13 | Pass: `license-return-token-binding` |
| H2 | License | 1 | Pass |
| License | MIT. | 1 | Pass: `mit-license` |
| License | See LICENSE. | 2 | Pass |

Terminology is consistent: **source CSV**, **mapping**, **replay**, **output
CSV**, **evidence**, **rollback manifest**, **customer system**, **team kit**,
and **license** each have one meaning. The catalog description is verb-first,
contains 77 characters, and has no marketing word.

## Demo and sandbox

The main demo contract passes. **Try it with sample data** opens `/?demo=1`
in one click. At 390 × 844 and 1440 × 900, the first demo viewport contains
`Maya.Rivera@Northstar.example`, its lowercase mapped value, and the complete
`email · not-an-email` issue. The sticky banner says **“Demo — sample data,
nothing is saved”** and exposes **Reset demo** and **Start for real**.

Fixing the sample reduces the error count from three to two. Reset restores
the invalid email and three errors, then focuses **“The replay needs review.”**
A fresh direct demo with two real-license sentinels made only same-origin
document, JavaScript, and CSS requests and left localStorage byte-identical.
Cookies and sessionStorage remained empty; IndexedDB and CacheStorage had no
entries. The delayed landing-license request was aborted on demo entry; after
releasing it, the original sentinel was unchanged and no cross-origin request
remained active.

I also ran the built CLI from a separate empty temporary working directory.
It created a new `/tmp/import-mapping-replay-demo-*` directory, copied the two
bundled inputs there, processed five rows, reported three validation errors,
and wrote four non-empty review artifacts. The caller's working directory
remained empty.

## Claims verification

I cloned the repository with `git clone --no-hardlinks`, ran `npm ci`, and ran
every exact `test` command in `.factory/claims.json` independently. Every
claim id occurs exactly once as a test tag.

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
| `email-domain-validation` | PASS for its listed dot-boundary scope; F-7-2 identifies extra README promises |
| `source-unchanged` | PASS |
| `atomic-artifacts` | PASS |
| `json-output` | PASS |
| `json-error-output` | PASS |
| `duplicate-source-headers` | PASS |
| `actionable-errors` | PASS |
| `paid-kit` | PASS |
| `checkout-redirect` | PASS |
| `license-return-storage` | PASS |
| `license-url-stripping` | PASS |
| `license-return-token-binding` | PASS |
| `license-privacy` | PASS |
| `website-license-storage-only` | PASS |
| `license-cache-day` | PASS |
| `license-unavailable-fallback` | PASS |
| `core-no-license` | PASS |
| `rust-msrv` | PASS |
| `revoked-license-lock` | PASS |
| `rollback-local-scope` | PASS |
| `build-artifacts` | PASS |
| `site-routing-headers` | PASS for its listed GET scope; F-7-1 is a live method gap |
| `mit-license` | PASS |

Result: **33/33 listed commands pass.** No listed test failed. F-7-2 is an
unlisted-claim finding, so the public claim inventory is still incomplete.

The same clean clone also passed `npm test` (9 Rust tests and 76 Playwright
checks; 2 intentional project skips), `npm run typecheck`, `cargo fmt
--check`, `cargo clippy --all-targets -- -D warnings`, and `npm run build`.
The build created the release binary and `dist/site`; JavaScript is 22.93 kB
raw / 7.33 kB gzip and CSS is 13.10 kB raw / 3.67 kB gzip. The live index,
hashed JavaScript, and hashed CSS match the clean build byte-for-byte.

## Earlier findings checked again

I read reviews 1–6, polish reports 1–6, and the prior handoff. Each earlier
finding was checked on the live site and in current source/tests.

| Earlier id | Current verification | Status |
| --- | --- | --- |
| F-1-1 | Live Home → Demo → Back restored scroll 3203 → 3203 and focused `#page-title`; source stores history coordinates. | Fixed |
| F-1-2 | `GET /404` and arbitrary unknown GET/HEAD requests return the designed 404; F-7-1 is the explicit route's separate HEAD defect. | Fixed as originally reported |
| F-1-3 | Privacy is visible in the 390 px header; every visible mobile target is at least 44 px. | Fixed |
| F-1-4 | Static and rendered title, description, canonical, OG, and Twitter fields are route-specific. | Fixed |
| F-1-5 | The live h1 remains “Replay CSV imports before upload.” | Fixed |
| F-1-6 | The process label remains “How the replay works.” | Fixed |
| F-1-7 | The boundary heading remains “What the CLI does not do.” | Fixed |
| F-1-8 | The designed 404 h1 remains “Page not found.” | Fixed |
| F-1-9 | The terminal action remains “Show the sample replay again.” | Fixed |
| F-1-10 | Local-only CLI, exact website storage, and rollback-scope claims pass; live demo requests/storage remain isolated. | Fixed |
| F-1-11 | `license-cache-day` passes its before/after-24-hours test. | Fixed |
| F-1-12 | Merchant, refund, and card-data promises remain absent; checkout GET and HEAD redirect to Dodo Payments. | Fixed |
| F-1-13 | The unproved buyer/team license-scope sentence remains absent. | Fixed |
| F-1-14 | Landing and README consistently use “customer system.” | Fixed |
| F-2-1 | The first mobile demo view shows mapped sample data and a complete error; correction and Reset visibly change and restore it. | Fixed |
| F-2-2 | All three facts fit at 390 × 844 and 1440 × 900. | Fixed |
| F-2-3 | `demo-row-count` registers and proves five source and output rows. | Fixed |
| F-2-4 | `paid-kit` registers and proves recipes plus the checklist. | Fixed |
| F-2-5 | The paid-kit test inspects exactly five named recipes. | Fixed |
| F-2-6 | The kit test confirms upload-owner and second-engineer-approval fields. | Fixed |
| F-2-7 | Recording, error, and file claims execute and compare the bundled CLI result. | Fixed |
| F-2-8 | The README heading remains “Run a CSV replay.” | Fixed |
| F-3-1 / F-1-12 | The prior merchant/refund regression remains absent across landing, Privacy, Terms, and README. | Fixed |
| F-3-2 | `demo-temp` starts 40 concurrent demos and proves distinct complete directories. | Fixed |
| F-4-1 | README gives the source-checkout installation path and makes no release-availability claim. | Fixed |
| F-4-2 | README uses the direct `cargo package` instruction; no registry-readiness wording remains. | Fixed |
| F-4-3 | `build-artifacts` registers and tests the release binary and site build. | Fixed |
| F-4-4 | `build-artifacts` checks `dist/site`, route documents, and hashed assets. | Fixed |
| F-4-5 | `site-routing-headers` checks known GET routes, custom GET 404s, and security headers; F-7-1 records the uncovered live HEAD defect. | Fixed as originally reported |
| F-4-6 | README retains the non-sentence “Production site:” label and the live canonical URL. | Fixed |
| F-4-7 | `mit-license` checks Cargo metadata and the complete MIT text. | Fixed |
| F-5-1 | Entering demo aborts a held license request; releasing it writes no verdict and leaves the real sentinel unchanged. | Fixed |
| F-6-1 | `license-unavailable-fallback` now registers and proves the cached-valid outage behavior. | Fixed |

No earlier finding is reopened. F-7-1 is the independently reproduced known
gap from the prior handoff, not the original GET failure in F-1-2.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. Unknown URLs return the
  designed 404. F-7-1 records the explicit `/404` HEAD inconsistency.
- Every checked route has `lang="en"`, one h1, one main landmark, ordered
  headings, a route-specific title/description/canonical/OG/Twitter set, SVG
  favicon, 180 × 180 Apple icon, and 1200 × 630 product artwork.
- Header and footer are consistent. Privacy and Terms are linked. The skip
  link is first in keyboard order; client route changes focus and announce the
  h1; Back restores scroll and focus.
- A fresh crawl of every rendered link found no dead destination. Internal
  routes and fragments resolve, Sociobot returns 200, and checkout returns the
  registered 303 to `checkout.dodopayments.com`.
- Axe found zero violations on all six checked routes at desktop and mobile
  sizes. The factory URL verifier found no console error, missing alt,
  unlabeled button, or structural failure. Visible focus, reduced motion, and
  44 px mobile targets are present.
- Security headers are live, including response-header `frame-ancestors`,
  `nosniff`, referrer policy, and permissions policy. No analytics, third-party
  font/script, provider key, or Azure model endpoint is present.
- The warm ticket-paper palette, clipped destination plates, route rails,
  numbered stops, asymmetric hero, terminal, and original poster art match
  `.factory/design.md`. The site is product-specific rather than a generic
  SaaS template.

## Missed leverage

No additional AI, sync, or import/export feature is implied by the brief. The
deterministic CLI already imports a source CSV and mapping and exports the
output CSV, field evidence, validation report, and rollback manifest. Model
output would weaken the replay's reproducibility. No decorative AI feature or
embedded provider key exists.

## What would make this perfect

Make `HEAD /404` return 404 in production and test both GET and HEAD after
deployment. Then either register and test the complete documented email form,
or narrow the README to the existing dot-boundary claim. Re-run all 33 claim
commands and the full cold review. Only zero findings earns PASS.
