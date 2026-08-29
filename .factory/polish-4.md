# Polish round 4 — cumulative finding closure

Product repair commit: `c43b67a4abdba18dc73f1e1f77802a597196938d`.
Deployment: `c3c4247f-21a0-499a-ba84-909537a2e216` at
<https://import-mapping-replay.sociobot.in>.

Evidence files are retained under `.factory/evidence/polish-4/`. The clean
clone used for the 28 independent claim commands was
`/tmp/import-mapping-replay-polish4-clean.NTBgZ6/repo`.

## Review 4 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Removed “The factory publishes releases.” The README now gives the only available path: install from this source checkout. | Source check on the pushed [README](https://raw.githubusercontent.com/B-Divyesh/sf-import-mapping-replay/c43b67a4abdba18dc73f1e1f77802a597196938d/README.md); no stale phrase remains. Full installed-crate consumer check passed. Screenshot: `.factory/evidence/polish-4/live/home-mobile-cold.png`. Live root returned 200. |
| F-4-2 | Replaced “ready for registry review” with the direct instruction “Run `cargo package` to check the release archive.” | Clean-clone `cargo package` passed and verified the crate. Source check on the pushed README passed. Screenshot: `.factory/evidence/polish-4/live/home-desktop-cold.png`. Live root returned 200. |
| F-4-3 | Registered `build-artifacts`. Its isolated test runs `npm run build`, executes the produced release binary, and inspects route documents plus hashed JS/CSS. | `npm test -- --grep @claim:build-artifacts` passed from the clean clone. Screenshot: `.factory/evidence/polish-4/live/home-desktop-cold.png`. Live `index.html` SHA-256 matched the tested build. |
| F-4-4 | Folded the concrete `dist/site` result into `build-artifacts` and the registered README sentence. | `@claim:build-artifacts` asserts default `dist/site/index.html` and an isolated complete site output. Screenshot: `.factory/evidence/polish-4/live/home-mobile-cold.png`. Live root returned 200 and byte-matched the local index. |
| F-4-5 | Registered `site-routing-headers` for known rewrites, the custom 404, CSP, `nosniff`, referrer policy, and permissions policy. | `npm test -- --grep @claim:site-routing-headers` passed from the clean clone. Screenshot: `.factory/evidence/polish-4/live/404-mobile-cold.png`. Live `/demo` returned 200; `/polish-4-not-found` returned the designed page with HTTP 404 and the named headers. |
| F-4-6 | Replaced the publication sentence with the non-sentence label “Production site:” and the URL. | Source check on the pushed README passed. Screenshot: `.factory/evidence/polish-4/live/home-mobile-cold.png`. <https://import-mapping-replay.sociobot.in> returned 200 and the correct canonical URL. |
| F-4-7 | Registered `mit-license`; the test checks Cargo’s license field and the MIT grant, inclusion condition, warranty disclaimer, and liability disclaimer. | `npm test -- --grep @claim:mit-license` passed from the clean clone. Screenshot: `.factory/evidence/polish-4/live/terms-mobile-cold.png`. Live `/terms` returned 200 and states the MIT license. |

## Earlier findings rechecked

| Finding | Current change/state | Evidence |
| --- | --- | --- |
| F-1-1 | History state retains scroll and restores h1 focus on Back. | Playwright `navigation restores scroll on Back and terminal recording has a clear action`; screenshot `.factory/evidence/polish-4/live/home-mobile-cold.png`; live cold audit restored `4480 → 4480` with `#page-title` focused. |
| F-1-2 | Known routes use real documents; unknown routes use the designed HTTP 404. | Playwright route test and `@claim:site-routing-headers`; screenshot `.factory/evidence/polish-4/live/404-mobile-cold.png`; live unknown path returned 404. |
| F-1-3 | Privacy remains visible in the 390 px header with a 44 px target. | Playwright `header keeps Privacy visible and usable`; screenshot `.factory/evidence/polish-4/live/home-mobile-cold.png`; live `/privacy` returned 200. |
| F-1-4 | Static documents and client routing retain route-specific title, description, canonical, OG, and Twitter fields. | Playwright `all routes set specific metadata...`; screenshot `.factory/evidence/polish-4/live/terms-mobile-cold.png`; live cold HTTP checks passed all five routes. |
| F-1-5 | The literal h1 remains “Replay CSV imports before upload.” | Copy audit; screenshot `.factory/evidence/polish-4/live/home-desktop-cold.png`; live root h1 check passed. |
| F-1-6 | The process label remains “How the replay works.” | Copy audit and full browser suite; screenshot `.factory/evidence/polish-4/live/screenshot-mobile.png`; live root copy check passed. |
| F-1-7 | The boundary heading remains “What the CLI does not do.” | Copy audit and full browser suite; screenshot `.factory/evidence/polish-4/live/screenshot-desktop.png`; live root copy check passed. |
| F-1-8 | The 404 h1 remains “Page not found.” | Route test; screenshot `.factory/evidence/polish-4/live/404-mobile-cold.png`; live `/404` returned 404. |
| F-1-9 | The terminal action remains “Show the sample replay again.” | Playwright navigation/recording test; screenshot `.factory/evidence/polish-4/live/screenshot-desktop.png`; live root action check passed. |
| F-1-10 | Local-only CLI replay, exact website storage, and rollback boundaries remain registered and proved. | Clean-clone `@claim:cli-local-only`, `@claim:website-license-storage-only`, and `@claim:rollback-local-scope`; screenshot `.factory/evidence/polish-4/live/privacy-mobile-cold.png`; live demo storage/request audit passed. |
| F-1-11 | License verification remains cached for 24 hours. | Clean-clone `@claim:license-cache-day`; screenshot `.factory/evidence/polish-4/live/privacy-mobile-cold.png`; live Privacy route returned 200. |
| F-1-12 | Unproved merchant, refund, payment-data, and automatic-revocation copy remains absent. | Playwright `purchase copy keeps only the checkout behavior covered by evidence`; screenshot `.factory/evidence/polish-4/live/terms-mobile-cold.png`; live checkout still returns 303 to Dodo Payments. |
| F-1-13 | Unproved buyer/team license scope remains absent. | Copy audit and purchase-copy test; screenshot `.factory/evidence/polish-4/live/terms-mobile-cold.png`; live Terms source check passed. |
| F-1-14 | “Customer system” remains the single external-system term. | Terminology table in `.factory/copy-audit.md`; screenshot `.factory/evidence/polish-4/live/screenshot-desktop.png`; live landing and pushed README checks passed. |
| F-2-1 | The first demo viewport contains a mapped email and full validation result; correction and Reset visibly change and restore state. | Playwright demo-first-view/correction/Reset tests; screenshot `.factory/evidence/polish-4/live/demo-mobile-cold.png`; live `/?demo=1` audit passed with correction focus and Reset focus. |
| F-2-2 | All three facts stay inside both 1440×900 and 390×844 first screens. | Playwright desktop hero test plus live viewport bounds; screenshot `.factory/evidence/polish-4/live/home-mobile-cold.png`; live cold audit recorded `[true,true,true]` at both sizes. |
| F-2-3 | The five-row outcome remains registered. | Clean-clone `@claim:demo-row-count`; screenshot `.factory/evidence/polish-4/live/demo-mobile-cold.png`; live demo shows five sample customers. |
| F-2-4 | The paid-kit claim still names recipes and the checklist. | Clean-clone `@claim:paid-kit`; screenshot `.factory/evidence/polish-4/live/screenshot-desktop.png`; live team-kit section returned with the registered copy. |
| F-2-5 | The paid-kit test still inspects exactly five named recipes. | Clean-clone `@claim:paid-kit`; screenshot `.factory/evidence/polish-4/live/screenshot-desktop.png`; live price section returned 200. |
| F-2-6 | The download retains structured upload-owner and second-engineer approval fields. | Clean-clone `@claim:paid-kit`; screenshot `.factory/evidence/polish-4/live/screenshot-desktop.png`; live licensed flow remains covered by recorded verification. |
| F-2-7 | Recording, error, and artifact claims still run the bundled CLI and compare real results. | Clean-clone `@claim:recorded-cli-sample`, `@claim:demo-errors`, and `@claim:review-files`; screenshot `.factory/evidence/polish-4/live/demo-desktop-cold.png`; live recording displays the matched five/three/four outcome. |
| F-2-8 | The README heading remains “Run a CSV replay.” | Pushed README source check; screenshot `.factory/evidence/polish-4/live/home-desktop-cold.png`; live install page content is reachable from Start for real. |
| F-3-1 / F-1-12 | The earlier billing-copy regression remains removed. | Purchase-copy browser test; screenshot `.factory/evidence/polish-4/live/terms-mobile-cold.png`; live landing, Privacy, and Terms contain only the observable checkout statement. |
| F-3-2 | CLI demos still use atomic unique directories with concurrency coverage. | Clean-clone `@claim:demo-temp` started 40 demos and produced 40 unique complete directories; screenshot `.factory/evidence/polish-4/live/demo-mobile-cold.png`; live web demo remains storage-isolated. |

## Acceptance evidence

- Every exact command in `.factory/claims.json` passed independently: 28/28.
- Clean-clone `npm test`: 7 Rust tests; 64 Playwright tests passed; 2
  intentional project skips.
- Clean-clone typecheck, rustfmt, Clippy with warnings denied, production
  build, and `cargo package` passed.
- A fresh consumer install from the packaged crate provided `--help`; its CLI
  demo produced five rows, three errors, one unique directory, and four
  non-empty artifacts.
- `/opt/fleet/lib/verify-url.sh` passed. The live cold audit ran Axe on five
  routes at two viewport sizes with zero serious/critical findings and zero
  application console errors.
- Live Lighthouse: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.910 s, CLS 0, TBT 65 ms, total transfer 198,865 bytes.

Every finding is closed. No severity is deferred.
