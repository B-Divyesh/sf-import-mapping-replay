# Adversarial review 8 handoff — FAIL

Reviewed commit `e31139f3acd2f7688c092cb4e8ce1dd504157f6d` and the matching live site on
29 August 2026. No product code was modified. The full report is
`.factory/review-8.md`.

## What was done

- Repeated cold 390 × 844 and 1440 × 900 first reads.
- Audited every landing and README sentence, heading, and control.
- Ran all 33 claim commands independently from a clean clone.
- Ran the CLI demo from a separate temporary directory and checked its inputs.
- Rechecked demo isolation, request logs, Reset, route metadata, GET/HEAD 404,
  history/focus, every rendered link, Axe, touch targets, console errors,
  responsive overflow, build output, and every finding from reviews 1–7.
- Ran the full clean suite, typecheck, production build, and
  `/opt/fleet/lib/verify-url.sh`.

## Verification result

- 33/33 claim commands passed.
- Full suite: 9 Rust tests and 76 Playwright tests passed; 2 intentional skips.
- Typecheck and production build passed; JavaScript is 22.93 kB raw / 7.33 kB
  gzip.
- Live Axe checks found zero violations; the live build byte-matches the clean
  build.

## Left to do

The review is FAIL with two copy findings:

1. F-8-1 / reopened F-1-14 is blocking: standardise **customer system** across
   landing, README, and Terms.
2. F-8-2 is minor: standardise the four outputs as **review files**, replacing
   “artifact(s)” and ambiguous “files” in the README safety paragraph.

After those copy and regression-test changes are deployed, rerun review 9 from
scratch. No functional, demo, claim, routing, accessibility, privacy, visual,
or missed-leverage defect was found in this round.
