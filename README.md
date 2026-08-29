# Import Mapping Replay

Replay customer CSV imports from one reviewed mapping file. The CLI writes an output CSV, field evidence, validation results, and original source rows.

It is for implementation engineers who prepare repeatable template uploads. It does not connect to a customer system or undo records already imported elsewhere.

## Try the bundled sample

```sh
cargo run -- demo
```

The command copies a realistic customer CSV and mapping into a new temporary directory. It runs the replay and prints every output path.

## Install

This package declares Rust 1.85 as its minimum compiler. Install from this source checkout:

```sh
cargo install --path .
import-mapping-replay --help
```

Run `cargo package` to check the release archive.

## Run a CSV replay

```sh
import-mapping-replay run \
  --source customers.csv \
  --mapping mapping.json \
  --out-dir replay-output
```

Add `--json` for machine-readable command output. Successful results include
status, row counts, and review-file paths. Failed commands print
`{"status":"error","error":"..."}` to standard output and still return a
nonzero exit code. A successful run writes:

- `output.csv`: rows in the mapping's declared column order.
- `evidence.json`: source and output hashes plus before/after samples.
- `validation.json`: every validation issue with its source row.
- `rollback-manifest.json`: the original source rows and source hash.

The rollback manifest reconstructs input to this local transformation. It cannot undo records already uploaded to another product.

### Mapping format

Mappings have a stable integer `version`. Version 1 maps named source columns to target columns in declaration order.

```json
{
  "version": 1,
  "fields": [
    {
      "target": "external_id",
      "source": "Customer ID",
      "transforms": [{ "op": "trim" }],
      "validate": [{ "rule": "required" }, { "rule": "unique" }]
    },
    {
      "target": "email",
      "source": "Email",
      "transforms": [{ "op": "trim" }, { "op": "lowercase" }],
      "validate": [{ "rule": "required" }, { "rule": "email" }]
    }
  ]
}
```

Version 1 transforms are `trim`, `lowercase`, `uppercase`, `replace`, and `date`. Validation rules are `required`, `email`, `one_of`, and `unique`. A field may use `default` when its source cell is empty.

Missing mapped columns return exit code 1 and say to check the CSV header or mapping. Duplicate CSV headers return exit code 1 before an output directory is created; rename the duplicate headers and run again. Validation failures return exit code 2 after writing review files.

The CLI rejects a source or mapping that resolves to an output artifact. It builds all four artifacts in a staging directory and publishes them only after the full replay succeeds. A malformed later row leaves no partial artifact. If a complete replay already exists, a failed rerun leaves all four prior files unchanged.

## Develop and verify

```sh
cargo test
npm install
npm test
npm run build
```

`npm run build` creates the release binary and the static site in `dist/site`. The site demo is available at `/?demo=1` or `/demo` and uses only bundled sample data.

## Deploy

Deploy `dist/site` to Azure Static Web Apps. Its configuration serves known routes, returns the custom 404 for unknown URLs, and sets security headers.

Production site: <https://import-mapping-replay.sociobot.in>

## Privacy and price

CSV processing runs in the local binary. The CLI makes no network requests while replaying a CSV. The website stores only a pasted license and its last verification result in your browser. See the site’s `/privacy` and `/terms` pages.

The core CLI needs no license. A one-time £24 license provides five named mapping recipes and a checklist with upload owner and second-engineer approval fields.

The buy link opens Dodo Payments checkout through Sociobot. After checkout, the site stores the returned license in `localStorage`, removes it from the address bar, and verifies it with Sociobot.

## License

MIT. See [LICENSE](LICENSE).
