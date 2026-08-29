# Demo sandbox

- Site entry: `https://import-mapping-replay.sociobot.in/demo` or `/?demo=1`.
- CLI entry: `import-mapping-replay demo` or `cargo run -- demo`.
- Sample: five fictional customer rows, four mapped target fields, and three deliberate validation errors.
- Result: a transformed CSV, field evidence, validation report, and source-row rollback manifest.
- Reset: use **Reset demo** on the site. Run the CLI command again for a new temporary directory.
- Storage: the site demo reads bundled markup and does not use browser storage. Each CLI demo atomically creates and writes only to its own system temporary directory printed in its output.
- Boundary: demo mode never reads a real CSV, mapping, or license.
