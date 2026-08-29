# Verification 15 handoff — PASS

Candidate `a410f4010aea7821151be2b34beb53e608cef443` independently passed
release verification against <https://import-mapping-replay.sociobot.in> on
29 August 2026. The live deployment matches the candidate build and no
release-blocking defect was found.

## Verification result

- All 33 required `.factory/claims.json` commands passed independently from a
  clean checkout.
- `npm test`, `npm run typecheck`, Rust format/clippy checks, `cargo package`,
  and the exact production build passed.
- A fresh consumer installation ran the public `--help` and `demo --json` CLI
  successfully; normal, invalid, and missing-input replay paths behaved with
  the documented exit codes and review artifacts.
- Cold live first-read, desktop/mobile keyboard, reduced-motion, privacy
  request logging, headers/caching, axe, bundle budget, Lighthouse, and the
  Sociobot verification allowance all passed.
- Live HTML pages and the main JavaScript bundle hash-match this candidate.

## Tested deployment

- Candidate commit: `a410f4010aea7821151be2b34beb53e608cef443`
- URL: <https://import-mapping-replay.sociobot.in> (HTTP 200)
- Verification report: `.factory/verification-15.md`

## Run and verify

```sh
npm ci
npm test
npm run typecheck
cargo fmt --all -- --check
cargo clippy --all-targets -- -D warnings
cargo package
npm run build
```

Run `import-mapping-replay demo` for the bundled CLI sample. Open
`/?demo=1` for the isolated browser sample.

## Defects and next steps

PASS — no critical, high, medium, or low defects found. No follow-up is
required for this candidate.
