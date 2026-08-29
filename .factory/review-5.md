# Adversarial first-read review 5 — FAIL

Reviewed 29 August 2026 against live
`https://import-mapping-replay.sociobot.in`, candidate
`734443a751aa9ed2eef413a577c84b829de65b23`, and a no-hardlinks clean clone.
This was a full review, not a diff review.

## Verdict: FAIL

There is one blocking finding. The ordinary direct demo is isolated, but the
required landing-to-demo path can write a pending real-license result to real
browser storage after the demo banner appears. PASS requires zero findings and
no untested part of a claim.

## Finding

### F-5-1 — BLOCKING — A pending real-license check writes storage during demo mode

**Exact quote and location:** Live `/demo` banner: **“Demo — sample data,
nothing is saved.”** `.factory/demo.md` also says **“the site demo does not use
browser storage”** and **“demo mode never reads a real CSV, mapping, or
license.”** In `site/src/main.ts:375-377`, the landing route starts verification
for a stored license. After its awaited request finishes,
`site/src/main.ts:331` writes `sb_license_verdict:import-mapping-replay` without
checking whether the route has since changed to `/demo`.

**Reproduction:** In a fresh 390 × 844 context, seed only
`sb_license:import-mapping-replay=REAL-SENTINEL`; hold the Sociobot verification
response; open `/`; click **Demo**; confirm the demo banner; release a valid
response. While `/demo` remains visible, localStorage changes from the one
seeded key to two keys by adding:

```text
sb_license_verdict:import-mapping-replay={"valid":true,"checked":1788012635324}
```

The existing `@claim:demo-private` and direct-demo test start on `/demo`, so
they cannot detect an in-flight request started by the required one-click path.

**Why this fails:** The visitor is shown an absolute “nothing is saved” promise
while the site writes real account state. This breaks the required separation
between demo state and real storage, even though the sample correction itself
is in memory.

**Concrete fix:** Abort any pending license request before rendering `/demo`
and re-check the current route before writing its result. Add a
`@claim:demo-private` case that delays verification, navigates from `/` to
`/demo`, completes the response, and asserts that the real license and verdict
keys remain byte-for-byte unchanged and no cross-origin request remains active
in demo mode.

## Cold first read

I opened fresh 390 × 844 and 1440 × 900 contexts without scrolling. My reading
from both first screens was:

- What it does: replays a customer CSV import before upload and produces a
  reviewed output CSV and error report.
- Who it is for: implementation engineers preparing customer uploads.
- What to click first: **Try it with sample data**.

The exact copy was **“Replay CSV imports before upload”**, **“For implementation
engineers who need a reviewed output CSV and error report before each customer
upload”**, and **“Try it with sample data.”** The action is immediately followed
by **“See a finished replay and three caught errors.”** All three product facts
also fit in both first viewports. Neither viewport had horizontal overflow,
console errors, or page errors.

## Copy audit

Counts use whitespace-separated words. Code blocks are commands rather than
sentences. Headings, controls, labels, dynamic states, image alt text, and
terminal fragments are included so context-free and result-naming rules can be
checked. No item exceeds 22 words. No banned marketing adjective, unexplained
jargon, inconsistent product term, mood heading, metaphor heading, or
non-result action remains. `CLI`, `CSV`, `JSON`, hashes, and exit codes fit the
explicit implementation-engineer audience. F-5-1 concerns the demo banner,
not landing or README copy coverage.

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
| Install | Install from this source checkout. | 5 | Pass: direct instruction |
| Install | Run cargo package to check the release archive. | 8 | Pass: direct instruction |
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
| Deploy | Deploy dist/site to Azure Static Web Apps. | 7 | Pass: direct instruction |
| Deploy | Its configuration serves known routes, returns the custom 404 for unknown URLs, and sets security headers. | 16 | Pass: `site-routing-headers` |
| Deploy | Production site: import-mapping-replay.sociobot.in | 3 | Pass: label |
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
| License | MIT. | 1 | Pass: `mit-license` |
| License | See LICENSE. | 2 | Pass: direct instruction |

Terminology is consistent: **source CSV**, **mapping**, **replay**, **output
CSV**, **evidence**, **rollback manifest**, **customer system**, **team kit**,
and **license** each have one meaning. The catalog description is verb-first,
plain, and under 120 characters.

## Demo and sandbox

The main demo presentation passes. **Try it with sample data** opens `/demo`
in one click. At 390 × 844, the full mapped Maya Rivera email and complete
row-5 `not-an-email` result finish above y=532. The persistent banner has
**Reset demo** and **Start for real**. Correcting the sample changes the value
to `samira.chen@atlas.example`, reduces errors from three to two, and moves
focus to the live status. Reset restores the invalid value, three errors, and
focuses **The replay needs review**.

A direct fresh `/demo` with two real-storage sentinels made only same-origin
document/JS/CSS requests and left localStorage byte-identical; cookies,
sessionStorage, IndexedDB, and CacheStorage stayed empty. F-5-1 is specific to
the required transition from `/` while a real-license request is pending.

From a separate temporary working directory, the clean-clone CLI command
`target/debug/import-mapping-replay demo --json` processed five rows, reported
three errors, created a new `/tmp/import-mapping-replay-demo-*` directory, and
wrote the four named artifact paths there.

## Claims verification

I read `.factory/claims.json`, cloned the candidate with
`git clone --no-hardlinks`, ran `npm ci`, and ran every listed `test` command
independently. All 28 registered commands passed:

| Claim | Result |
| --- | --- |
| `demo-errors` | PASS |
| `demo-row-count` | PASS |
| `recorded-cli-sample` | PASS |
| `review-files` | PASS |
| `demo-private` | PASS, but misses the route-transition race in F-5-1 |
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

No listed command failed and no landing/README claim lacks an entry. The
absolute demo-storage promise is not fully tested because its registered test
does not exercise the required landing-to-demo transition.

The same clean clone also passed `npm test` (7 Rust tests and 64 Playwright
tests; 2 intentional project skips), `npm run typecheck`, `cargo fmt --
--check`, `cargo clippy --all-targets -- -D warnings`, `npm run build`, and
`cargo package`. The build produced `dist/site`; JavaScript is 7.12 kB gzip
and CSS is 3.67 kB gzip. The live route documents and hashed JS/CSS are
byte-identical to that build.

## Earlier findings rechecked on live and in code

I read reviews 1–4, polish reports 1–4, all available verification reports,
and the prior handoff. Each earlier finding was checked again against the live
site and current source/tests.

| Earlier ID | Live and code confirmation | Status |
| --- | --- | --- |
| F-1-1 | Clean mobile and desktop History Back runs restored y=4480 and y=3203; `popstate` restores stored coordinates and focuses the h1. | Fixed |
| F-1-2 | `/404` and `/review-5-missing` returned the designed page with HTTP 404; known routes returned 200; config has known rewrites and a 404 override. | Fixed |
| F-1-3 | Privacy is visible in the 390 px header; CSS and browser tests retain 44 px targets. | Fixed |
| F-1-4 | Every route's response and rendered DOM has route-specific title, description, canonical, OG, and Twitter metadata. | Fixed |
| F-1-5 | Live h1 remains “Replay CSV imports before upload.” | Fixed |
| F-1-6 | Live process label remains “How the replay works.” | Fixed |
| F-1-7 | Live limits heading remains “What the CLI does not do.” | Fixed |
| F-1-8 | Live 404 h1 remains “Page not found.” | Fixed |
| F-1-9 | Live terminal control remains “Show the sample replay again.” | Fixed |
| F-1-10 | Local-only, exact website-storage, and rollback-scope claims are registered and pass; direct demo requests remain same-origin. | Fixed |
| F-1-11 | The 24-hour cache claim and its time-bound browser test pass. | Fixed |
| F-1-12 | Merchant-of-record, refund, and card-data promises remain absent; only the tested Dodo redirect statement remains. | Fixed |
| F-1-13 | The unproved buyer/team license scope remains absent from Terms and source. | Fixed |
| F-1-14 | Landing and README consistently use “customer system.” | Fixed |
| F-2-1 | The first mobile demo viewport contains a mapped value and full error; correction and Reset visibly change and restore it. | Fixed |
| F-2-2 | All three product facts fit in both 390 × 844 and 1440 × 900 first screens. | Fixed |
| F-2-3 | `demo-row-count` remains registered and proves five source and output rows. | Fixed |
| F-2-4 | `paid-kit` registers and proves the recipes and checklist. | Fixed |
| F-2-5 | The paid-kit test inspects exactly five named recipes. | Fixed |
| F-2-6 | The kit test confirms structured upload-owner and second-engineer-approval fields. | Fixed |
| F-2-7 | Recording, error, and artifact tests execute and compare the real bundled CLI output. | Fixed |
| F-2-8 | README heading remains “Run a CSV replay.” | Fixed |
| F-3-1 / F-1-12 | The earlier merchant/refund regression remains absent on landing, Privacy, Terms, and README. | Fixed |
| F-3-2 | `demo-temp` starts 40 concurrent demos and confirms 40 distinct complete directories. | Fixed |
| F-4-1 | README no longer implies a published release; it says to install from this checkout. | Fixed |
| F-4-2 | README now says “Run `cargo package` to check the release archive”; the command passes. | Fixed |
| F-4-3 | `build-artifacts` registers and checks the release binary and static site. | Fixed |
| F-4-4 | `build-artifacts` checks `dist/site` and route documents. | Fixed |
| F-4-5 | `site-routing-headers` checks route status, custom 404, and security headers; live headers also pass. | Fixed |
| F-4-6 | README uses the non-sentence label “Production site:” and the live URL. | Fixed |
| F-4-7 | `mit-license` checks Cargo metadata and the complete MIT text; live Terms states the same license. | Fixed |

No earlier finding is reopened. F-5-1 is a newly tested transition race.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. `/404` and a new unknown
  URL return 404 with the designed transit-poster page and a home action.
- Each route has `lang=en`, one h1, one main landmark, ordered headings, a
  route-specific title/description/canonical/OG/Twitter set, favicon, 180 px
  Apple icon, and the 1200 × 630 product OG artwork.
- Header/footer, Privacy/Terms links, skip link, deep links, route focus and
  announcement, clean Back restoration, and reduced-motion CSS are present.
- Every navigation link returned 200, Sociobot returned 200, and the checkout
  returned the registered 303 to Dodo. The same-document skip link on the 404
  page correctly targets its existing `#main` despite the document's 404
  status. Robots, sitemap, favicon, Apple icon, and OG image returned correctly.
- Axe reported zero violations on all six checked routes at both viewport
  sizes. Known routes emitted no console/page errors. The expected document
  404 is the only browser “failed to load resource” message on 404 pages.
- Security headers are live, including CSP as a response header with
  `frame-ancestors`, `nosniff`, referrer policy, and permissions policy.
- The warm ticket paper, ink/red/brass palette, clipped corners, rails,
  numbered stops, terminal, asymmetric layout, and original poster art match
  `.factory/design.md` and are not a generic SaaS template.

## Missed leverage

No additional AI, sync, or import/export feature is implied. The deterministic
local CLI already imports a CSV and mapping and exports the output CSV,
evidence, validation report, and rollback manifest. Model output would weaken
the reproducibility at the center of the brief. No decorative AI control,
embedded provider key, analytics, remote font, or third-party script is
present.

## What would make this perfect

Close F-5-1: cancel or invalidate in-flight license verification when demo mode
starts, prevent its completion handler from touching real storage, and extend
`@claim:demo-private` with the delayed-response landing-to-demo test. Then
repeat this cold review. No other defect or missing feature was found.
