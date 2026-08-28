# Import Mapping Replay

Replay customer CSV cleanup from one reviewed mapping file. The CLI writes the transformed CSV, field-level evidence, validation results, and the untouched source rows needed to reconstruct the run.

It is for implementation engineers who prepare repeatable template uploads. It does not connect to customer systems or undo records already imported elsewhere.

## Try the bundled sample

```sh
cargo run -- demo
```

The command copies a realistic customer CSV and mapping into a new temporary directory, runs the replay, and prints every output path. Nothing is uploaded or saved outside that directory.

## Install

Build the single binary with Rust 1.85 or newer:

```sh
cargo install --path .
import-mapping-replay --help
```

The package is ready for registry review with `cargo package`. The factory publishes releases.

## Use it

```sh
import-mapping-replay run \
  --source customers.csv \
  --mapping mapping.json \
  --out-dir replay-output
```

Add `--json` for machine-readable command output. A run writes:

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

Malformed CSV, missing columns, unknown mapping versions, invalid dates, and unwritable output paths return non-zero exit codes with a direct next step. Validation failures return exit code 2 after the review files are written.

## Develop and verify

```sh
cargo test
npm install
npm test
npm run build
```

`npm run build` compiles the release binary and the Vite site. Static deployment output lands in `dist/site`, with `index.html` at that root. The site demo is available at `/demo` or `/?demo=1` and uses only bundled sample data.

## Privacy and price

CSV processing runs in the local binary. The CLI has no telemetry and makes no network requests. The website stores only a pasted license and its last verification result in your browser. See the site’s `/privacy` and `/terms` pages.

The free CLI runs the complete replay on up to 250 source rows. A one-time £24 license removes that row limit and supports future version 1 updates. Accessibility, validation, evidence, and export are not separate paid features.

## License

MIT. See [LICENSE](LICENSE).
