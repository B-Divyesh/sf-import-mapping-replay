# Polish round 2 — finding closure

Repair commit: `e0e472501435d329b314eec20c96d68c0ad808ff`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained saved scroll coordinates and h1 focus on History Back. | Playwright `navigation restores scroll on Back and terminal recording has a clear action`; live cold route check. |
| F-1-2 | Kept the known-route rewrites and designed 404 response override. | Playwright `all routes set specific metadata and unknown routes return HTTP 404`; live `/404` and unknown-route status check. |
| F-1-3 | Kept Privacy in the mobile header with a 44 px target. | Playwright `header keeps Privacy visible and usable`; 390 px cold route check. |
| F-1-4 | Kept per-route title, description, canonical, Open Graph, and Twitter metadata in static documents and client navigation. | Playwright `all routes set specific metadata and unknown routes return HTTP 404`; live route metadata check. |
| F-1-5 | Kept the literal h1 “Replay CSV imports before upload.” | First-screen route assertion; live home check. |
| F-1-6 | Kept “How the replay works” as the literal process heading. | `.factory/copy-audit.md`; live home check. |
| F-1-7 | Kept “What the CLI does not do” as the boundary heading. | `.factory/copy-audit.md`; live home check. |
| F-1-8 | Kept the literal “Page not found” 404 heading. | 404 route test and live status check. |
| F-1-9 | Kept the explicit terminal action label. | Playwright navigation/terminal test. |
| F-1-10 | Kept tested local-only, website-storage-only, and rollback-scope claims. | Individual claim commands from a clean clone. |
| F-1-11 | Kept the 24-hour license-cache claim and outcome test. | `npm test -- --grep @claim:license-cache-day` from a clean clone. |
| F-1-12 | Kept only the checkout behavior that is asserted against the hosted endpoint. | `@claim:paid-kit`; live checkout redirect check. |
| F-1-13 | Kept unproved license-scope language out of Terms. | `.factory/copy-audit.md`; legal-route check. |
| F-1-14 | Kept “customer system” as the single external-boundary term. | `.factory/copy-audit.md`; repository copy search. |
| F-2-1 | Put a mapped before/after email and a complete row-5 validation result in the demo hero; added an in-memory sample correction that Reset visibly restores. Demo never reads or writes browser storage. | Playwright `demo first view shows a mapped value and a complete validation row on mobile` and `direct demo query is isolated and exposes reset and exit controls`; screenshot `.factory/evidence/polish-2/local/demo-390.png`; live cold `/demo` check. |
| F-2-2 | Reduced desktop hero type and vertical spacing so all three facts finish inside 1440 × 900. | Playwright `desktop hero keeps all three product facts in the first viewport`; screenshot `.factory/evidence/polish-2/local/home-1440.png`; live 1440 × 900 check. |
| F-2-3 | Registered `demo-row-count` and proved five bundled source rows plus five output records. | `npm test -- --grep @claim:demo-row-count` from a clean clone. |
| F-2-4 | Expanded `paid-kit` to promise five named recipes and the structured checklist it actually downloads. | `npm test -- --grep @claim:paid-kit` asserts five non-empty named recipe records. |
| F-2-5 | Registered and proved the five-recipe quantity. | `@claim:paid-kit` download inspection from a clean clone. |
| F-2-6 | Added `upload owner` and `second-engineer approval` objects to the kit download and asserted both labels and values. | `@claim:paid-kit` download inspection from a clean clone. |
| F-2-7 | Registered `recorded-cli-sample`; the existing error and review-file claims now each execute `import-mapping-replay demo --json` and inspect its real files. The landing recording claim independently compares row/error/file outcomes with the CLI. | `npm test -- --grep @claim:demo-errors`, `@claim:review-files`, and `@claim:recorded-cli-sample` from a clean clone. |
| F-2-8 | Renamed the README section to “Run a CSV replay.” | README copy audit and source check. |

All claims in `.factory/claims.json` have one tagged observable test. The final clean-clone run executes every listed command independently; full browser, Rust, formatting, clippy, package, build, and live checks are recorded in the handoff.
