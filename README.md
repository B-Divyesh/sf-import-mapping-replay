# Import Mapping Replay

Replay customer CSV imports from one reviewed mapping file. The CLI writes an output CSV, field evidence, validation results, and original source rows.

It is for implementation engineers who prepare repeatable template uploads. It does not connect to a customer system or undo records already imported elsewhere.

## Try the bundled sample

```sh
cargo run -- demo
```

The command copies a realistic customer CSV and mapping into a new temporary directory. It runs the replay and prints every output path.

## Install

This package declares Rust 1.85 as its minimum compiler:

```sh
cargo install --path .
import-mapping-replay --help
```

The package is ready for registry review with `cargo package`. The factory publishes releases.

## Run a CSV replay

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

Missing mapped columns return exit code 1 and say to check the CSV header or mapping. Validation failures return exit code 2 after writing review files.

## Develop and verify

```sh
cargo test
npm install
npm test
npm run build
```

`npm run build` compiles the release binary and the Vite site. Static deployment output lands in `dist/site`, with `index.html` at that root. The site demo is available at `/demo` or `/?demo=1` and uses only bundled sample data.

## Deploy

Deploy `dist/site` to Azure Static Web Apps. Its configuration rewrites known routes, returns the custom 404 for unknown URLs, and sets security headers. The factory publishes the site at <https://import-mapping-replay.sociobot.in>.

## Privacy and price

CSV processing runs in the local binary. The CLI makes no network requests while replaying a CSV. The website stores only a pasted license and its last verification result in your browser. See the site’s `/privacy` and `/terms` pages.

The core CLI needs no license. A one-time £24 license provides five named mapping recipes and a checklist with upload owner and second-engineer approval fields.

## License

MIT. See [LICENSE](LICENSE).
