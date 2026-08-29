# Adversarial first-read review 2 — FAIL

Reviewed 29 August 2026 against live
`https://import-mapping-replay.sociobot.in`, commit
`e6ce2a4c267df983cd11b7bf4bc9df8bed5f6b1b`, and a fresh clone. This was a
full review, not a diff review.

## Verdict: FAIL

There are eight findings. One is blocking. PASS requires zero findings and no
untested claim.

## Cold first read

I opened fresh 390 × 844 and 1440 × 900 browser contexts and did not scroll.
My reading from each first screen was:

- What it does: reruns a customer CSV import before upload and produces a
  reviewed output CSV plus an error report.
- Who it is for: implementation engineers preparing customer uploads.
- What to click first: **Try it with sample data**.

The exact copy that supplied those answers was **“Replay CSV imports before
upload”**, **“For implementation engineers who need a reviewed output CSV and
error report before each customer upload”**, and **“Try it with sample data”**.
All three questions are answered, so the cold-read requirement is not blocking.

At 390 px the action and all three facts are visible without scrolling. At
1440 × 900 only the top of the first fact is visible; F-2-2 records that
first-screen structure failure. Neither viewport has horizontal overflow.

## Findings

### F-2-1 — BLOCKING — The demo's first screen does not show realistic sample data

**Location and quote:** Live `/demo`, 390 × 844 and 1440 × 900. After the
one-click **“Try it with sample data”** action, the visible content is the demo
banner, header, **“Review a finished CSV replay”**, explanatory copy, and the
heading **“The replay needs review”**. At 390 px only the top of the number
**“5”** appears at the bottom edge. No customer value, validation row, mapped
field, or output excerpt is visible. The first actual values
**“not-an-email”**, **“C-1043”**, and **“legacy”** require scrolling.

**Why this fails:** The demo contract requires the first screen after clicking
to show the product in use with realistic sample data. A description of a
sample and aggregate counts do not let a visitor inspect the product's result.
The Reset control also has no observable demo state to restore; it rewrites the
same static transcript and focuses the results heading.

**Concrete fix:** Compress the banner/header/hero and place at least one full
validation row plus a mapped before/after value in the initial 390 × 844
viewport. Make **Reset demo** visibly restore an alterable sample state or
restart the recorded CLI run. Add a 390 × 844 test that clicks from `/` and
asserts a realistic row value and mapped output are fully within the viewport.

### F-2-2 — Medium — The desktop first screen omits the three required facts

**Location and quote:** Live `/` at 1440 × 900. **“CSV files stay on your
computer”** starts at y=876 and is clipped by the viewport; **“The CLI runs
without internet”** and **“The core CLI needs no license. The team kit costs
£24 once”** are below the fold.

**Why this fails:** The required first-screen shape includes three short facts
about privacy, offline use, and price. Desktop visitors do not receive that set
without scrolling.

**Concrete fix:** Reduce the desktop headline width/height or hero spacing so
all three facts end above 900 px. Add a desktop viewport assertion for the
bottom edge of every fact.

### F-2-3 — Medium — The five-row sample claim is not registered

**Location and quote:** Landing preview: **“The sample replay transforms five
customers…”** and terminal output **“Replay complete: 5 source rows.”**

**Why this fails:** `.factory/claims.json` has entries for three errors and four
files, but no entry whose claim is the five-row result. Another tagged test
happens to assert `rows === 5`; that does not list this claim or its landing
location.

**Concrete fix:** Add a `demo-row-count` claim with a test that runs the bundled
CLI demo and asserts five source rows, or remove the number from both places.

### F-2-4 — Medium — The paid kit contents are an unlisted claim

**Location and quote:** Landing: **“The team kit adds mapping recipes and a
sign-off checklist.”** README: **“A one-time £24 license provides mapping
recipes and a sign-off checklist.”**

**Why this fails:** `paid-kit` says only that a license provides the “team
mapping kit.” It does not register the two contents a buyer is promised.

**Concrete fix:** Change the registered claim to name mapping recipes and a
sign-off checklist, and make `@claim:paid-kit` assert both downloaded
structures and usable content.

### F-2-5 — Medium — The five-recipe quantity is an unlisted claim

**Location and quote:** Landing paid section: **“Five mapping recipes for
common template fields.”**

**Why this fails:** No claim entry states this quantity. The current test checks
an array length, but the public claim is absent from the claims registry.

**Concrete fix:** Add the quantity to `paid-kit` and assert five named,
non-empty recipes, or remove the number from the page.

### F-2-6 — Medium — The advertised owner and approval fields are not proved

**Location and quote:** Landing paid section: **“A review checklist with owner
and approval fields.”**

**Why this fails:** No claim entry names these fields. The generated kit is a
JSON object with a `review` string array; `@claim:paid-kit` checks only that the
array has four items, not that usable owner and approval fields exist.

**Concrete fix:** Add structured `owner` and `approval` fields to the download
and assert their names and values in `@claim:paid-kit`, or rewrite the sentence
to describe the actual checklist items and register that claim.

### F-2-7 — Medium — The “real CLI” recording claim is unlisted and its related tests are static

**Location and quote:** Landing label **“Recorded from the real CLI”** and
accessible label **“Recorded terminal run with sample data”**; in
`tests/site.spec.ts`, tests tagged `@claim:demo-errors` and
`@claim:review-files`.

**Why this fails:** No claims entry covers the assertion that the recording
came from the real CLI. The related tests confirm only that static `/demo` text
contains three rows and four filenames. They do not run the CLI and prove that
the displayed replay catches those errors or writes those files. Other tests
exercise overlapping CLI behavior, but each registered claim must have its own
outcome test.

**Concrete fix:** In each tagged test, run `import-mapping-replay demo --json`
in a fresh temporary context. Assert three parsed validation issues and the
existence/content of all four reported files, then optionally confirm the web
recording matches that output.

### F-2-8 — Minor — The README heading “Use it” is context-free

**Location and quote:** README heading **“Use it.”**

**Why this fails:** In a heading list it does not name what the section lets the
reader do.

**Concrete fix:** Rename it **“Run a CSV replay.”**

## Copy audit

Counts use whitespace-separated words. Code blocks and JSON examples are not
sentences. Headings, labels, controls, output messages, accessible text, and
README list fragments are included because a visitor reads or hears them. No
item exceeds 22 words, and no banned marketing adjective appears. CLI, CSV,
JSON, Rust, hashes, and mapping are technical terms appropriate to the stated
implementation-engineer audience. Findings are shown by id.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Import Mapping Replay | 3 | Pass |
| Demo | 1 | Pass |
| How it works | 3 | Pass |
| Privacy | 1 | Pass |
| Local CSV replay | 3 | Pass |
| Replay CSV imports before upload | 5 | Pass |
| For implementation engineers who need a reviewed output CSV and error report before each customer upload. | 16 | Pass |
| Try it with sample data | 5 | Pass |
| See a finished replay and three caught errors. | 8 | `demo-errors` |
| CSV files stay on your computer. | 6 | `cli-local-only` |
| The CLI runs without internet. | 5 | `cli-offline` |
| The core CLI needs no license. | 6 | `core-no-license` |
| The team kit costs £24 once. | 6 | `paid-kit` |
| A CSV ticket passes through three mapping rails and becomes an ordered manifest. | 13 | Pass: useful image alt |
| Recorded from the real CLI | 5 | F-2-7 |
| See the failed rows before upload | 6 | Pass |
| The sample replay transforms five customers and writes four review files. | 11 | F-2-3 / `review-files` |
| It catches three source errors. | 5 | `demo-errors` |
| Recorded terminal run with sample data | 6 | F-2-7: accessible label |
| local terminal · sample run | 5 | Pass |
| Replay complete: 5 source rows | 5 | F-2-3 |
| Validation: 3 errors — review required | 6 | `demo-errors` |
| row 5 · email · not-an-email | 6 | Pass: output fragment |
| Value is not an email address; correct it. | 8 | Pass |
| row 6 · external_id · C-1043 | 6 | Pass: output fragment |
| Value already appears on source row 3; make it unique. | 10 | Pass |
| row 6 · plan · legacy | 6 | Pass: output fragment |
| Value is not allowed; use starter, growth, or enterprise. | 9 | Pass |
| Wrote output.csv, evidence.json, validation.json, rollback-manifest.json | 5 | `review-files`; see F-2-7 |
| Show the sample replay again | 5 | Pass: result-naming action |
| Files written by the sample run | 6 | Pass: accessible label |
| output.csv / Mapped rows | 1 / 2 | `review-files` |
| evidence.json / Before and after | 1 / 3 | `review-files` |
| validation.json / Three issues | 1 / 2 | `review-files` / `demo-errors` |
| rollback-manifest.json / Original rows | 1 / 2 | `review-files` |
| How the replay works | 4 | Pass |
| Replay an import in three steps | 6 | Pass |
| Map the columns | 3 | Pass |
| Name each source and target field in a version 1 JSON file. | 12 | `mapping-v1` |
| Run the local CLI | 4 | Pass |
| Apply trim, case, replacement, and date rules without uploading the CSV. | 11 | `mapping-v1` / `cli-local-only` |
| Review the evidence | 3 | Pass |
| Check row errors, before-and-after values, hashes, and untouched source rows. | 10 | `cli-replay` / `source-unchanged` |
| Install locally | 2 | Pass |
| Build one binary | 3 | Pass |
| This package declares Rust 1.85 as its minimum compiler. | 9 | `rust-msrv` |
| No account is required. | 4 | `cli-offline` |
| What the CLI does not do | 6 | Pass |
| It does not connect to a customer system. | 8 | `cli-local-only` |
| It processes a source CSV when you run the command. | 10 | `cli-replay` |
| It does not change a source CSV. | 7 | `source-unchanged` |
| A rollback manifest cannot undo records imported elsewhere. | 8 | `rollback-local-scope` |
| Keep the source CSV, mapping, and review files together for each customer upload. | 13 | Pass: instruction |
| Optional team kit | 3 | Pass |
| Standardise the review handoff | 4 | Pass |
| The team kit adds mapping recipes and a sign-off checklist. | 10 | F-2-4 |
| Five mapping recipes for common template fields. | 7 | F-2-5 |
| A review checklist with owner and approval fields. | 8 | F-2-6 |
| Team mapping kit | 3 | Pass |
| £24 | 1 | `paid-kit` |
| One-time purchase. | 2 | `paid-kit` |
| Checkout opens on Dodo. | 4 | `paid-kit` |
| Buy the team kit | 4 | Pass: result-naming action |
| at hosted checkout | 3 | Pass: accessible context |
| A revoked license locks the team kit. | 7 | `revoked-license-lock` |
| Have a license? | 3 | Pass |
| Paste it here. | 3 | Pass |
| Verify license | 2 | Pass: result-naming action |
| The core CLI does not need a license. | 8 | `core-no-license` |
| Read the privacy notice and terms. | 6 | Pass |
| Replay local CSV mappings with review evidence. | 7 | `cli-replay` |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| external site | 2 | Pass: accessible context |
| Version 0.1.0 · build 2026.08.29 | 5 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Import Mapping Replay | 3 | Pass: document title |
| Replay customer CSV imports from one reviewed mapping file. | 9 | `cli-replay` |
| The CLI writes an output CSV, field evidence, validation results, and original source rows. | 14 | `cli-replay` / `review-files` |
| It is for implementation engineers who prepare repeatable template uploads. | 10 | Pass |
| It does not connect to a customer system or undo records already imported elsewhere. | 14 | `cli-local-only` / `rollback-local-scope` |
| Try the bundled sample | 4 | Pass |
| The command copies a realistic customer CSV and mapping into a new temporary directory. | 14 | `demo-temp` |
| It runs the replay and prints every output path. | 9 | `demo-temp` / `review-files` |
| Install | 1 | Pass |
| This package declares Rust 1.85 as its minimum compiler. | 9 | `rust-msrv` |
| The package is ready for registry review with cargo package. | 10 | Pass: maintainer instruction verified locally |
| The factory publishes releases. | 4 | Pass: ownership statement |
| Use it | 2 | F-2-8 |
| Add --json for machine-readable command output. | 6 | `json-output` |
| A run writes: | 3 | `review-files` |
| output.csv: rows in the mapping's declared column order. | 8 | `cli-replay` |
| evidence.json: source and output hashes plus before/after samples. | 8 | `cli-replay` |
| validation.json: every validation issue with its source row. | 8 | `cli-replay` |
| rollback-manifest.json: the original source rows and source hash. | 8 | `cli-replay` |
| The rollback manifest reconstructs input to this local transformation. | 9 | `cli-replay` |
| It cannot undo records already uploaded to another product. | 10 | `rollback-local-scope` |
| Mapping format | 2 | Pass |
| Mappings have a stable integer version. | 6 | `mapping-v1` |
| Version 1 maps named source columns to target columns in declaration order. | 12 | `mapping-v1` |
| Version 1 transforms are trim, lowercase, uppercase, replace, and date. | 10 | `mapping-v1` |
| Validation rules are required, email, one_of, and unique. | 8 | `mapping-v1` |
| A field may use default when its source cell is empty. | 11 | `mapping-v1` |
| Missing mapped columns return exit code 1 and say to check the CSV header or mapping. | 16 | `actionable-errors` |
| Validation failures return exit code 2 after writing review files. | 10 | `cli-replay` |
| Develop and verify | 3 | Pass |
| npm run build compiles the release binary and the Vite site. | 11 | Pass: build instruction verified locally |
| Static deployment output lands in dist/site, with index.html at that root. | 11 | Pass: build instruction verified locally |
| The site demo is available at /demo or /?demo=1 and uses only bundled sample data. | 15 | `demo-private` |
| Deploy | 1 | Pass |
| Deploy dist/site to Azure Static Web Apps. | 7 | Pass: instruction |
| Its configuration rewrites known routes, returns the custom 404 for unknown URLs, and sets security headers. | 16 | Pass: live structure check |
| The factory publishes the site at import-mapping-replay.sociobot.in. | 7 | Pass: live URL |
| Privacy and price | 3 | Pass |
| CSV processing runs in the local binary. | 7 | `cli-replay` |
| The CLI makes no network requests while replaying a CSV. | 10 | `cli-local-only` |
| The website stores only a pasted license and its last verification result in your browser. | 14 | `website-license-storage-only` |
| See the site's /privacy and /terms pages. | 7 | Pass: links verified |
| The core CLI needs no license. | 6 | `core-no-license` |
| A one-time £24 license provides mapping recipes and a sign-off checklist. | 11 | F-2-4 |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

Terminology is consistent: **source CSV**, **mapping**, **replay**, **output
CSV**, **evidence**, **rollback manifest**, **customer system**, **team kit**,
and **license** each have one meaning. The catalog description is verb-first,
plain, and 87 characters.

## Demo and sandbox

- The landing action enters `/demo` in one click.
- The banner **“Demo — sample data, nothing is saved”**, **Reset demo**, and
  **Start for real** remain visible.
- The page requested only same-origin HTML, JavaScript, CSS, and the poster
  image. Cookies, localStorage, sessionStorage, IndexedDB, and CacheStorage
  remained empty before and after Reset.
- The existing real-license sentinel test passed; demo mode neither read nor
  changed it.
- The CLI demo was run from a fresh temporary working directory. It created a
  new `/tmp/import-mapping-replay-demo-*` directory and reported five rows,
  three validation errors, and four output paths.
- The first-view and Reset weaknesses remain blocking as F-2-1.

## Claims verification

I cloned the repository with `git clone --no-hardlinks` into
`/tmp/import-mapping-replay-review2.8n6a6T/repo`, ran `npm ci`, and ran every
test command from `.factory/claims.json` independently. Every claim id occurs
exactly once as a test tag.

| Claim id | Result |
| --- | --- |
| `demo-errors` | PASS |
| `review-files` | PASS; assertion-quality finding F-2-7 |
| `demo-private` | PASS |
| `cli-offline` | PASS |
| `cli-local-only` | PASS |
| `demo-temp` | PASS |
| `cli-replay` | PASS |
| `mapping-v1` | PASS |
| `source-unchanged` | PASS |
| `json-output` | PASS |
| `actionable-errors` | PASS |
| `paid-kit` | PASS; registry-scope findings F-2-4–F-2-6 |
| `license-privacy` | PASS |
| `website-license-storage-only` | PASS |
| `license-cache-day` | PASS |
| `core-no-license` | PASS |
| `rust-msrv` | PASS |
| `revoked-license-lock` | PASS |
| `rollback-local-scope` | PASS |

No listed command failed. F-2-3 through F-2-7 explain why passing commands do
not yet provide a complete one-to-one registry of public claims.

## Earlier findings checked again

I read `.factory/review-1.md`, `.factory/polish-1.md`, and the prior
`.factory/handoff.md`. Each earlier finding was checked on the live site and in
the current code.

| Earlier id | Current verification | Status |
| --- | --- | --- |
| F-1-1 | Live Back restored `scrollY` 4457 to 4457; the h1 regained focus. `popstate` uses saved history coordinates. | Fixed |
| F-1-2 | Live `/404` and `/missing-review-2` returned HTTP 404 with the designed page; known routes returned 200. | Fixed |
| F-1-3 | Privacy is visible in the 390 px header and has a 44 px target. | Fixed |
| F-1-4 | Live title, description, canonical, OG title/description/URL, and Twitter fields change per route. Prerendered HTML also contains route metadata. | Fixed |
| F-1-5 | The live h1 is “Replay CSV imports before upload.” | Fixed |
| F-1-6 | The live section label is “How the replay works.” | Fixed |
| F-1-7 | The live heading is “What the CLI does not do.” | Fixed |
| F-1-8 | The live 404 h1 is “Page not found.” | Fixed |
| F-1-9 | The live control is “Show the sample replay again.” | Fixed |
| F-1-10 | `cli-local-only`, `website-license-storage-only`, and `rollback-local-scope` exist and their clean-clone commands passed. | Fixed |
| F-1-11 | `license-cache-day` exists and its clean-clone command passed. | Fixed |
| F-1-12 | Merchant/refund/card-data promises remain removed; live GET and HEAD checkout tests redirect to Dodo. | Fixed |
| F-1-13 | The buyer/team license-scope sentence remains absent from live Terms and source. | Fixed |
| F-1-14 | Landing and README consistently use “customer system.” | Fixed |

No earlier finding regressed.

## Structure, accessibility, links, and visual identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. `/404` and an arbitrary
  unknown path return 404.
- Each checked route has `lang="en"`, one h1, one main landmark, a specific
  title, description, canonical URL, OG metadata, favicon, and consistent
  header/footer. `robots.txt`, `sitemap.xml`, the 1200 × 630 OG asset, and the
  apple-touch icon return 200.
- Client navigation focuses the new h1. Back restores scroll and h1 focus.
- Crawling links from all routes found no dead destination. The checkout
  returns 303 to `checkout.dodopayments.com`; all other navigable destinations
  return 200. The 404 page's same-document skip link naturally retains the 404
  response.
- The production verifier found no console errors on `/`, one h1, `lang=en`, a
  main landmark, complete image alt text, and labeled buttons. Desktop live
  Axe checks found no serious or critical violations; the clean suite repeats
  Axe checks for all routes in desktop and 390 px projects.
- Visible interactive targets at 390 px are at least 44 px, focus styles are
  present, and reduced-motion CSS disables animation and transitions.
- The built JavaScript is 19.08 kB raw (6.16 kB gzip), below the 150 kB limit.
- The art-deco transit-poster identity matches `.factory/design.md`: warm
  ticket stock, ink/red/brass palette, rails, punches, square destination
  controls, and original poster art. It is not a generic SaaS template.

F-2-2 is the remaining first-screen structure defect.

## Missed leverage

No additional AI, sync, or import/export feature is implied. The product
already imports a CSV plus mapping and exports the transformed CSV, evidence,
validation report, and rollback manifest. Adding AI would weaken the local,
deterministic replay job. No provider key or decorative AI feature is present.

## Verification summary

- 19 of 19 independent claim commands passed from the fresh clone.
- Full `npm test`: 3 Rust tests and 38 Playwright tests passed.
- `npm run build`: passed and created `dist/site`.
- Live production verifier: passed with no application console errors.
- Live requests/storage audit: same-origin demo requests only and no demo data
  in browser storage.
- Live route/link/metadata/404/history checks: passed except findings F-2-1 and
  F-2-2.

## What would make this perfect

Show a realistic validation row and mapped value in the demo's first mobile
and desktop viewport, and give Reset a visible state to restore. Fit all three
facts into the desktop first screen. Register the five-row result and exact
paid-kit contents, strengthen the two static claim tests to run the CLI, and
rename the README's “Use it” heading. Re-run every claim and live viewport
check; only zero findings earns PASS.
