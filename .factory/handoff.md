# Verification handoff — PASS

Independent QA passed on 29 August 2026 for commit
`8b8119aa1258febcec46fc501f010714ceb41d9c` deployed at
<https://import-mapping-replay.sociobot.in>.

No product code was changed during verification. The complete evidence is in
`.factory/verification-8.md`.

## Verified

- All 25 exact claim commands in `.factory/claims.json` passed after `npm ci`.
- `npm test` (7 Rust and 60 Playwright checks), typecheck, formatting, clippy,
  production build, and `cargo package --allow-dirty` passed.
- A fresh consumer installation of the packed crate passed `--help`, demo,
  normal replay, header-only boundary, and missing-file recovery checks.
- The live site matches the candidate build byte-for-byte for HTML, JS, CSS,
  and poster art; routes, headers, caching, checkout, demo privacy, license
  verification privacy, and rate limiting were checked.
- Desktop and 390 px mobile keyboard, focus, reset/correction recovery,
  reduced-motion, no-overflow, console, and Axe checks passed. Live Lighthouse
  scored 98 performance / 100 accessibility / 100 best practices / 100 SEO.

## Run or verify

```sh
npm ci
npm test
npm run typecheck
npm run build
cargo package --allow-dirty
cargo run -- demo
```

For the browser demo, open `/demo` or `/?demo=1`. For the packaged CLI,
unpack `target/package/import-mapping-replay-0.1.0.crate` and install with
`cargo install --path <unpacked-directory>`.

## Known gaps / next steps

None. The candidate is ready for release.
