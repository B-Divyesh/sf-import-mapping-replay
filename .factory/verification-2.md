# Independent verification 2 — PASS

Verified 28 August 2026 against candidate commit
`cbfbd8e9e30dc50423de8dcff0a096eaf43f5619` and the live URL
<https://import-mapping-replay.sociobot.in>.

## Verdict

**PASS — ready for release.** The earlier clean-clone test-gate failure is
fixed in this candidate. No release-blocking defects were found. The deployed
static site byte-matches the production build from the tested commit.

## Cold first read

Pass. A cold live visit says **“Replay CSV mappings with proof”**. It says it
is for implementation engineers preparing customer imports and gives the
first action, **“Try it with sample data”**, with the immediate outcome: “See a
finished replay and three caught errors.” One click opens `/demo`, displaying
the finished sample replay, its three errors, and the persistent “Demo — sample
data, nothing is saved” banner with Reset demo and Start for real actions.

## Clean-clone gates and declared claims

`npm ci` installed 23 packages with zero reported vulnerabilities. Every exact
command in `.factory/claims.json` passed from the product demo entry point:

| Claim | Exact command result |
| --- | --- |
| demo-errors | PASS — `npm test -- --grep @claim:demo-errors` |
| review-files | PASS — `npm test -- --grep @claim:review-files` |
| demo-private | PASS — `npm test -- --grep @claim:demo-private` |
| cli-offline | PASS — `npm test -- --grep @claim:cli-offline` |
| demo-temp | PASS — `npm test -- --grep @claim:demo-temp` |
| cli-replay | PASS — `npm test -- --grep @claim:cli-replay` |
| mapping-v1 | PASS — `npm test -- --grep @claim:mapping-v1` |
| source-unchanged | PASS — `npm test -- --grep @claim:source-unchanged` |
| json-output | PASS — `npm test -- --grep @claim:json-output` |
| actionable-errors | PASS — `npm test -- --grep @claim:actionable-errors` |
| paid-kit | PASS — `npm test -- --grep @claim:paid-kit` |
| license-privacy | PASS — `npm test -- --grep @claim:license-privacy` |

The full `npm test` gate also passed: three Rust unit tests and 18 Playwright
tests. `npm run typecheck`, `cargo fmt -- --check`, `cargo clippy --all-targets
-- -D warnings`, and the exact production build `npm run build` all passed.

## Independent CLI and package exercise

- `target/release/import-mapping-replay --help` and `--version` work.
- A valid bundled replay returned JSON `status: valid`, 3 rows and 0 validation
  errors; output CSV column order and mapped values were correct. It wrote
  `output.csv`, `evidence.json`, `validation.json`, and
  `rollback-manifest.json`. SHA-256 before/after confirmed the source CSV did
  not change.
- The deliberately invalid bundled sample returned `review_required`, 5 rows,
  3 validation errors, wrote the same four review files, and exited 2. An empty
  source returned exit 1 with “check the CSV header or mapping.”
- `demo --json` created a new `/tmp/import-mapping-replay-demo-*` directory and
  reported all artifact paths.
- `cargo package --allow-dirty` passed its package verification. The generated
  `0.1.0` crate was extracted into a fresh temporary consumer, installed with
  `cargo install --path ... --root ...`, and its installed binary returned
  version 0.1.0 and successfully ran `demo --json`.

## Live deployment, security, and browser QA

Production hashes match live for `index.html`, the hashed JS and CSS, Open
Graph image, replay poster, `robots.txt`, and `sitemap.xml`. The matching core
hashes are:

- index.html: `8bd373f4bbd6675cb35737f31fbe64e558b85257ee5bb8c68c10778c1ef78176`
- JS: `4d62468784f24163f5cc5822c7b0d823fb0600d0f808dd573bdd7ff005c7e596`
- CSS: `b147779a7ce40c3436023206d6d0ce151e1709ca4386d514ebd9233c635f86ef`

Live `/`, `/demo`, `/privacy`, `/terms`, and the 404 route each rendered the
right title, exactly one h1, one main landmark, and no horizontal overflow.
Desktop and 390 px mobile visits had no console or page errors. The first Tab
on a cold page reaches the visible 3 px red Skip to main content focus ring;
Enter moves focus to `main`. Reduced motion sets transitions and animations to
0.01 ms. Live Axe scans on all five routes reported zero serious or critical
violations.

The demo used no cookies, localStorage, or sessionStorage, and all observed
demo requests were same-origin. The optional license test uses only
`https://api.sociobot.in/api/v1/products/import-mapping-replay/verify` and
browser-local storage, as its passing claim test verifies. The live CSP permits
only self plus that explicit Sociobot connection; headers also include HSTS,
`nosniff`, strict referrer policy, and a restrictive permissions policy. HTML
uses short revalidation caching and the hashed JS has one-year immutable
caching.

Rate-limit check: a concurrent burst of 40 invalid verification GETs returned
24 HTTP 200 responses before the first HTTP 429 (12 total 429s in the burst).
Every 429 included `Retry-After: 3`. Concurrent ordering means the observed
threshold is approximately 25 requests, not a per-request sequence guarantee.

Initial JS is 18,172 bytes raw / 6,002 bytes gzip; CSS is 10,770 / 3,219; the
mobile poster is 185,892 bytes. All are within the stated budgets. This
environment has no stable Chrome or installed Lighthouse binary, so I did not
claim a new Lighthouse score; the independent browser, Axe, layout, metadata,
and transfer-budget checks above passed.

## Defects by severity

None found.

## Scope notes

This is a local CLI with a static documentation/demo site, not a PWA or backend
application. Service-worker update/offline-page reload, backend persistence,
and sign-in tenant checks therefore do not apply. No product code was changed
during verification.
