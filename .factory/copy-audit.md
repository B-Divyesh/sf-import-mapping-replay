# Copy audit — repair 4

Counts use space-separated words. Code, JSON keys, filenames, prices, and single numbers are counted as interface fragments. No sentence exceeds 22 words. No banned marketing word appears.

## Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Local CSV replay | 3 | Pass |
| Replay CSV imports before upload | 5 | Pass |
| For implementation engineers who need a reviewed output CSV and error report before each customer upload. | 16 | Pass |
| Try it with sample data | 5 | Pass |
| See a finished replay and three caught errors. | 8 | Pass |
| CSV files stay on your computer. | 6 | Pass |
| The CLI runs without internet. | 5 | Pass |
| The core CLI needs no license. | 6 | Pass |
| The team kit costs £24 once. | 6 | Pass |
| Recorded from the bundled CLI | 5 | Pass |
| See the failed rows before upload | 6 | Pass |
| The sample replay transforms five customers and writes four review files. | 11 | Pass |
| It catches three source errors. | 5 | Pass |
| Replay complete: 5 source rows | 5 | Pass |
| Validation: 3 errors — review required | 6 | Pass |
| Value is not an email address; correct it. | 8 | Pass |
| Value already appears on source row 3; make it unique. | 10 | Pass |
| Value is not allowed; use starter, growth, or enterprise. | 9 | Pass |
| Wrote output.csv, evidence.json, validation.json, rollback-manifest.json | 4 | Pass |
| Show the sample replay again | 5 | Pass |
| output.csv / Mapped rows | 1 / 2 | Pass |
| evidence.json / Before and after | 1 / 3 | Pass |
| validation.json / Three issues | 1 / 2 | Pass |
| rollback-manifest.json / Original rows | 1 / 2 | Pass |
| How the replay works | 4 | Pass |
| Replay an import in three steps | 6 | Pass |
| Map the columns | 3 | Pass |
| Name each source and target field in a version 1 JSON file. | 12 | Pass |
| Run the local CLI | 4 | Pass |
| Apply trim, case, replacement, and date rules without uploading the CSV. | 11 | Pass |
| Review the evidence | 3 | Pass |
| Check row errors, before-and-after values, hashes, and untouched source rows. | 10 | Pass |
| Install locally / Build one binary | 2 / 3 | Pass |
| This package declares Rust 1.85 as its minimum compiler. | 9 | Pass |
| No account is required. | 4 | Pass |
| What the CLI does not do | 6 | Pass |
| It does not connect to a customer system. | 8 | Pass |
| It processes a source CSV when you run the command. | 10 | Pass |
| It does not change a source CSV. | 7 | Pass |
| A rollback manifest cannot undo records imported elsewhere. | 8 | Pass |
| Keep the source CSV, mapping, and review files together for each customer upload. | 13 | Pass |
| Optional team kit / Standardise the review handoff | 3 / 4 | Pass |
| The team kit adds mapping recipes and a sign-off checklist. | 10 | Pass |
| Five named mapping recipes for common template fields. | 8 | Pass |
| A review checklist with upload owner and second-engineer approval fields. | 10 | Pass |
| Team mapping kit / One-time purchase. | 3 / 2 | Pass |
| Checkout opens through Sociobot on Dodo Payments. | 7 | Pass |
| Dodo Payments is the merchant of record and handles refunds. | 10 | Pass |
| A refund revokes the license automatically. | 7 | Pass |
| Buy the team kit | 4 | Pass |
| A revoked license locks the team kit. | 7 | Pass |
| Have a license? Paste it here / Verify license | 6 / 2 | Pass |
| The core CLI does not need a license. | 8 | Pass |
| Read the privacy notice and terms. | 6 | Pass |
| Replay local CSV mappings with review evidence. | 7 | Pass |
| Privacy / Terms / Built by Param Factory | 1 / 1 / 4 | Pass |

## Demo route

| Copy | Words | Result |
| --- | ---: | --- |
| Five sample customers · three errors | 5 | Pass |
| Review a finished CSV replay | 5 | Pass |
| Inspect one mapped value and fix a sample error. | 10 | Pass |
| Nothing is saved. | 4 | Pass |
| Source email | 2 | Pass |
| Row 5 needs review | 5 | Pass |
| email · not-an-email | 2 | Pass |
| Enter an email address. | 4 | Pass |
| Fix the sample email | 5 | Pass |
| Sample correction applied. | 3 | Pass |
| Two errors remain. | 3 | Pass |
| Reset demo | 2 | Pass |

## Other routes

The demo, Privacy, Terms, and 404 routes were extracted from rendered pages. No sentence exceeds 22 words.

| New or changed copy | Words | Result |
| --- | ---: | --- |
| Checkout opens through Sociobot on Dodo Payments. | 7 | Pass |
| Dodo Payments is the merchant of record and handles payment data. | 11 | Pass |
| After checkout, this site stores the returned license, removes it from the address bar, and verifies it with Sociobot. | 19 | Pass |
| Dodo Payments handles refunds. | 5 | Pass |
| A refund revokes the license automatically. | 7 | Pass |
| Dodo Payments is the merchant of record and handles refunds. | 10 | Pass |
| The site stores a returned license, removes it from the address bar, and verifies it with Sociobot. | 17 | Pass |

The route headings remain literal: “Review a finished CSV replay”, “Keep customer CSV files local”, “Use replay files before uploading”, and “Page not found”.

## README

| Copy | Words | Result |
| --- | ---: | --- |
| Replay customer CSV imports from one reviewed mapping file. | 9 | Pass |
| The CLI writes an output CSV, field evidence, validation results, and original source rows. | 14 | Pass |
| It is for implementation engineers who prepare repeatable template uploads. | 10 | Pass |
| It does not connect to a customer system or undo records already imported elsewhere. | 14 | Pass |
| The command copies a realistic customer CSV and mapping into a new temporary directory. | 14 | Pass |
| It runs the replay and prints every output path. | 9 | Pass |
| This package declares Rust 1.85 as its minimum compiler. | 9 | Pass |
| The package is ready for registry review with cargo package. | 10 | Pass |
| The factory publishes releases. | 4 | Pass |
| Add --json for machine-readable command output. | 6 | Pass |
| The rollback manifest reconstructs input to this local transformation. | 9 | Pass |
| It cannot undo records already uploaded to another product. | 10 | Pass |
| Mappings have a stable integer version. | 6 | Pass |
| Version 1 maps named source columns to target columns in declaration order. | 12 | Pass |
| Version 1 transforms are trim, lowercase, uppercase, replace, and date. | 10 | Pass |
| Validation rules are required, email, one_of, and unique. | 8 | Pass |
| A field may use default when its source cell is empty. | 11 | Pass |
| Missing mapped columns return exit code 1 and say to check the CSV header or mapping. | 16 | Pass |
| Validation failures return exit code 2 after writing review files. | 10 | Pass |
| The CLI rejects a source or mapping that resolves to an output artifact. | 12 | Pass |
| It builds all four artifacts in a staging directory and publishes them only after the full replay succeeds. | 17 | Pass |
| A malformed later row leaves no partial artifact. | 8 | Pass |
| If a complete replay already exists, a failed rerun leaves all four prior files unchanged. | 15 | Pass |
| npm run build compiles the release binary and the Vite site. | 11 | Pass |
| Static deployment output lands in dist/site, with index.html at that root. | 11 | Pass |
| The site demo is available at /demo or /?demo=1 and uses only bundled sample data. | 15 | Pass |
| Deploy dist/site to Azure Static Web Apps. | 7 | Pass |
| Its configuration rewrites known routes, returns the custom 404 for unknown URLs, and sets security headers. | 16 | Pass |
| The factory publishes the site at import-mapping-replay.sociobot.in. | 7 | Pass |
| CSV processing runs in the local binary. | 7 | Pass |
| The CLI makes no network requests while replaying a CSV. | 10 | Pass |
| The website stores only a pasted license and its last verification result in your browser. | 14 | Pass |
| The core CLI needs no license. | 6 | Pass |
| A one-time £24 license provides five named mapping recipes and a checklist with upload owner and second-engineer approval fields. | 19 | Pass |
| The buy link opens Dodo Payments checkout through Sociobot. | 9 | Pass |
| Dodo Payments is the merchant of record and handles refunds. | 10 | Pass |
| A refund revokes the license automatically. | 7 | Pass |
| After checkout, the site stores the returned license in localStorage, removes it from the address bar, and verifies it with Sociobot. | 21 | Pass |

## Terminology

| Concept | One term |
| --- | --- |
| Input table | source CSV |
| Declarative rules | mapping |
| One execution | replay |
| Transformed table | output CSV |
| Before-and-after record | evidence |
| Original-row recovery file | rollback manifest |
| Connected external product | customer system |
| Paid download | team kit |
| Purchase proof | license |

Catalog description: “Replay customer CSV imports into reviewed output and error files before upload.” (79 characters.)
