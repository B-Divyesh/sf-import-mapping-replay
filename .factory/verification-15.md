# Independent verification 15 — PASS

Verified on 29 August 2026 against candidate commit
`a410f4010aea7821151be2b34beb53e608cef443` and production
<https://import-mapping-replay.sociobot.in>.

## Verdict

**PASS.** The candidate meets the researched brief: a local, versioned CSV
mapping replay produces deterministic output, field-level evidence,
validation findings, and a source-row rollback manifest. It does not connect
to a customer system and clearly limits the rollback manifest to local source
data. The live deployment is the candidate build. No release-blocking defect
was found; the previously mentioned deployment-only failure did not reproduce.

## First-read and demo gate

Pass. A cold desktop visit says **“Replay CSV imports before upload”**, names
**implementation engineers** as the audience, and provides the visible
one-click action **“Try it with sample data”** with the adjacent explanation
that it shows a completed replay and three caught errors. The cold request log
contained only the same-origin document, JavaScript, CSS, and hero image, with
no console or page errors.

Keyboard Enter on that primary action opened `/?demo=1`; the demo banner said
**“Demo — sample data, nothing is saved”**, offered Reset demo and Start for
real, and Reset worked with Space. At 390 x 844 the demo remained readable,
had no horizontal overflow, and its controls were at least 44 px high.

## Required claims — 33/33 passed

From the clean candidate checkout, after `npm ci`, I ran every exact `test`
command in `.factory/claims.json` separately and sequentially before the
general test run. All 33 commands exited zero. This included the bundled
five-row/three-error CLI demo, four review files, offline and network-denied
operation, 40 concurrent temporary demos, deterministic evidence, email and
CSV boundaries, atomic output publication, machine-readable errors, local
storage/checkout/license behaviour, static route headers, and MIT packaging.

The command log is `/tmp/import-mapping-replay-claims.log` in this verifier
environment. No missing claim entry or failing claim test was found.

## Local build, tests, and CLI consumer

All passed:

```text
npm ci
npm test                         # 9 Rust tests; 78 Playwright tests
npm run typecheck
cargo fmt --all -- --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty      # package verification passed
npm run build                    # release binary and dist/site
```

`test-results/.last-run.json` reports `status: passed` with no failed tests.
There is no separate JavaScript lint script.

I installed the package into a fresh temporary consumer root and exercised
the installed `import-mapping-replay 0.1.0`: `--help` exposes `run` and
`demo`, and `demo --json` exited 0 with five rows, three validation errors, a
new temporary directory, and all four review files. The release binary also
independently produced these representative outcomes:

| Case | Result |
| --- | --- |
| Valid bundled CSV/mapping | exit 0; 3 rows, 0 errors, and all four review files |
| Deliberately invalid five-row sample | exit 2; 3 validation errors and all four review files |
| Missing source with `--json` | exit 1; parseable actionable error telling the user to check the path |

The generated valid `output.csv` contained the expected normalized email,
ISO date, and plan values. The rollback manifest warning explicitly says it
cannot undo customer-system records.

## Live deployment, privacy, accessibility, and performance

The live route documents match the new local `dist/site` byte-for-byte:

| Resource | SHA-256 |
| --- | --- |
| `/` | `6836339efb5dcc1fdcf1c0a0f42959175e8ef94407e6b4b81ca3a04165ded354` |
| `/demo` | `2ff7648a33b3388b7f5b4cbd9e233efaf47ff125cdf9fd767ab44e5e6254cf5f` |
| `/privacy` | `45bcec31ec32936ff4c487024ba34bcdba51dda2c976b26da3feb34f53f91910` |
| `/terms` | `6de1d40d45ce4b4263f412131f2b9c9f5f5a1602efcc243c64abea8045d32417` |
| `/404` | `84a6ab3663066985d1eadd55d216839422a234f4053042362506d97b973156c4` |
| `/assets/main-5iHnBnf9.js` | `bbac0937309ab76b96b74fece0e1142fa19545a6ed42f8b2515d3831ebed554d` |

Desktop `/` and 390 px `/demo` axe scans had zero violations, including zero
serious or critical findings. Both had `lang=en`, exactly one h1, and one main
landmark. Reduced-motion emulation loaded with no errors. The visible focused
skip link and designed red focus treatment were verified by keyboard.

Fresh landing and direct-demo Playwright request logs were entirely
same-origin. Demo reset made no cross-origin request and the claim suite also
verified that entering demo preserves seeded real-license storage and cancels
an in-flight verification. No analytics, third-party fonts, runtime AI calls,
or customer CSV network upload was observed.

Response headers on live routes include HSTS, `X-Content-Type-Options:
nosniff`, strict referrer policy, restrictive permissions policy, and a CSP
with response-header `frame-ancestors 'none'`. `/`, `/demo`, `/privacy`, and
`/terms` returned 200; `/404` and an arbitrary unknown route returned the
designed 404. HTML revalidates in 30 seconds; hashed JS/CSS are one-year
immutable; stable WebP assets use `max-age=0, must-revalidate`.

The initial JavaScript is 22,961 B raw and CSS is 13,124 B raw, within the
200 KB and 50 KB budgets. Hero WebP is 185,892 B. Lighthouse (mobile/default
run) scored Performance 99, Accessibility 100, Best Practices 100, SEO 100;
LCP was 1,801 ms, CLS 0, TBT 83 ms, and total transfer 199,138 B.

The paid checkout claim test passed from the clean demo entry point. A fresh
live request-allowance burst against the documented Sociobot verification
endpoint used an invalid token: requests 1–30 returned 200 and 31–35 returned
429. The first 429 included `Retry-After: 3` and `X-RateLimit-After: 3`.
Observed allowance: 30 immediate requests per client. This static site and
local CLI have no application backend, sign-in flow, service worker, or PWA,
so backend persistence/health, Entra, and service-worker update checks do not
apply.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
