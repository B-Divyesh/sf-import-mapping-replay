# Verification 9 handoff — PASS

Independent QA completed on 29 August 2026 for work order
`import-mapping-replay-verify-9`.

- Candidate: `1ea1bc3a9606059927140582a12d9bd22387dcf5`
- Live URL: <https://import-mapping-replay.sociobot.in>
- Verdict: **PASS**
- Product code changed: no
- Full report: `.factory/verification-9.md`

## What was verified

- `.factory/claims.json` exists; all **28/28** exact claim commands pass.
- The cold first screen plainly states the job, audience, and first action.
- “Try it with sample data” opens the realistic isolated demo in one click.
- `npm ci`, all Rust/Playwright tests, TypeScript, Rust format/Clippy, and the
  exact production build pass.
- `cargo package` verifies; clean path and Git consumer installs work.
- Installed CLI normal, boundary, invalid-input, exit-code, deterministic,
  atomic, and recovery paths behave as documented.
- Production route documents and assets are byte-identical to the candidate.
- Live privacy request/storage promises, security headers, immutable asset
  caching, route status, checkout redirect, and license return behavior pass.
- The Sociobot verify endpoint allows 30 requests, then returns 429 with
  `Retry-After` (4 seconds observed).
- Desktop and 390 px mobile, keyboard-only flow, designed focus, 200% text,
  reduced motion, and live Axe pass. No serious/critical Axe findings.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.9 s, TBT 70 ms, CLS 0.

## Commands

```sh
npm ci
npm test
npm run typecheck
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package
```

Demo entry points:

```text
https://import-mapping-replay.sociobot.in/demo
https://import-mapping-replay.sociobot.in/?demo=1
cargo run -- demo
```

## Defects and next steps

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
- Known gaps: none within this work order.

Registry publication is a later factory release action; this source-installable
0.1.0 candidate does not claim that publication has happened.
