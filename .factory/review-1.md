# Adversarial first-read review 1 — FAIL

Reviewed 29 August 2026 against live `https://import-mapping-replay.sociobot.in`,
commit `2cb3504615280c1971d101964d5ee5020f03561b`, and a new clean clone.
This is a full re-run, not a diff review.

## Verdict: FAIL

There are 14 findings, including two blocking routing failures. `PASS` requires
zero findings and zero untested claims.

## Cold first read

I checked fresh 390 × 844 and 1440 × 900 contexts before scrolling. My own
reading was: this is a local command-line tool for implementation engineers to
rerun a customer CSV mapping, inspect errors, and retain evidence. I should
click **Try it with sample data** to see a finished run with errors. The
audience and first action are clear. The exact h1 **“Replay CSV mappings with
proof”** does not itself name the output; that is F-1-5, not a first-read
blocker, because the supporting line and action answer all three required
questions.

At 390 px there was no horizontal overflow. The identity follows the recorded
transit-poster thesis (rails, ticket-like controls, original poster art) and
does not look like a generic SaaS template. No console or page errors occurred.

## Demo and sandbox

PASS for this section. **Try it with sample data** opens `/demo` in one click.
The first screen shows five sample customers, three specific errors, and four
named files. Its sticky banner says **“Demo — sample data, nothing is saved”**
and includes **Reset demo** and **Start for real**. Fresh `/demo` requested
only same-origin document/CSS/JS, and cookies/localStorage were empty before
and after reset. With a pre-existing real-license sentinel, demo did not alter
it. Reset restored the displayed sample and focused the results heading. The
CLI demo is documented and clean-clone testing confirms it creates a new temp
directory.

## Copy audit

Counts use space-separated words. Meaningful headings, controls, labels,
terminal text, and footer text are included; code blocks/JSON keys are not
sentences. No item exceeds 22 words. CLI, CSV, and JSON are suitable for the
explicit implementation-engineer audience. Flags appear by finding id.

### Landing page: every sentence/meaningful fragment

| Copy | Words | Result |
| --- | ---: | --- |
| Local CSV replay | 3 | Pass |
| Replay CSV mappings with proof | 5 | F-1-5 |
| For implementation engineers who need each customer import reviewed, rerun, and traced. | 12 | Pass |
| Try it with sample data | 5 | Pass |
| See a finished replay and three caught errors. | 8 | Pass |
| CSV files stay on your computer. | 6 | F-1-10 |
| The CLI runs without internet. | 6 | `cli-offline` |
| The core CLI needs no license. | 6 | `core-no-license` |
| The team kit costs £24 once. | 6 | `paid-kit` |
| Recorded from the real CLI | 5 | Pass |
| See the failed rows before upload | 6 | Pass |
| The sample replay transforms five customers and writes four review files. | 11 | `demo-errors`/`review-files` |
| It catches three source errors. | 5 | `demo-errors` |
| local terminal · sample run | 5 | Pass |
| Replay complete: 5 source rows | 5 | `cli-offline` |
| Validation: 3 errors — review required | 5 | `demo-errors` |
| Value is not an email address; correct it. | 9 | Pass |
| Value already appears on source row 3; make it unique. | 11 | Pass |
| Value is not allowed; use starter, growth, or enterprise. | 11 | Pass |
| Wrote output.csv, evidence.json, validation.json, rollback-manifest.json | 4 | `review-files` |
| Replay recording | 2 | F-1-9 |
| output.csv / Mapped rows | 1 / 2 | `review-files` / Pass |
| evidence.json / Before and after | 1 / 3 | `review-files` / Pass |
| validation.json / Three issues | 1 / 2 | `review-files` / `demo-errors` |
| rollback-manifest.json / Original rows | 1 / 2 | `review-files` / Pass |
| One route, every time | 4 | F-1-6 |
| Replay an import in three steps | 6 | Pass |
| Map the columns | 3 | Pass |
| Name each source and target field in a version 1 JSON file. | 12 | Pass |
| Run the local CLI | 4 | Pass |
| Apply trim, case, replacement, and date rules without uploading the CSV. | 11 | F-1-10 |
| Review the evidence | 3 | Pass |
| Check row errors, before-and-after values, hashes, and untouched source rows. | 10 | Pass |
| Install locally / Build one binary | 2 / 3 | Pass |
| This package declares Rust 1.85 as its minimum compiler. | 9 | `rust-msrv` |
| No account is required. | 4 | `cli-offline` |
| This tool stays narrow | 4 | F-1-7 |
| It does not connect to a SaaS account. | 8 | F-1-14 |
| It processes a source CSV when you run the command. | 10 | `cli-replay` |
| It does not change a source CSV. | 7 | `source-unchanged` |
| A rollback manifest cannot undo records imported elsewhere. | 8 | F-1-10 |
| Keep the source CSV, mapping, and review files together for each customer upload. | 13 | Pass |
| Optional team kit / Standardise the review handoff | 3 / 4 | Pass |
| The core CLI needs no license. | 6 | `core-no-license` |
| The team kit adds mapping recipes and a sign-off checklist. | 10 | `paid-kit` |
| Five mapping recipes for common template fields. | 7 | `paid-kit` |
| A review checklist with owner and approval fields. | 8 | `paid-kit` |
| Team mapping kit / £24 | 3 / 1 | Pass / `paid-kit` |
| One-time purchase. | 2 | `paid-kit` |
| Sociobot and Dodo are the merchant of record. | 8 | F-1-12 |
| Buy the team kit | 4 | Pass |
| Refunds are handled by the merchant. | 6 | F-1-12 |
| A revoked license locks the team kit. | 7 | `revoked-license-lock` |
| Have a license? Paste it here / Verify license | 6 / 2 | Pass |
| The core CLI does not need a license. | 8 | `core-no-license` |
| Read the privacy notice and terms. | 6 | Pass |
| Replay local CSV mappings with review evidence. | 7 | `cli-replay` |
| Privacy / Terms / Built by Param Factory | 1 / 1 / 4 | Pass |
| Version 0.1.0 · build 2026.08.28 | 4 | Pass |

### README: every prose sentence/meaningful fragment

| Copy | Words | Result |
| --- | ---: | --- |
| Import Mapping Replay | 3 | Pass |
| Replay customer CSV cleanup from one reviewed mapping file. | 9 | Pass |
| The CLI writes the transformed CSV, field-level evidence, validation results, and the untouched source rows needed to reconstruct the run. | 20 | `cli-replay`/`review-files` |
| It is for implementation engineers who prepare repeatable template uploads. | 9 | Pass |
| It does not connect to customer systems or undo records already imported elsewhere. | 13 | F-1-10/F-1-14 |
| Try the bundled sample | 4 | Pass |
| The command copies a realistic customer CSV and mapping into a new temporary directory, runs the replay, and prints every output path. | 21 | `demo-temp` |
| Nothing is uploaded or saved outside that directory. | 8 | F-1-10 |
| Install / Use it / Mapping format / Develop and verify / Deploy / Privacy and price / License | 1–3 | Pass |
| This package declares Rust 1.85 as its minimum compiler. | 9 | `rust-msrv` |
| The package is ready for registry review with cargo package. | 9 | Developer instruction |
| The factory publishes releases. | 4 | Developer instruction |
| Add --json for machine-readable command output. | 5 | `json-output` |
| A run writes: | 3 | `review-files` |
| rows in the mapping's declared column order. | 7 | `cli-replay` |
| source and output hashes plus before/after samples. | 7 | `cli-replay` |
| every validation issue with its source row. | 7 | `cli-replay` |
| the original source rows and source hash. | 7 | `cli-replay` |
| The rollback manifest reconstructs input to this local transformation. | 9 | `cli-replay` |
| It cannot undo records already uploaded to another product. | 10 | F-1-10 |
| Mappings have a stable integer version. | 6 | `mapping-v1` |
| Version 1 maps named source columns to target columns in declaration order. | 12 | `mapping-v1` |
| Version 1 transforms are trim, lowercase, uppercase, replace, and date. | 10 | `mapping-v1` |
| Validation rules are required, email, one_of, and unique. | 8 | `mapping-v1` |
| A field may use default when its source cell is empty. | 10 | `mapping-v1` |
| Malformed CSV, missing columns, unknown mapping versions, invalid dates, and unwritable output paths return non-zero exit codes with a direct next step. | 22 | Only missing-columns case is tested |
| Validation failures return exit code 2 after the review files are written. | 11 | `cli-replay` |
| npm run build compiles the release binary and the Vite site. | 11 | Local build verified |
| Static deployment output lands in dist/site, with index.html at that root. | 11 | Local build verified |
| The site demo is available at /demo or /?demo=1 and uses only bundled sample data. | 15 | `demo-private` |
| Deploy dist/site to a static host with SPA fallbacks enabled. | 10 | Developer instruction |
| The included Azure Static Web Apps configuration supplies the fallback, security headers, caching types, and custom 404 page. | 17 | F-1-2 |
| The factory publishes the site at https://import-mapping-replay.sociobot.in. | 5 | Pass |
| CSV processing runs in the local binary. | 7 | F-1-10 |
| The CLI has no telemetry and makes no network requests. | 10 | F-1-10 |
| The website stores only a pasted license and its last verification result in your browser. | 15 | F-1-10 |
| See the site’s /privacy and /terms pages. | 7 | Pass |
| The core CLI needs no license. | 6 | `core-no-license` |
| A one-time £24 license provides mapping recipes and a sign-off checklist. | 11 | `paid-kit` |
| MIT. / See LICENSE. | 1 / 2 | Pass |

## Claims and clean-clone verification

I read `.factory/claims.json`, cloned the repo with `git clone --no-hardlinks`,
ran `npm ci`, then ran every listed command independently. All 15 passed:
`demo-errors`, `review-files`, `demo-private`, `cli-offline`, `demo-temp`,
`cli-replay`, `mapping-v1`, `source-unchanged`, `json-output`,
`actionable-errors`, `paid-kit`, `license-privacy`, `core-no-license`,
`rust-msrv`, and `revoked-license-lock`. Local `npm test` passed (3 Rust, 24
Playwright); `npm run build` passed and created `dist/site` (5.99 kB gzip JS,
3.20 kB gzip CSS). Live checkout GET and HEAD both returned 303 to Dodo.

## Structure, privacy, missed leverage, and history

I checked live `/`, `/demo`, `/privacy`, `/terms`, `/404`, unknown routes,
robots, sitemap, favicon, apple icon, and every landing link. Internal links
returned 200; checkout returned 303; sociobot.in returned 200. Routes have
`lang=en`, one h1 and main, title, description, canonical, favicon, visible
focus, and reduced-motion support. The skip link is first in keyboard order;
route changes focus the h1. Demo requests are same-origin only. No external
fonts/scripts or provider keys were found.

The brief is for a local replay CLI. The four review-file exports are the
implied export; no AI, sync, or account feature is implied or needed. There
are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I also
read all verification reports and handoff. Their earlier defects are fixed:
the clean test command builds the CLI, first Tab is the skip link, checkout is
live, and free-core/Rust/revoked-license claims now have tests.

## Findings

### F-1-1 — BLOCKING — Back loses reading position

**Evidence:** Live mobile: set `/` to `scrollY=4000`, open `/demo`, browser
Back; `/` returned at `scrollY=0` with focus on `#page-title`. In
`site/src/main.ts`, every `render(true)` calls `window.scrollTo(0, 0)`.

**Why:** Back must restore scroll and focus. A visitor who had reached pricing
or limits loses their place.

**Fix:** Save scroll coordinates in `history.state` before client navigation
and restore them on `popstate`; do not reset to zero. Focus/announce the h1
with `preventScroll`. Add a Playwright Back-at-4000px assertion.

### F-1-2 — BLOCKING — Unknown URLs return 200, not a real 404

**Evidence:** Direct live `GET /does-not-exist` and `GET /404` return HTTP 200.
The app draws a 404 but `navigationFallback` swallows the missing path; config
rewrites errors to `/404.html`, which the repo does not ship.

**Why:** Crawlers and monitoring receive a success for a nonexistent address.
This is not the required real 404; broken routing is blocking.

**Fix:** Ship a designed `404.html`; rewrite only known SPA routes (`/`,
`/demo`, `/privacy`, `/terms`) to the app and allow all others to reach the
404 response override with status 404. Test unknown-path status and known
deep-link loading live.

### F-1-3 — Medium — Privacy is hidden in the 390 px header

**Evidence:** Live 390 px header has Demo and How it works only. CSS says
`.site-nav a:nth-child(3) { display: none; }` under 760 px.

**Why:** The standard header must consistently include Privacy; footer access
does not replace navigation for a privacy-focused product.

**Fix:** Keep Privacy visible or add an accessible menu containing it. Test
that the mobile header link is visible and works.

### F-1-4 — Medium — Non-home social metadata is stale

**Evidence:** On live `/demo`, `/privacy`, `/terms`, and `/404`, document
title/description/canonical change, but OG and Twitter title/description stay
**“Import Mapping Replay — replay CSV mappings”** and the home description.

**Why:** Shared non-home routes describe the unrelated home page.

**Fix:** Add per-route OG/Twitter fields to `routeData`, update them in render,
and emit route-specific static metadata for non-JS crawlers. Test all fields.

### F-1-5 — Minor — H1 result is vague

**Quote:** **“Replay CSV mappings with proof”**.

**Why:** “Proof” is not a recognisable product result.

**Fix:** Use **“Replay CSV imports before upload”**; make the lede name the
reviewed output CSV and error report.

### F-1-6 — Minor — Mood heading carries no information

**Quote:** **“One route, every time”**.

**Why:** It is a transit metaphor rather than a section name.

**Fix:** Replace with **“How the replay works”** or remove it.

### F-1-7 — Minor — Limits heading is vague

**Quote:** **“This tool stays narrow”**.

**Why:** It does not name the section in a heading list.

**Fix:** Replace with **“What the CLI does not do”**.

### F-1-8 — Minor — 404 H1 is a metaphor

**Quote:** **“This mapping line ends here”**.

**Why:** A bad URL needs the status, not brand lore.

**Fix:** Use **“Page not found”** as h1; keep rail styling decorative.

### F-1-9 — Minor — Button does not name its result

**Quote:** **“Replay recording”**.

**Why:** It is unclear whether it reruns the CLI or replays terminal text.

**Fix:** Rename it **“Show the sample replay again”** and assert that name.

### F-1-10 — Medium — Local-only/privacy promises are unlisted

**Quotes:** **“CSV files stay on your computer.”**, **“without uploading the
CSV”**, **“Nothing is uploaded or saved outside that directory.”**, **“The CLI
has no telemetry and makes no network requests.”**, **“The website stores
only…”**, and rollback/no-external-effect statements in landing, README,
Privacy, and Terms.

**Why:** `cli-offline` proves a demo completes behind a closed proxy. It does
not assert zero network calls, zero source-byte egress, zero telemetry, exact
website storage, or rollback scope. These visitor promises have no matching
claims entry.

**Fix:** Remove/narrow them to existing claims, or add `cli-local-only`,
`website-license-storage-only`, and `rollback-local-scope`. Record outbound
network syscalls/requests during a CLI run, assert exact browser storage after
license flow, and assert rollback output has no external operation.

### F-1-11 — Minor — Daily license-cache promise is untested

**Quote:** Privacy: **“The cached result is checked at most once each day.”**

**Why:** `license-privacy` makes one verification only; no claim covers this
concrete frequency promise.

**Fix:** Add `license-cache-day`: two loads within 24 hours make one request;
a simulated time beyond 24 hours makes one new request. Or remove the claim.

### F-1-12 — Minor — Merchant/refund/card-data statements are unlisted

**Quotes:** **“Sociobot and Dodo are the merchant of record.”**, **“Refunds
are handled by the merchant.”**, and **“This site does not receive card
details.”**

**Why:** The checkout test proves only a redirect to Dodo, not these promises.

**Fix:** Keep only **“Checkout opens on Dodo”** with the existing test, or add
contract/API evidence and a scoped claim test for each statement.

### F-1-13 — Minor — License scope is an unlisted purchase condition

**Quote:** Terms: **“The license covers one buyer and their internal
implementation team.”**

**Why:** No claim/test covers or enforces this scope.

**Fix:** Put identical scope in hosted checkout terms and test its presence,
or remove it here.

### F-1-14 — Minor — One concept has two names

**Quotes:** **“SaaS account”** on landing; **“customer systems”** in README.

**Why:** The terminology audit requires one term for the same boundary.

**Fix:** Use **“customer system”** everywhere and update the terminology table.

## What would make this perfect

Restore scroll on Back, return an actual 404, retain Privacy in the mobile
header, and give every route real social metadata. Then make the four copy
phrases plain, use one external-system term, and either test or remove every
privacy, billing, refund, and licence-scope promise. Re-run all clean-clone
claims plus desktop and 390 px live checks; only zero findings earns PASS.
