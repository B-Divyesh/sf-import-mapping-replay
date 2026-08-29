# Adversarial first-read review 4 — FAIL

Reviewed 29 August 2026 against live
`https://import-mapping-replay.sociobot.in`, commit
`709c6618fa0ca13be1a404f6793b6cf5ce81d17d`, and a clean clone. This was a
full review, not a diff review.

## Verdict: FAIL

There are seven findings: one medium and six minor. There are no blocking
product-flow or failing-test findings, but PASS requires zero findings and no
unlisted claim.

## Cold first read

I opened fresh 390 × 844 and 1440 × 900 browser contexts without scrolling.
My reading from both first screens was:

- What it does: replays a customer CSV import before upload and produces a
  reviewed output CSV plus an error report.
- Who it is for: implementation engineers preparing customer uploads.
- What to click first: **Try it with sample data**.

The exact copy was **“Replay CSV imports before upload”**, **“For
implementation engineers who need a reviewed output CSV and error report
before each customer upload”**, and **“Try it with sample data”**. All three
answers and the three privacy/offline/price facts fit inside both viewports.
There was no horizontal overflow or application console error.

## Findings

### F-4-1 — Medium — The README implies releases exist when none are linked or published

**Exact location and quote:** `README.md`, Install: **“The factory publishes
releases.”**

**Evidence:** The repository has no Git tags, the GitHub Releases API returned
an empty list, and the README provides no release download or registry URL.
There is also no matching entry in `.factory/claims.json`.

**Why this matters:** A first-time CLI user can reasonably read the present
tense as an available installation channel, then has nowhere to obtain a
release. The only working installation instruction is from a source checkout.

**Concrete fix:** Replace it with **“No packaged release is published yet.
Install from this checkout with `cargo install --path .`.”** If releases are
published later, link the actual release page and register an availability
claim with an automated check.

### F-4-2 — Minor — “Ready for registry review” is vague jargon and an unlisted claim

**Exact location and quote:** `README.md`, Install: **“The package is ready for
registry review with cargo package.”**

**Why this matters:** “Ready” and “registry review” do not tell an installer
what to do, and the claimed packaging outcome has no `claims.json` entry even
though `cargo package` passes locally.

**Concrete fix:** Use the instruction **“Run `cargo package` to check the
release archive.”** If readiness remains a product claim, add a
`package-builds` entry whose test runs `cargo package` from a clean clone.

### F-4-3 — Minor — The build-result sentence is an unlisted claim

**Exact location and quote:** `README.md`, Develop and verify: **“`npm run
build` compiles the release binary and the Vite site.”**

**Why this matters:** This is an observable result a maintainer can rely on,
but none of the 25 registered claims names it. A successful ad hoc review run
does not satisfy the claims registry contract.

**Concrete fix:** Add `build-artifacts` to `.factory/claims.json`; run
`npm run build` and assert the release binary and site bundle exist. Or make
the line a direct instruction: **“Run `npm run build` to build both targets.”**

### F-4-4 — Minor — The deployment-output sentence is an unlisted claim

**Exact location and quote:** `README.md`, Develop and verify: **“Static
deployment output lands in `dist/site`, with `index.html` at that root.”**

**Why this matters:** The path and file layout are concrete promised outcomes,
but no claim entry asserts them.

**Concrete fix:** Cover this sentence with `build-artifacts` and assert
`dist/site/index.html`, or replace it with the post-build instruction
**“Deploy the generated `dist/site` directory.”**

### F-4-5 — Minor — The hosting-configuration sentence is an unlisted claim

**Exact location and quote:** `README.md`, Deploy: **“Its configuration
rewrites known routes, returns the custom 404 for unknown URLs, and sets
security headers.”**

**Why this matters:** These routing and security behaviors are useful and were
observed live, but the sentence is absent from `claims.json`.

**Concrete fix:** Add `site-routing-headers`; start the built site, assert 200
for known deep links, 404 for an unknown path, and the named security headers.
Tag that test `@claim:site-routing-headers`.

### F-4-6 — Minor — The production-publication sentence is an unlisted claim

**Exact location and quote:** `README.md`, Deploy: **“The factory publishes the
site at https://import-mapping-replay.sociobot.in.”**

**Why this matters:** The URL is live, but this is still a claim-like sentence
without a registry entry. The review contract does not exempt currently true
deployment claims.

**Concrete fix:** Use a non-sentence label, **“Production site:
https://import-mapping-replay.sociobot.in”**, or register `production-url` with
a status and canonical-URL check.

### F-4-7 — Minor — The MIT licensing statement is not registered as a claim

**Exact locations and quotes:** `README.md`, License: **“MIT.”** Live Terms:
**“The CLI is provided under the MIT License.”**

**Why this matters:** Licensing is a condition users rely on. `LICENSE` and
`Cargo.toml` agree, but `.factory/claims.json` has no licensing entry.

**Concrete fix:** Add `mit-license` with a test that checks `Cargo.toml` and
the full MIT license text, then tag that single test `@claim:mit-license`.

## Copy audit

Counts use whitespace-separated words. Code blocks are commands and are not
sentences. Headings, controls, labels, dynamic states, alt text, and terminal
fragments are included. No item exceeds 22 words. CSV, CLI, JSON, hashes, and
exit codes are appropriate for the named implementation-engineer audience.
No banned marketing word appears. Findings identify the remaining jargon or
unlisted claims.

### Landing page: every sentence and meaningful fragment

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Header | Import Mapping Replay | 3 | Pass |
| Header | Demo / How it works / Privacy | 1 / 3 / 1 | Pass |
| Hero label | Local CSV replay | 3 | Pass |
| H1 | Replay CSV imports before upload | 5 | Pass |
| Hero | For implementation engineers who need a reviewed output CSV and error report before each customer upload. | 16 | Pass |
| Action | Try it with sample data | 5 | Pass |
| Action result | See a finished replay and three caught errors. | 8 | Pass |
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
| Install label / H2 | Install locally / Build one binary | 2 / 3 | Pass |
| Install | This package declares Rust 1.85 as its minimum compiler. | 9 | Pass: `rust-msrv` |
| Install | No account is required. | 4 | Pass: `cli-offline` |
| H3 | What the CLI does not do | 6 | Pass |
| Limit | It does not connect to a customer system. | 8 | Pass: `cli-local-only` |
| Limit | It processes a source CSV when you run the command. | 10 | Pass: `cli-replay` |
| Limit | It does not change a source CSV. | 7 | Pass: `source-unchanged` |
| Limit | A rollback manifest cannot undo records imported elsewhere. | 8 | Pass: `rollback-local-scope` |
| Instruction | Keep the source CSV, mapping, and review files together for each customer upload. | 13 | Pass |
| Price label / H2 | Optional team kit / Standardise the review handoff | 3 / 4 | Pass |
| Price intro | The core CLI needs no license. | 6 | Pass: `core-no-license` |
| Price intro | The team kit adds mapping recipes and a sign-off checklist. | 10 | Pass: `paid-kit` |
| Kit item | Five named mapping recipes for common template fields. | 8 | Pass: `paid-kit` |
| Kit item | A review checklist with upload owner and second-engineer approval fields. | 10 | Pass: `paid-kit` |
| Price card | Team mapping kit / £24 / One-time purchase. | 3 / 1 / 2 | Pass: `paid-kit` |
| Checkout | Checkout opens through Sociobot on Dodo Payments. | 7 | Pass: `checkout-redirect` |
| Action | Buy the team kit / at hosted checkout | 4 / 3 | Pass |
| License | A revoked license locks the team kit. | 7 | Pass: `revoked-license-lock` |
| Form | Have a license? Paste it here / Verify license | 6 / 2 | Pass |
| Status | The core CLI does not need a license. | 8 | Pass: `core-no-license` |
| Valid state | License active. / The team kit is ready. | 2 / 5 | Pass: `paid-kit`, `license-privacy` |
| Invalid state | License no longer active. / Check the token or buy the team kit. | 4 / 8 | Pass: `revoked-license-lock` |
| Error state | The license could not be checked. / Check your connection and try again. | 6 / 6 | Pass |
| Cached state | Using the last valid check while verification is unavailable. | 9 | Pass |
| Download panel | Your team kit is ready on this device. / Download team kit | 8 / 3 | Pass: `paid-kit` |
| Legal prompt | Read the privacy notice and terms. | 6 | Pass |
| Footer | Replay local CSV mappings with review evidence. | 7 | Pass |
| Footer | Privacy / Terms / Built by Param Factory / external site | 1 / 1 / 4 / 2 | Pass |
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
| Install | The package is ready for registry review with cargo package. | 10 | **F-4-2** |
| Install | The factory publishes releases. | 4 | **F-4-1** |
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
| Build | npm run build compiles the release binary and the Vite site. | 11 | **F-4-3** |
| Build | Static deployment output lands in dist/site, with index.html at that root. | 11 | **F-4-4** |
| Demo | The site demo is available at /demo or /?demo=1 and uses only bundled sample data. | 15 | Pass: `demo-private` |
| H2 | Deploy | 1 | Pass |
| Deploy | Deploy dist/site to Azure Static Web Apps. | 7 | Pass: instruction |
| Deploy | Its configuration rewrites known routes, returns the custom 404 for unknown URLs, and sets security headers. | 16 | **F-4-5** |
| Deploy | The factory publishes the site at import-mapping-replay.sociobot.in. | 7 | **F-4-6** |
| H2 | Privacy and price | 3 | Pass |
| Privacy | CSV processing runs in the local binary. | 7 | Pass: `cli-replay` |
| Privacy | The CLI makes no network requests while replaying a CSV. | 10 | Pass: `cli-local-only` |
| Privacy | The website stores only a pasted license and its last verification result in your browser. | 14 | Pass: `website-license-storage-only` |
| Privacy | See the site’s /privacy and /terms pages. | 7 | Pass: links verified |
| Price | The core CLI needs no license. | 6 | Pass: `core-no-license` |
| Price | A one-time £24 license provides five named mapping recipes and a checklist with upload owner and second-engineer approval fields. | 19 | Pass: `paid-kit` |
| Checkout | The buy link opens Dodo Payments checkout through Sociobot. | 9 | Pass: `checkout-redirect` |
| Checkout | After checkout, the site stores the returned license in localStorage, removes it from the address bar, and verifies it with Sociobot. | 21 | Pass: `license-return-storage`, `license-url-stripping`, `license-privacy` |
| H2 | License | 1 | Pass |
| License | MIT. | 1 | **F-4-7** |
| License | See LICENSE. | 2 | Pass: instruction |

Terminology is consistent: **source CSV**, **mapping**, **replay**, **output
CSV**, **evidence**, **rollback manifest**, **customer system**, **team kit**,
and **license** each have one meaning. The catalog description is verb-first,
plain, and 70 characters.

## Demo and sandbox

The one-click path passes. **Try it with sample data** opens `/demo`. At
390 × 844, the initial viewport contains the Maya Rivera email before/after
mapping and the full row-5 invalid-email result. The desktop viewport shows the
same data. The persistent banner says **“Demo — sample data, nothing is
saved”** and contains **Reset demo** and **Start for real**.

The correction changes `email · not-an-email` to
`samira.chen@atlas.example`, reduces the error count, and removes the row.
Reset restores the invalid value, three errors, and focus on the results
heading. Fresh demo storage and cookies remain empty. With a pre-existing
real-license sentinel, the demo leaves that value byte-for-byte unchanged and
makes only same-origin requests.

From a new temporary working directory, the CLI demo processed five rows,
reported three validation errors, wrote four non-empty review artifacts, and
printed its unique temporary directory. The registered concurrency test
started 40 demos and confirmed 40 distinct directories.

## Claims verification

I cloned the repository with `git clone --no-hardlinks`, ran `npm ci`, then ran
all 25 exact `test` commands from `.factory/claims.json` independently. Every
claim tag occurs exactly once in the test source.

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

No registered claim test failed. Findings F-4-1 through F-4-7 are unlisted
claim-like sentences, so the claim inventory is not complete.

The full clean-clone `npm test` passed with 7 Rust tests and 59 Playwright
tests; one intended browser case was skipped. Typecheck, rustfmt, Clippy with
warnings denied, `npm run build`, and `cargo package --allow-dirty` passed.
The build created `dist/site`; JavaScript is 7.12 kB gzip and CSS is 3.67 kB
gzip.

## Earlier findings checked again

I read all three earlier reviews, all three polish reports, and the handoff.
Each earlier finding was checked against the live site and current source.

| Earlier ID | Current verification | Status |
| --- | --- | --- |
| F-1-1 | Client navigation followed by Back restores y=3200 and focuses the home h1. | Fixed |
| F-1-2 | `/404` and an arbitrary unknown route return 404 with the designed page. | Fixed |
| F-1-3 | Privacy is visible in the 390 px header with a 44 px target. | Fixed |
| F-1-4 | Every route has route-specific static and rendered title, description, canonical, OG, and Twitter metadata. | Fixed |
| F-1-5 | The live h1 is “Replay CSV imports before upload.” | Fixed |
| F-1-6 | The process label is “How the replay works.” | Fixed |
| F-1-7 | The limits heading is “What the CLI does not do.” | Fixed |
| F-1-8 | The 404 h1 is “Page not found.” | Fixed |
| F-1-9 | The terminal control is “Show the sample replay again.” | Fixed |
| F-1-10 | Local-only, exact website-storage, and rollback-boundary claims pass. | Fixed |
| F-1-11 | The 24-hour cache claim passes. | Fixed |
| F-1-12 | Merchant, payment-data, and refund assertions remain absent. | Fixed |
| F-1-13 | The unproved buyer/team license-scope sentence remains absent. | Fixed |
| F-1-14 | Landing and README use “customer system” consistently. | Fixed |
| F-2-1 | The first demo viewport shows a mapped value and complete validation result; Reset changes and restores state. | Fixed |
| F-2-2 | All three facts finish inside both tested first viewports. | Fixed |
| F-2-3 | `demo-row-count` is registered and proves five rows. | Fixed |
| F-2-4 | `paid-kit` registers and proves the recipes and checklist. | Fixed |
| F-2-5 | The paid-kit test inspects exactly five named recipes. | Fixed |
| F-2-6 | The kit contains structured upload-owner and second-engineer approval fields. | Fixed |
| F-2-7 | The recording, error, and artifact tests execute the real bundled CLI. | Fixed |
| F-2-8 | The README heading remains “Run a CSV replay.” | Fixed |
| F-3-1 / F-1-12 | The regressed merchant/refund statements remain removed across landing, README, Privacy, and Terms. | Fixed |
| F-3-2 | Forty concurrent demos produce forty unique directories and complete artifacts. | Fixed |

No earlier finding is reopened.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. `/404` and an arbitrary
  unknown route return 404 with a designed transit-poster page and home link.
- Every route has `lang=en`, one h1, one main landmark, ordered headings,
  route-specific title/description/canonical/OG/Twitter metadata, SVG favicon,
  180 px Apple icon, and a 1200 × 630 product image.
- Header and footer are consistent. Direct links load, route changes focus and
  announce the h1, Back restores scroll and focus, and the skip link is first
  in keyboard order.
- Every crawled internal and external page link returned 200; checkout
  returned the registered 303 to Dodo. Robots, sitemap, favicon, Apple icon,
  and OG image returned 200.
- Live Axe scans on all five routes found zero violations. The URL verifier
  reported no errors, one h1, `lang=en`, a main landmark, complete alt text,
  and labeled buttons. Reduced-motion mode had no console errors.
- Live HTML, JavaScript, CSS, and poster-art hashes match the clean-clone
  production build. JavaScript is far below the size limit.
- The warm paper, ink/red/brass palette, clipped ticket shapes, rails,
  medallions, terminal, and original poster art match `.factory/design.md` and
  do not resemble a generic SaaS template.

## Missed leverage

No additional AI or sync feature is implied by this deterministic local replay
job. The product already imports CSV plus mapping data and exports the output
CSV, field evidence, validation report, and rollback manifest. Model output
would weaken reproducibility. No decorative AI feature, provider key,
analytics, third-party font, or third-party script is present.

## What would make this perfect

Resolve all seven README/Terms claim-inventory findings. State honestly that
no packaged release exists yet, replace the vague registry-readiness sentence,
and either register build, deployment, production-URL, and MIT-license tests or
rewrite those lines as direct instructions/labels. After that, rerun every
claim and the full cold review; no product-flow defect remains in this round.
