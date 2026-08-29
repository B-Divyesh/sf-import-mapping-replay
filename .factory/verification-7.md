# Independent verification 7 — FAIL

Verified on 29 August 2026 against candidate commit
`1c574bbaf2e28ced920cc57ee05d5cda7a281259` and
<https://import-mapping-replay.sociobot.in>.

## Verdict: FAIL

The Rust CLI performs the researched job end to end, the live deployment
matches the candidate, the cold first-read gate passes, and all 25 registered
claims pass. The candidate is not releasable because the web demo's only
correction action produces contradictory validation state and breaks focus and
screen-reader feedback. This violates the non-negotiable demo, feedback,
keyboard, and screen-reader requirements.

Product code was not modified during this verification.

## Release-blocking defect

### High — correcting the sample leaves a stale error and loses accessible context

On the live `/demo` route at 390 x 844:

1. The initial result showed three errors and three validation rows.
2. Keyboard focus reached **Fix the sample email** after eight Tabs.
3. Pressing Enter changed the sample card to “Row 5 corrected” and the summary
   to “2 errors found.”
4. The validation table still contained all three rows, including row 5,
   `email`, `not-an-email`, and “Enter an email address.” It therefore told the
   user both that the email was corrected and that the same value still needed
   correction.
5. The focused button was replaced in the DOM. `document.activeElement` became
   `<body>`. Neither changing result was inside a live region; the two live
   regions contained only the unchanged demo banner and route title.

The same contradiction is visible on desktop and mobile. Source inspection
confirms `setDemoState` replaces only `.demo-snapshot` and the numeric count;
it does not update the validation table. Replacing the snapshot also removes
the focused control. The existing browser test asserts the changed card and
count but does not assert table consistency, post-action focus, or an
announcement.

Required repair: remove or mark the corrected validation row consistently,
make the remaining issue count and list agree, move focus to a meaningful
result or preserve it, announce the result through a live region, and add a
regression test for all four outcomes.

## Mandatory first-read and demo gate

PASS. A cold 1440 x 900 browser showed, before scrolling:

- what it does: “Replay CSV imports before upload”;
- who it serves: implementation engineers preparing customer uploads;
- what to click: “Try it with sample data”;
- what follows: “See a finished replay and three caught errors.”

The same content, the three privacy/offline/price facts, and the primary action
fit the first 390 x 844 viewport. One click opened `/demo` with a mapped value,
three complete validation rows, four review filenames, and the persistent
“Demo — sample data, nothing is saved” banner with Reset demo and Start for
real. `/?demo=1` also entered the isolated demo directly.

## Required claims — 25 of 25 pass

After `npm ci`, every exact command in `.factory/claims.json` was run
individually. Each passed in both Playwright projects, together with the seven
Rust tests invoked by each command.

`demo-errors`, `demo-row-count`, `recorded-cli-sample`, `review-files`,
`demo-private`, `cli-offline`, `cli-local-only`, `demo-temp`, `cli-replay`,
`mapping-v1`, `source-unchanged`, `atomic-artifacts`, `json-output`,
`actionable-errors`, `paid-kit`, `checkout-redirect`,
`license-return-storage`, `license-url-stripping`, `license-privacy`,
`website-license-storage-only`, `license-cache-day`, `core-no-license`,
`rust-msrv`, `revoked-license-lock`, and `rollback-local-scope` all passed.

Each claim ID occurs in exactly one test declaration. Cross-checking the live
copy, README, Privacy, Terms, and `.factory/copy-audit.md` found no separate
material claim without a corresponding registered test.

## Clean local gates and packaged consumer

The clean checkout was exactly the candidate commit. Installation added 23
locked packages with zero reported vulnerabilities.

```text
npm test                                  7 Rust passed; 57 Playwright passed; 1 intentional mobile skip
npm run typecheck                         passed
cargo fmt -- --check                      passed
cargo clippy --all-targets -- -D warnings passed
npm run build                             passed; release binary and dist/site produced
cargo package --allow-dirty               passed; package verification build passed
```

The packaged crate was installed into a fresh Cargo root. The installed
0.1.0 executable provided useful `--help` and passed these independent cases:

- bundled demo: five rows, three review errors, four non-empty artifacts;
- normal replay: three valid rows, unchanged source, and all four artifacts;
- boundaries: `--sample 0` produced zero evidence fields; a header-only CSV
  produced a valid zero-row output;
- recovery: a review-required run exited 2; a corrected rerun into the same
  directory replaced the artifacts and exited 0;
- invalid input: missing source, version 2 mapping, and a malformed later row
  exited 1 with actionable errors; the malformed first run published nothing;
- concurrency: 80 simultaneous installed demos produced 80 unique temporary
  directories and 320 non-empty review artifacts.

## Live deployment and routing

The live production files byte-match the local candidate build. Representative
SHA-256 values are:

| File | SHA-256 |
| --- | --- |
| `index.html` | `593ce0dad54561ebc39815fedfb9364b7a63d93478272e3cb202b8a263bb9416` |
| `demo.html` | `f6081d0749f8d6b5f65d05eae545b39bce3c94bca5f82bed8c7c9130b6828685` |
| `assets/main-DReExb4L.js` | `43316103e47f7ba284fec0adfbc62db0210acc41f6cf497a99df42a8994fcde9` |
| `assets/main-l53q5lpH.css` | `81fe0b14e446ef50e4e764044f61cbf19c0f205534f758d209445ac1c9851bce` |
| `assets/replay-poster.webp` | `3e534cbab9801eccb9c342452c4cee7d25c48cc4ae64a0d9274e3b82e3307a95` |

`/`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown route returned
the designed page with HTTP 404. All rendered links resolved as intended:
internal links and the factory link returned 200, while checkout returned its
documented 303. History navigation restored a 3,203 px scroll position and
focused the restored page heading.

Fresh checkout GET and HEAD requests both returned HTTP 303 to
`checkout.dodopayments.com`, so the previously reported deployment-only
checkout failure is not present.

## Accessibility and responsive QA

Live routes were checked at 1440 x 900 and 390 x 844.

- `/opt/fleet/lib/verify-url.sh` passed with title, `lang=en`, one `h1`, one
  main landmark, complete alt text, labeled controls, and no application
  console errors.
- Home, Demo, Privacy, Terms, and 404 each have one `h1`, one `main`, ordered
  headings, no horizontal overflow, and no missing image alternatives.
- Playwright Axe found zero serious or critical findings on all five routes at
  both sizes.
- Every visible mobile link, button, and input measured at least 44 x 44 CSS
  pixels.
- The first Tab reveals a 3 px designed focus ring on the skip link; Enter
  focuses main. A 30-step traversal found no keyboard trap.
- Keyboard Reset demo restores three errors and focuses the result heading.
- `prefers-reduced-motion: reduce` produced zero running animations and a
  maximum 0.01 ms transition.
- At 200% root text size, the 390 px page retained all content and controls
  without horizontal overflow.
- Product routes generated no console or page errors. The browser reports the
  expected failed-resource message for the top-level 404 response.

The manual focus and announcement failure described above is not detected by
automated Axe checks and remains release-blocking.

## Privacy, billing, rate limit, and response policy

A fresh live `/demo` load, correction, and reset requested only the document
and same-origin JavaScript/CSS. It left localStorage, sessionStorage, cookies,
IndexedDB, and Cache Storage empty.

A live invalid checkout return stored only
`sb_license:import-mapping-replay` and its verdict, removed the token while
preserving `?ref=checkout#team-kit`, and sent it only to the Sociobot verify
endpoint. Verification returned 200 with `Cache-Control: no-store`; no cookies
or other browser stores were created.

A single-client burst of 40 verification requests observed an allowance of 30:
requests 1–30 returned 200 and requests 31–40 returned 429. Every 429 included
`Retry-After: 2` or `3` and the body “Too Many Requests.”

Live HTML responses use 30-second must-revalidate caching. Hashed assets use
one-year immutable caching. Responses include a matching self-first CSP, HSTS,
`nosniff`, strict referrer policy, and a restrictive permissions policy. No
third-party fonts, scripts, analytics, telemetry, runtime AI, or CLI network
dependency was observed.

There is no product backend, sign-in, or service worker. Backend persistence
and health, Entra authority, and PWA update/offline checks are not applicable.

## Performance and bundle budgets

Live mobile Lighthouse 12.8.2 completed without a runtime error:

- performance 100;
- accessibility 100;
- best practices 100;
- SEO 100;
- LCP 1.808 s, CLS 0, TBT 29 ms;
- total transfer 198,383 bytes.

The production JavaScript is 21,098 bytes raw / 6,805 gzip, CSS is 12,910 /
3,640 gzip, the hero WebP is 185,892 bytes, and there are no font files. All
contract budgets pass.

## Defects by severity

- **High / release-blocking:** fixing the sample leaves a stale validation row,
  contradictory error totals, focus on `<body>`, and no result announcement.
- **Medium:** none.
- **Low:** none.
