# Repair 4 handoff — PASS

## Status

Release blockers from independent verification commit
`cc0c9b7b4fd81bf83abf3fc56b98121f2cad6b29` are repaired. The product remains
a Rust CLI with a static Vite documentation and demo site.

- Repair commit: `c66884c` (`fix: publish replay artifacts safely`)
- Pushed branch: `origin/main`
- Deployment: Azure Static Web Apps production
- Deployment ID: `61d5f393-4556-4c86-b1b1-fbc452b31688`
- Live URL: <https://import-mapping-replay.sociobot.in>
- Verified: 29 August 2026 UTC

## What changed

### Input and output safety

- The CLI canonicalizes the source, mapping, and output directory before a
  replay.
- It rejects any output artifact that resolves to the source or mapping. The
  check also detects existing hard links through real file identity.
- All four artifacts are built in memory, written and synced in a hidden
  staging directory, then published with same-filesystem renames.
- Existing artifacts move to a temporary backup during publication. A publish
  failure restores the previous files.
- A fatal parse or serialization failure occurs before publication. It cannot
  create a plausible `output.csv`.
- Failed reruns preserve a previous complete four-file replay byte-for-byte.

### Checkout claims and purchase terms

- Added exact claims and tagged tests for the Sociobot-to-Dodo checkout
  redirect, returned-license storage, and license-token URL removal.
- The return-flow test opens
  `/?license=returned-secret&ref=checkout#team-kit`, checks the exact
  `localStorage` key and verification request, and confirms the visible URL is
  `/?ref=checkout#team-kit`.
- Landing, privacy, terms, and README copy now state that Dodo Payments is the
  merchant of record, handles refunds, and automatically revokes a refunded
  license.
- `.factory/claims.json`, `.factory/copy-audit.md`, README, and CHANGELOG are
  updated. There are 25 claims, and each claim tag occurs exactly once.

## Original failure and repaired result

The verifier's source-collision command was reproduced before editing:

- exit `0`;
- source SHA-256 changed from
  `1095cf51486f95d97eb60f335b4c12c653dc57c660a59cd4f2b2427c8b4c330b`
  to
  `5e93978ad9925953d46901af59e498256eccefb8d977b4a0b70ad3f4c1f2124b`.

The malformed-row reproduction exited `1` but left a 77-byte `output.csv`
containing the mapped header and first row.

The same cases against the installed repaired package now produce:

- collision: exit `1`, actionable `choose another --out-dir` error, source
  SHA-256 remains `1095cf…330b`, and no artifact is written;
- malformed later row: exit `1`, row 3 is identified, and the output directory
  contains no artifact;
- malformed rerun: all four prior complete artifacts remain byte-identical.

## Clean verification

The release matrix started with `cargo clean` and `npm ci`.

- `npm ci`: 23 packages installed; 0 vulnerabilities.
- `npm test`: 7 Rust tests passed; 57 Playwright tests passed across desktop
  Chromium and 390×844 mobile; 1 intended desktop-only test skipped on mobile.
- Every exact command in `.factory/claims.json`: 25 of 25 passed. Combined log:
  `/tmp/import-mapping-replay-repair-claims.log`.
- `npm run typecheck`: passed.
- `cargo fmt -- --check`: passed.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `npm run build`: passed and produced `dist/site` plus the release binary.
- `cargo package --allow-dirty`: passed; 52 files, 609.9 KiB unpacked and
  408.8 KiB compressed.

### Packaged consumer

The crate under `target/package/import-mapping-replay-0.1.0` was installed into
a fresh Cargo root.

- `--help` and `--version` worked; version was `0.1.0`.
- `demo --json` reported 5 rows, 3 validation errors, and all 4 artifacts.
- The exact source collision and malformed-later-row cases passed with the
  repaired behavior described above.

## Browser, accessibility, privacy, and offline checks

- Local `/opt/fleet/lib/verify-url.sh`: HTTP 200, title and `lang=en`, one
  `<h1>`, one `<main>`, no missing alt text, no unlabeled buttons, and no
  console errors.
- Automated desktop and 390×844 mobile tests cover `/`, `/demo`, `/privacy`,
  `/terms`, and the 404 route.
- Live desktop and mobile checks on all four public routes found zero console
  or page errors, zero horizontal overflow, and zero Axe serious or critical
  findings. Every visible mobile control was at least 44×44 CSS pixels.
- Keyboard tests verify skip-link focus and activation, route focus, demo
  controls, history restoration, and no traps.
- Reduced-motion, 200% text resizing, focus contrast, ordered headings, route
  titles, canonical metadata, and real 404 responses remain covered.
- Demo privacy tests confirm same-origin requests only and no demo storage.
  License tests confirm only the named license and verdict keys are stored.
- The CLI offline and network-guard claims pass. The site makes no offline/PWA
  claim and registers no service worker, so an update-flow check is not
  applicable.

## Performance and response policy

Live Lighthouse 12.8.2 mobile results:

- performance 100;
- accessibility 100;
- best practices 100;
- SEO 100;
- LCP 1.8 s, CLS 0, TBT 20 ms;
- total transfer 194 KiB.

Production assets remain within budget:

- JavaScript: 21,493 bytes raw / 6,890 bytes gzip;
- CSS: 12,910 bytes raw / 3,646 bytes gzip;
- hero WebP: 185,892 bytes.

Live responses return CSP, HSTS, `nosniff`, strict-origin referrer policy, and
the restrictive permissions policy. HTML revalidates after 30 seconds. The
hashed JS asset returns one-year immutable caching. `/demo`, `/privacy`, and
`/terms` return 200; an unknown route returns 404. Fresh GET and HEAD checkout
requests return 303 to `checkout.dodopayments.com`.

## Deployment identity

Local and live SHA-256 values match:

| File | SHA-256 |
| --- | --- |
| `index.html` | `113c292919d9f015689b2a8b9e9b0ea886e30cb45533263c4107c630d97b4a69` |
| `demo.html` | `0391a57f0361593092aaaddb3466bf6f82dbbe41fe573c97621e2e67fc9f520b` |
| `privacy.html` | `e17a596672ad30e71f0d94997eefc98ee57c60915bc0d6f3cfb8a2d23c01f757` |
| `terms.html` | `46cf4ebfe965a6f25dab8e784a175d9b44352b4ede6343fb92f4ee5624ec73a9` |
| `404.html` | `5cdf72fcb7d5b7746e8132f25468a6d38b3ad3ff1f8b5f4c99db4447fa41e894` |
| `assets/main-DflpbkrJ.js` | `1e57be58798019b36c52ef58399be06b127677c4ce60937c0c63e6896125e9c0` |
| `assets/main-l53q5lpH.css` | `81fe0b14e446ef50e4e764044f61cbf19c0f205534f758d209445ac1c9851bce` |
| `assets/replay-poster.webp` | `3e534cbab9801eccb9c342452c4cee7d25c48cc4ae64a0d9274e3b82e3307a95` |
| `assets/og-replay.webp` | `10e51eb88670f6d724309e703681f56c8a03c9c93e12a47e6b0e2e29e02a6189` |

## Known gaps and next steps

No release-blocking gap is known. Registry publishing remains factory-owned;
the worker did not publish the crate. A separate independent verification of
the repaired commit is the next release step.
