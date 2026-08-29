# Adversarial first-read review 3 — FAIL

Reviewed 29 August 2026 against live
`https://import-mapping-replay.sociobot.in`, commit
`653d6a8cfa4cbd7d3a040ebc2e59b674f939149e`, and a clean clone. This was a
full review, not a diff review.

## Verdict: FAIL

There are two findings. One is blocking because an earlier finding regressed.
PASS requires zero findings and no untested claim.

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
answers and the three privacy/offline/price facts fit both first screens. There
was no horizontal overflow or application console error.

## Findings

### F-3-1 / reopened F-1-12 — BLOCKING — Merchant and refund claims are unlisted and unproved

**Exact locations and quotes:**

- Landing and README: **“Dodo Payments is the merchant of record and handles
  refunds.”** and **“A refund revokes the license automatically.”**
- Privacy: **“Dodo Payments is the merchant of record and handles payment
  data.”**, **“Dodo Payments handles refunds.”**, and **“A refund revokes the
  license automatically.”**
- Terms repeats the landing merchant/refund sentences.

**Why this fails:** These are purchase conditions a buyer can rely on, but
`.factory/claims.json` has no merchant-of-record, payment-data, refund-handler,
or automatic-refund-revocation claim. `@claim:checkout-redirect` proves only a
303 redirect to `checkout.dodopayments.com`. `@claim:revoked-license-lock`
proves that a mocked revoked response locks the kit; it does not prove that a
refund triggers that response. The untagged test named `purchase copy names
the merchant of record and refund handling` merely confirms that the sentences
render. It does not confirm that they are true.

This reopens F-1-12. Review 1 required these statements to be removed or
proved. Polish 1 removed them, but the current live site and code added them
again. The history rule therefore makes this regression blocking.

**Concrete fix:** Remove those statements from the landing page, README,
Privacy, and Terms. Keep **“Checkout opens through Sociobot on Dodo Payments”**
and **“A revoked license locks the team kit”**, which already have observable
tests. Alternatively, add separate claims backed by authoritative, automated
contract/API evidence for merchant status, refund handling, payment-data
handling, and refund-triggered revocation; a copy-presence assertion is not
evidence.

### F-3-2 — Medium — Concurrent CLI demos reuse supposedly new temporary directories

**Location:** `src/main.rs:121-123` and claim `demo-temp`.

**Evidence:** I launched 80 `import-mapping-replay demo --json` processes at
once from the clean clone. All 80 exited successfully, but they reported only
74 unique demo directories. Six names were shared by two invocations because
the directory suffix is the current millisecond and `create_dir_all` accepts
an existing directory. The prior handoff also records a 40-process run where
one colliding demo failed.

**Why this fails:** The registered claim says each demo copies the sample into
**“a new temporary directory.”** A shared directory is not new or isolated for
that invocation. The current `@claim:demo-temp` test runs one process and only
checks the name prefix and two files, so it cannot detect the collision.

**Concrete fix:** Create the directory atomically with a secure unique-temp
primitive, or retry an exclusive creation with random/PID entropy. Add a
`@claim:demo-temp` concurrency case that starts at least 40 demos together and
asserts one unique directory and four complete artifacts per process.

## Copy audit

Counts use whitespace-separated words. Code blocks are excluded because they
are commands rather than sentences. Headings, controls, labels, output lines,
alt text, and list fragments are included. No item exceeds 22 words and no
banned marketing adjective appears. Claim flags are findings even when the
wording itself is short.

### Landing page: every sentence and meaningful fragment

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Header | Import Mapping Replay | 3 | Pass |
| Header | Demo | 1 | Pass |
| Header | How it works | 3 | Pass |
| Header | Privacy | 1 | Pass |
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
| H3 | Team mapping kit | 3 | Pass |
| Price | £24 | 1 | Pass: `paid-kit` |
| Price | One-time purchase. | 2 | Pass: `paid-kit` |
| Price | Checkout opens through Sociobot on Dodo Payments. | 7 | Pass: `checkout-redirect` |
| Price | Dodo Payments is the merchant of record and handles refunds. | 10 | **F-3-1 / F-1-12** |
| Price | A refund revokes the license automatically. | 7 | **F-3-1 / F-1-12** |
| Action | Buy the team kit | 4 | Pass |
| Action context | at hosted checkout | 3 | Pass |
| License | A revoked license locks the team kit. | 7 | Pass: `revoked-license-lock` |
| Form label | Have a license? | 3 | Pass |
| Form label | Paste it here | 3 | Pass |
| Button | Verify license | 2 | Pass |
| Form status | The core CLI does not need a license. | 8 | Pass: `core-no-license` |
| Legal prompt | Read the privacy notice and terms. | 6 | Pass |
| Footer | Replay local CSV mappings with review evidence. | 7 | Pass |
| Footer | Privacy / Terms / Built by Param Factory | 1 / 1 / 4 | Pass |
| Footer | external site | 2 | Pass |
| Footer | Version 0.1.0 · build 2026.08.29 | 5 | Pass |

### README: every sentence and meaningful fragment

| Copy | Words | Result |
| --- | ---: | --- |
| Import Mapping Replay | 3 | Pass |
| Replay customer CSV imports from one reviewed mapping file. | 9 | Pass: `cli-replay` |
| The CLI writes an output CSV, field evidence, validation results, and original source rows. | 14 | Pass: `cli-replay`, `review-files` |
| It is for implementation engineers who prepare repeatable template uploads. | 10 | Pass |
| It does not connect to a customer system or undo records already imported elsewhere. | 14 | Pass: `cli-local-only`, `rollback-local-scope` |
| Try the bundled sample | 4 | Pass |
| The command copies a realistic customer CSV and mapping into a new temporary directory. | 14 | **F-3-2**: claim is false under concurrent starts |
| It runs the replay and prints every output path. | 9 | Pass: `demo-temp`, `review-files` |
| Install | 1 | Pass |
| This package declares Rust 1.85 as its minimum compiler. | 9 | Pass: `rust-msrv` |
| The package is ready for registry review with cargo package. | 10 | Pass: maintainer instruction verified locally |
| The factory publishes releases. | 4 | Pass: ownership statement |
| Run a CSV replay | 4 | Pass |
| Add --json for machine-readable command output. | 6 | Pass: `json-output` |
| A run writes: | 3 | Pass |
| output.csv: rows in the mapping's declared column order. | 8 | Pass: `cli-replay` |
| evidence.json: source and output hashes plus before/after samples. | 8 | Pass: `cli-replay` |
| validation.json: every validation issue with its source row. | 8 | Pass: `cli-replay` |
| rollback-manifest.json: the original source rows and source hash. | 8 | Pass: `cli-replay` |
| The rollback manifest reconstructs input to this local transformation. | 9 | Pass: `cli-replay` |
| It cannot undo records already uploaded to another product. | 10 | Pass: `rollback-local-scope` |
| Mapping format | 2 | Pass |
| Mappings have a stable integer version. | 6 | Pass: `mapping-v1` |
| Version 1 maps named source columns to target columns in declaration order. | 12 | Pass: `mapping-v1` |
| Version 1 transforms are trim, lowercase, uppercase, replace, and date. | 10 | Pass: `mapping-v1` |
| Validation rules are required, email, one_of, and unique. | 8 | Pass: `mapping-v1` |
| A field may use default when its source cell is empty. | 11 | Pass: `mapping-v1` |
| Missing mapped columns return exit code 1 and say to check the CSV header or mapping. | 16 | Pass: `actionable-errors` |
| Validation failures return exit code 2 after writing review files. | 10 | Pass: `cli-replay` |
| The CLI rejects a source or mapping that resolves to an output artifact. | 12 | Pass: `source-unchanged` |
| It builds all four artifacts in a staging directory and publishes them only after the full replay succeeds. | 17 | Pass: `atomic-artifacts` |
| A malformed later row leaves no partial artifact. | 8 | Pass: `atomic-artifacts` |
| If a complete replay already exists, a failed rerun leaves all four prior files unchanged. | 15 | Pass: `atomic-artifacts` |
| Develop and verify | 3 | Pass |
| npm run build compiles the release binary and the Vite site. | 11 | Pass: command verified |
| Static deployment output lands in dist/site, with index.html at that root. | 11 | Pass: command verified |
| The site demo is available at /demo or /?demo=1 and uses only bundled sample data. | 15 | Pass: `demo-private` |
| Deploy | 1 | Pass |
| Deploy dist/site to Azure Static Web Apps. | 7 | Pass: instruction |
| Its configuration rewrites known routes, returns the custom 404 for unknown URLs, and sets security headers. | 16 | Pass: live structure verification |
| The factory publishes the site at import-mapping-replay.sociobot.in. | 7 | Pass: live URL |
| Privacy and price | 3 | Pass |
| CSV processing runs in the local binary. | 7 | Pass: `cli-replay` |
| The CLI makes no network requests while replaying a CSV. | 10 | Pass: `cli-local-only` |
| The website stores only a pasted license and its last verification result in your browser. | 14 | Pass: `website-license-storage-only` |
| See the site’s /privacy and /terms pages. | 7 | Pass: links verified |
| The core CLI needs no license. | 6 | Pass: `core-no-license` |
| A one-time £24 license provides five named mapping recipes and a checklist with upload owner and second-engineer approval fields. | 19 | Pass: `paid-kit` |
| The buy link opens Dodo Payments checkout through Sociobot. | 9 | Pass: `checkout-redirect` |
| Dodo Payments is the merchant of record and handles refunds. | 10 | **F-3-1 / F-1-12** |
| A refund revokes the license automatically. | 7 | **F-3-1 / F-1-12** |
| After checkout, the site stores the returned license in localStorage, removes it from the address bar, and verifies it with Sociobot. | 21 | Pass: `license-return-storage`, `license-url-stripping`, `license-privacy` |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

Terminology is otherwise consistent: **source CSV**, **mapping**, **replay**,
**output CSV**, **evidence**, **rollback manifest**, **customer system**,
**team kit**, and **license** each have one meaning. The catalog description is
verb-first, plain, and 79 characters.

## Demo and sandbox

The web demo passes its ordinary one-click gate. **Try it with sample data**
opens `/demo`. The first 390 × 844 screen already shows the before/after Maya
Rivera email and the complete row-5 invalid-email result. The persistent banner
says **“Demo — sample data, nothing is saved”** and exposes **Reset demo** and
**Start for real**. Fixing the sample changes the message and count; Reset
restores the invalid email, three errors, and focus on the result heading.

The complete web demo flow requested only same-origin HTML, JavaScript, CSS,
and image assets. A pre-existing real-license sentinel remained byte-for-byte
unchanged. The demo neither read nor wrote its value. The clean-clone CLI demo
processed five sample rows, reported three errors, and wrote four artifacts to
a system temporary directory. F-3-2 records the concurrency isolation defect.

## Claims verification

I cloned the repository with `git clone --no-hardlinks`, ran `npm ci`, and ran
all 25 exact `test` commands from `.factory/claims.json` independently.

| Claim ID | Result |
| --- | --- |
| `demo-errors` | PASS |
| `demo-row-count` | PASS |
| `recorded-cli-sample` | PASS |
| `review-files` | PASS |
| `demo-private` | PASS |
| `cli-offline` | PASS |
| `cli-local-only` | PASS |
| `demo-temp` | PASS; incomplete concurrency coverage, F-3-2 |
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

No listed command failed. F-3-1 identifies unlisted claim-like sentences. The
full clean-clone `npm test` also passed with 7 Rust tests and 57 Playwright
tests; one intended desktop-only case was skipped on mobile. Typecheck,
rustfmt, Clippy with warnings denied, and `npm run build` passed. The build
created `dist/site`; JavaScript is 6.84 kB gzip.

## Earlier findings checked again

I read both earlier reviews, both polish reports, and the handoff. Each earlier
finding was checked against the live site and current source.

| Earlier ID | Current verification | Status |
| --- | --- | --- |
| F-1-1 | Physical-wheel scroll to y=4000, client navigation to Demo, and Back restored y=4000 and focused the home h1. | Fixed |
| F-1-2 | Live `/404` and an arbitrary unknown route return 404 with the designed page. | Fixed |
| F-1-3 | Privacy remains visible in the 390 px header with a 44 px target. | Fixed |
| F-1-4 | Every route has route-specific static and rendered title, description, canonical, OG, and Twitter metadata. | Fixed |
| F-1-5 | The live h1 is “Replay CSV imports before upload.” | Fixed |
| F-1-6 | The process label is “How the replay works.” | Fixed |
| F-1-7 | The limits heading is “What the CLI does not do.” | Fixed |
| F-1-8 | The 404 h1 is “Page not found.” | Fixed |
| F-1-9 | The terminal control is “Show the sample replay again.” | Fixed |
| F-1-10 | Local-only, exact website storage, and rollback-boundary claims and tests pass. | Fixed |
| F-1-11 | The 24-hour cache claim and test pass. | Fixed |
| F-1-12 | Merchant/refund statements have returned without claim evidence. | **Regressed; BLOCKING as F-3-1 / F-1-12** |
| F-1-13 | The unproved buyer/team license-scope sentence remains absent. | Fixed |
| F-1-14 | Landing and README use “customer system” consistently. | Fixed |
| F-2-1 | The first demo viewport shows a mapped email and complete validation result; Reset visibly restores edited state. | Fixed |
| F-2-2 | All three facts end inside the 1440 × 900 first viewport. | Fixed |
| F-2-3 | `demo-row-count` registers and proves the five-row result. | Fixed |
| F-2-4 | `paid-kit` names and proves the recipes and checklist. | Fixed |
| F-2-5 | The same test inspects exactly five named recipes. | Fixed |
| F-2-6 | The download has structured upload-owner and second-engineer approval fields. | Fixed |
| F-2-7 | `recorded-cli-sample`, `demo-errors`, and `review-files` run the actual CLI and compare observable output. | Fixed |
| F-2-8 | The README heading is “Run a CSV replay.” | Fixed |

The handoff's known millisecond-directory race remains reproducible as F-3-2.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. `/404` and unknown paths
  return 404 with a designed transit-poster page and a home action.
- Every route has `lang=en`, one h1, one main landmark, ordered headings, a
  route-specific title/description/canonical/OG set, SVG favicon, 180 px Apple
  icon, and the 1200 × 630 product OG image.
- Header and footer are consistent. Privacy and Terms are linked. Direct deep
  links load, route changes focus the h1, Back restores scroll and focus, and
  the skip link is first in keyboard order.
- All intended product links returned 200, checkout returned the intended 303
  to Dodo, and the external factory link returned 200. The 404 document's own
  same-document skip link naturally retains its 404 response.
- Fresh 390 px and desktop route checks found no horizontal overflow and zero
  serious or critical Axe findings. `/opt/fleet/lib/verify-url.sh` passed with
  one h1, `lang`, main, complete alt text, labeled buttons, and no application
  console errors. Reduced-motion and visible-focus behavior are covered by the
  passing browser suite.
- The JavaScript is far below 150 kB gzip. No analytics, third-party font or
  script, runtime AI feature, provider key, or Azure model endpoint is present.
- The warm ticket stock, ink/red/brass palette, offset rules, route medallions,
  terminal, and original transit poster match `.factory/design.md`. The result
  is recognizably product-specific rather than a generic SaaS template.

## Missed leverage

No AI or sync feature is implied by this deterministic, local replay job. The
tool already imports CSV plus mapping data and exports the transformed CSV,
field evidence, validation report, and rollback manifest. Adding model output
would reduce reproducibility and would conflict with the useful offline/local
boundary. No decorative AI feature or embedded provider key exists.

## What would make this perfect

Remove or authoritatively test the merchant, payment-data, refund-handler, and
automatic-refund-revocation statements. Replace the millisecond demo directory
with atomic unique creation and add a concurrent uniqueness test to
`@claim:demo-temp`. Then rerun all 25 claim commands, the full suite, both live
viewports, and the complete claims cross-check. Only zero findings earns PASS.
