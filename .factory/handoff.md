# Handoff: adversarial first-read review 1

## Status: FAIL

No product code was modified. This review added `.factory/review-1.md` and
replaced this handoff with the review outcome.

## Verified

- Fresh live 390 px and desktop first-read, demo/reset/storage/request checks,
  routes, links, checkout, metadata, keyboard, and Back behaviour.
- Every `claims.json` command from a fresh clone after `npm ci`: all 15 passed.
- Local `npm test` and `npm run build`: passed; build created `dist/site`.
- Earlier verification/handoff history and all prior review/polish files (none
  existed).

## Remaining work

`.factory/review-1.md` records 14 findings. F-1-1 (Back loses scroll) and
F-1-2 (unknown URLs are HTTP 200) are blocking. Mobile Privacy navigation,
route metadata, copy, terminology, and unlisted-claim findings remain.

## Re-run

```sh
npm ci
npm test
npm run build
```

Live demo: `https://import-mapping-replay.sociobot.in/demo`.
