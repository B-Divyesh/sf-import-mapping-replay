use anyhow::{bail, Context, Result};
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, HashMap, HashSet};
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process;
use std::sync::atomic::{AtomicU64, Ordering};

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Mapping {
    pub version: u32,
    pub fields: Vec<Field>,
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Field {
    pub target: String,
    pub source: String,
    #[serde(default)]
    pub default: Option<String>,
    #[serde(default)]
    pub transforms: Vec<Transform>,
    #[serde(default)]
    pub validate: Vec<Validation>,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "op", rename_all = "snake_case", deny_unknown_fields)]
pub enum Transform {
    Trim,
    Lowercase,
    Uppercase,
    Replace { from: String, to: String },
    Date { input: String, output: String },
}

#[derive(Debug, Deserialize)]
#[serde(tag = "rule", rename_all = "snake_case", deny_unknown_fields)]
pub enum Validation {
    Required,
    Email,
    OneOf { values: Vec<String> },
    Unique,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct ValidationIssue {
    pub source_row: usize,
    pub field: String,
    pub rule: String,
    pub value: String,
    pub message: String,
}

#[derive(Debug, Serialize)]
struct FieldEvidence {
    source_row: usize,
    source_field: String,
    target_field: String,
    before: String,
    after: String,
}

#[derive(Debug, Serialize)]
struct Evidence<'a> {
    schema: &'a str,
    mapping_version: u32,
    source_sha256: &'a str,
    mapping_sha256: &'a str,
    output_sha256: &'a str,
    source_rows: usize,
    output_rows: usize,
    sample_limit: usize,
    fields: Vec<FieldEvidence>,
}

#[derive(Debug, Serialize)]
struct ValidationFile<'a> {
    schema: &'a str,
    valid: bool,
    error_count: usize,
    issues: &'a [ValidationIssue],
}

#[derive(Debug, Serialize)]
struct RollbackManifest<'a> {
    schema: &'a str,
    purpose: &'a str,
    warning: &'a str,
    source_file: String,
    source_sha256: &'a str,
    mapping_sha256: &'a str,
    headers: &'a [String],
    rows: &'a [BTreeMap<String, String>],
}

#[derive(Debug, Serialize)]
pub struct RunReport {
    pub output_csv: PathBuf,
    pub evidence: PathBuf,
    pub validation: PathBuf,
    pub rollback_manifest: PathBuf,
    pub rows: usize,
    pub validation_errors: usize,
}

fn sha256(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}

fn transform_value(value: &str, transform: &Transform) -> Result<String> {
    Ok(match transform {
        Transform::Trim => value.trim().to_owned(),
        Transform::Lowercase => value.to_lowercase(),
        Transform::Uppercase => value.to_uppercase(),
        Transform::Replace { from, to } => value.replace(from, to),
        Transform::Date { input, output } => NaiveDate::parse_from_str(value, input)
            .with_context(|| format!("date {value:?} does not match {input:?}"))?
            .format(output)
            .to_string(),
    })
}

/// Accept the deliberately small, documented email form used by version 1 mappings.
/// It is ASCII-only: one non-empty local part and a dot-separated domain with
/// non-empty alphanumeric labels (hyphens may appear inside a label).
fn is_supported_email(value: &str) -> bool {
    let Some((local, domain)) = value.split_once('@') else {
        return false;
    };
    if local.is_empty() || domain.is_empty() || value.matches('@').count() != 1 {
        return false;
    }
    if local.starts_with('.') || local.ends_with('.') || local.contains("..") {
        return false;
    }
    if !local.bytes().all(|byte| {
        byte.is_ascii_alphanumeric()
            || matches!(
                byte,
                b'.' | b'!'
                    | b'#'
                    | b'$'
                    | b'%'
                    | b'&'
                    | b'\''
                    | b'*'
                    | b'+'
                    | b'-'
                    | b'/'
                    | b'='
                    | b'?'
                    | b'^'
                    | b'_'
                    | b'`'
                    | b'{'
                    | b'|'
                    | b'}'
                    | b'~'
            )
    }) {
        return false;
    }

    let labels = domain.split('.').collect::<Vec<_>>();
    if labels.len() < 2 {
        return false;
    }
    if !labels.iter().all(|label| {
        let bytes = label.as_bytes();
        !bytes.is_empty()
            && bytes.first().is_some_and(u8::is_ascii_alphanumeric)
            && bytes.last().is_some_and(u8::is_ascii_alphanumeric)
            && bytes
                .iter()
                .all(|byte| byte.is_ascii_alphanumeric() || *byte == b'-')
    }) {
        return false;
    }
    labels.last().is_some_and(|label| {
        label.len() >= 2 && label.bytes().all(|byte| byte.is_ascii_alphabetic())
    })
}

fn validate_mapping(mapping: &Mapping) -> Result<()> {
    if mapping.version != 1 {
        bail!(
            "mapping version {} is not supported; use version 1",
            mapping.version
        );
    }
    if mapping.fields.is_empty() {
        bail!("mapping has no fields; add at least one source-to-target field");
    }
    let mut targets = HashSet::new();
    for field in &mapping.fields {
        if field.source.trim().is_empty() || field.target.trim().is_empty() {
            bail!("mapping source and target names cannot be empty");
        }
        if !targets.insert(field.target.as_str()) {
            bail!("target field {:?} appears more than once", field.target);
        }
    }
    Ok(())
}

const ARTIFACT_NAMES: [&str; 4] = [
    "output.csv",
    "evidence.json",
    "validation.json",
    "rollback-manifest.json",
];

static WORKSPACE_SEQUENCE: AtomicU64 = AtomicU64::new(0);

struct Workspace {
    path: PathBuf,
}

impl Workspace {
    fn create(out_dir: &Path, purpose: &str) -> Result<Self> {
        for _ in 0..100 {
            let sequence = WORKSPACE_SEQUENCE.fetch_add(1, Ordering::Relaxed);
            let path = out_dir.join(format!(
                ".import-mapping-replay-{purpose}-{}-{sequence}",
                process::id()
            ));
            match fs::create_dir(&path) {
                Ok(()) => return Ok(Self { path }),
                Err(error) if error.kind() == std::io::ErrorKind::AlreadyExists => continue,
                Err(error) => {
                    return Err(error).with_context(|| {
                        format!(
                            "could not create staging directory in {}",
                            out_dir.display()
                        )
                    });
                }
            }
        }
        bail!(
            "could not create a unique staging directory in {}",
            out_dir.display()
        )
    }
}

impl Drop for Workspace {
    fn drop(&mut self) {
        let _ = fs::remove_dir_all(&self.path);
    }
}

fn validate_output_paths(source: &Path, mapping_path: &Path, out_dir: &Path) -> Result<()> {
    fs::create_dir_all(out_dir)
        .with_context(|| format!("could not create output directory {}", out_dir.display()))?;
    let canonical_source = fs::canonicalize(source)
        .with_context(|| format!("could not resolve source CSV {}", source.display()))?;
    let canonical_mapping = fs::canonicalize(mapping_path)
        .with_context(|| format!("could not resolve mapping {}", mapping_path.display()))?;
    let canonical_out_dir = fs::canonicalize(out_dir)
        .with_context(|| format!("could not resolve output directory {}", out_dir.display()))?;

    for name in ARTIFACT_NAMES {
        let output = canonical_out_dir.join(name);
        for (input_name, input) in [
            ("source CSV", canonical_source.as_path()),
            ("mapping", canonical_mapping.as_path()),
        ] {
            let collides = input == output
                || (output.exists()
                    && same_file::is_same_file(input, &output).with_context(|| {
                        format!(
                            "could not compare {input_name} {} with output artifact {}",
                            input.display(),
                            output.display()
                        )
                    })?);
            if collides {
                bail!(
                    "{input_name} {} resolves to output artifact {}; choose another --out-dir",
                    input.display(),
                    output.display()
                );
            }
        }
        if output
            .symlink_metadata()
            .is_ok_and(|metadata| metadata.file_type().is_dir())
        {
            bail!(
                "output artifact {} is a directory; move it or choose another --out-dir",
                output.display()
            );
        }
    }
    Ok(())
}

fn write_staged(path: &Path, bytes: &[u8]) -> Result<()> {
    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(path)
        .with_context(|| format!("could not stage {}", path.display()))?;
    file.write_all(bytes)
        .with_context(|| format!("could not stage {}", path.display()))?;
    file.sync_all()
        .with_context(|| format!("could not finish staging {}", path.display()))
}

fn restore_backups(out_dir: &Path, backup_dir: &Path, names: &[&str]) -> Result<()> {
    for name in names.iter().rev() {
        let target = out_dir.join(name);
        if target.exists() {
            fs::remove_file(&target)
                .with_context(|| format!("could not remove incomplete {}", target.display()))?;
        }
        fs::rename(backup_dir.join(name), &target)
            .with_context(|| format!("could not restore previous {}", target.display()))?;
    }
    Ok(())
}

fn publish_artifacts(out_dir: &Path, artifacts: &[(&str, Vec<u8>)]) -> Result<()> {
    let stage = Workspace::create(out_dir, "stage")?;
    for (name, bytes) in artifacts {
        write_staged(&stage.path.join(name), bytes)?;
    }

    let backup = Workspace::create(out_dir, "backup")?;
    let mut backed_up = Vec::new();
    for (name, _) in artifacts {
        let target = out_dir.join(name);
        if target.symlink_metadata().is_ok() {
            if let Err(error) = fs::rename(&target, backup.path.join(name)) {
                restore_backups(out_dir, &backup.path, &backed_up)?;
                return Err(error)
                    .with_context(|| format!("could not preserve previous {}", target.display()));
            }
            backed_up.push(*name);
        }
    }

    let mut published = Vec::new();
    for (name, _) in artifacts {
        let target = out_dir.join(name);
        if let Err(error) = fs::rename(stage.path.join(name), &target) {
            for published_name in published.iter().rev() {
                let _ = fs::remove_file(out_dir.join(published_name));
            }
            restore_backups(out_dir, &backup.path, &backed_up)?;
            return Err(error)
                .with_context(|| format!("could not publish staged {}", target.display()));
        }
        published.push(*name);
    }
    Ok(())
}

pub fn run_replay(
    source: &Path,
    mapping_path: &Path,
    out_dir: &Path,
    sample_limit: usize,
) -> Result<RunReport> {
    let source_bytes = fs::read(source).with_context(|| {
        format!(
            "could not read source CSV {}; check the path",
            source.display()
        )
    })?;
    let mapping_bytes = fs::read(mapping_path).with_context(|| {
        format!(
            "could not read mapping {}; check the path",
            mapping_path.display()
        )
    })?;
    let mapping: Mapping = serde_json::from_slice(&mapping_bytes).with_context(|| {
        format!(
            "mapping {} is not valid version 1 JSON",
            mapping_path.display()
        )
    })?;
    validate_mapping(&mapping)?;

    let mut reader = csv::ReaderBuilder::new()
        .flexible(false)
        .from_reader(source_bytes.as_slice());
    let headers = reader
        .headers()
        .context("source CSV has no readable header row")?
        .iter()
        .map(str::to_owned)
        .collect::<Vec<_>>();
    let mut header_index = HashMap::new();
    for (index, name) in headers.iter().enumerate() {
        if let Some(first_index) = header_index.insert(name.as_str(), index) {
            bail!(
                "source CSV header {name:?} appears more than once (columns {} and {}); rename duplicate headers and run again",
                first_index + 1,
                index + 1
            );
        }
    }
    for field in &mapping.fields {
        if !header_index.contains_key(field.source.as_str()) {
            bail!(
                "source column {:?} is missing; check the CSV header or mapping",
                field.source
            );
        }
    }
    validate_output_paths(source, mapping_path, out_dir)?;

    let mut writer = csv::WriterBuilder::new().from_writer(Vec::new());
    writer.write_record(mapping.fields.iter().map(|field| field.target.as_str()))?;

    let mut source_rows = Vec::new();
    let mut evidence = Vec::new();
    let mut issues = Vec::new();
    let mut output_values = Vec::<Vec<String>>::new();

    for (row_index, record) in reader.records().enumerate() {
        let source_row = row_index + 2;
        let record = record.with_context(|| format!("source CSV row {source_row} is malformed"))?;
        let original = headers
            .iter()
            .zip(record.iter())
            .map(|(key, value)| (key.clone(), value.to_owned()))
            .collect::<BTreeMap<_, _>>();
        source_rows.push(original);
        let mut out = Vec::with_capacity(mapping.fields.len());

        for field in &mapping.fields {
            let before = record
                .get(header_index[field.source.as_str()])
                .unwrap_or_default();
            let mut after = if before.is_empty() {
                field.default.clone().unwrap_or_default()
            } else {
                before.to_owned()
            };
            for transform in &field.transforms {
                match transform_value(&after, transform) {
                    Ok(value) => after = value,
                    Err(error) => {
                        issues.push(ValidationIssue {
                            source_row,
                            field: field.target.clone(),
                            rule: "transform".into(),
                            value: after.clone(),
                            message: format!("{error}; fix the source value or date format"),
                        });
                        break;
                    }
                }
            }
            for rule in &field.validate {
                let failed = match rule {
                    Validation::Required => after.trim().is_empty(),
                    Validation::Email => !after.is_empty() && !is_supported_email(&after),
                    Validation::OneOf { values } => !after.is_empty() && !values.contains(&after),
                    Validation::Unique => false,
                };
                if failed {
                    let (name, message) = match rule {
                        Validation::Required => {
                            ("required", "value is empty; add a value".to_owned())
                        }
                        Validation::Email => (
                            "email",
                            "value is not an email address; correct it".to_owned(),
                        ),
                        Validation::OneOf { values } => (
                            "one_of",
                            format!("value is not allowed; use one of {}", values.join(", ")),
                        ),
                        Validation::Unique => unreachable!(),
                    };
                    issues.push(ValidationIssue {
                        source_row,
                        field: field.target.clone(),
                        rule: name.into(),
                        value: after.clone(),
                        message,
                    });
                }
            }
            if row_index < sample_limit {
                evidence.push(FieldEvidence {
                    source_row,
                    source_field: field.source.clone(),
                    target_field: field.target.clone(),
                    before: before.to_owned(),
                    after: after.clone(),
                });
            }
            out.push(after);
        }
        writer.write_record(&out)?;
        output_values.push(out);
    }
    writer.flush()?;
    let output_bytes = writer
        .into_inner()
        .map_err(|error| error.into_error())
        .context("could not finish output CSV")?;

    for (field_index, field) in mapping.fields.iter().enumerate() {
        if field
            .validate
            .iter()
            .any(|rule| matches!(rule, Validation::Unique))
        {
            let mut first_seen = HashMap::<&str, usize>::new();
            for (row_index, row) in output_values.iter().enumerate() {
                let value = row[field_index].as_str();
                if value.is_empty() {
                    continue;
                }
                if let Some(first_row) = first_seen.insert(value, row_index + 2) {
                    issues.push(ValidationIssue {
                        source_row: row_index + 2,
                        field: field.target.clone(),
                        rule: "unique".into(),
                        value: value.to_owned(),
                        message: format!(
                            "value already appears on source row {first_row}; make it unique"
                        ),
                    });
                }
            }
        }
    }
    issues.sort_by_key(|issue| (issue.source_row, issue.field.clone(), issue.rule.clone()));

    let source_hash = sha256(&source_bytes);
    let mapping_hash = sha256(&mapping_bytes);
    let output_hash = sha256(&output_bytes);
    let evidence_bytes = serde_json::to_vec_pretty(&Evidence {
        schema: "import-mapping-replay/evidence/v1",
        mapping_version: mapping.version,
        source_sha256: &source_hash,
        mapping_sha256: &mapping_hash,
        output_sha256: &output_hash,
        source_rows: source_rows.len(),
        output_rows: output_values.len(),
        sample_limit,
        fields: evidence,
    })?;
    let validation_bytes = serde_json::to_vec_pretty(&ValidationFile {
        schema: "import-mapping-replay/validation/v1",
        valid: issues.is_empty(),
        error_count: issues.len(),
        issues: &issues,
    })?;
    let rollback_bytes = serde_json::to_vec_pretty(&RollbackManifest {
        schema: "import-mapping-replay/rollback/v1",
        purpose: "Reconstruct the source rows used by this local transformation.",
        warning: "This file cannot undo records already imported into another product.",
        source_file: source
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned(),
        source_sha256: &source_hash,
        mapping_sha256: &mapping_hash,
        headers: &headers,
        rows: &source_rows,
    })?;

    publish_artifacts(
        out_dir,
        &[
            (ARTIFACT_NAMES[0], output_bytes),
            (ARTIFACT_NAMES[1], evidence_bytes),
            (ARTIFACT_NAMES[2], validation_bytes),
            (ARTIFACT_NAMES[3], rollback_bytes),
        ],
    )?;

    Ok(RunReport {
        output_csv: out_dir.join(ARTIFACT_NAMES[0]),
        evidence: out_dir.join(ARTIFACT_NAMES[1]),
        validation: out_dir.join(ARTIFACT_NAMES[2]),
        rollback_manifest: out_dir.join(ARTIFACT_NAMES[3]),
        rows: source_rows.len(),
        validation_errors: issues.len(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    fn example(name: &str) -> PathBuf {
        Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("examples")
            .join(name)
    }

    #[test]
    fn documented_example_transforms_and_validates() {
        let dir = tempdir().unwrap();
        let report = run_replay(
            &example("customers.csv"),
            &example("mapping.json"),
            dir.path(),
            5,
        )
        .unwrap();
        let output = fs::read_to_string(report.output_csv).unwrap();
        assert!(output.contains("C-1042,maya.rivera@northstar.example,2025-04-18,growth"));
        assert_eq!(report.validation_errors, 3);
        let rollback = fs::read_to_string(report.rollback_manifest).unwrap();
        assert!(rollback.contains("MAYA.RIVERA@NORTHSTAR.EXAMPLE"));
        assert!(rollback.contains("cannot undo records"));
    }

    #[test]
    fn email_validation_rejects_malformed_domain_boundaries() {
        for address in ["a@.com", "a@example.", "a@b..com"] {
            assert!(
                !is_supported_email(address),
                "{address} must not pass email validation"
            );
        }
        for address in ["maya.rivera@northstar.example", "person+tag@sub.example.co"] {
            assert!(
                is_supported_email(address),
                "{address} should remain a supported address"
            );
        }
    }

    #[test]
    fn output_is_deterministic() {
        let one = tempdir().unwrap();
        let two = tempdir().unwrap();
        run_replay(
            &example("valid-customers.csv"),
            &example("mapping.json"),
            one.path(),
            3,
        )
        .unwrap();
        run_replay(
            &example("valid-customers.csv"),
            &example("mapping.json"),
            two.path(),
            3,
        )
        .unwrap();
        for file in [
            "output.csv",
            "evidence.json",
            "validation.json",
            "rollback-manifest.json",
        ] {
            assert_eq!(
                fs::read(one.path().join(file)).unwrap(),
                fs::read(two.path().join(file)).unwrap()
            );
        }
    }

    #[test]
    fn missing_column_has_next_step() {
        let dir = tempdir().unwrap();
        let source = dir.path().join("bad.csv");
        fs::write(&source, "Other\nvalue\n").unwrap();
        let error = run_replay(&source, &example("mapping.json"), dir.path(), 5)
            .unwrap_err()
            .to_string();
        assert!(error.contains("missing"));
        assert!(error.contains("check the CSV header or mapping"));
    }

    #[test]
    fn duplicate_headers_are_rejected_before_artifacts_are_published() {
        let dir = tempdir().unwrap();
        let source = dir.path().join("duplicate.csv");
        let mapping = dir.path().join("mapping.json");
        let output = dir.path().join("results");
        fs::write(&source, "A,A\nfirst,second\n").unwrap();
        fs::write(
            &mapping,
            r#"{"version":1,"fields":[{"target":"chosen","source":"A"}]}"#,
        )
        .unwrap();

        let error = run_replay(&source, &mapping, &output, 5)
            .unwrap_err()
            .to_string();

        assert!(error.contains("source CSV header \"A\" appears more than once"));
        assert!(error.contains("rename duplicate headers and run again"));
        assert!(!output.exists());
    }

    #[test]
    fn source_output_collision_is_rejected_without_changing_source() {
        let dir = tempdir().unwrap();
        let source = dir.path().join("output.csv");
        let mapping = dir.path().join("mapping.json");
        fs::copy(example("valid-customers.csv"), &source).unwrap();
        fs::copy(example("mapping.json"), &mapping).unwrap();
        let before = fs::read(&source).unwrap();

        let error = run_replay(&source, &mapping, dir.path(), 3)
            .unwrap_err()
            .to_string();

        assert!(error.contains("source CSV"));
        assert!(error.contains("resolves to output artifact"));
        assert!(error.contains("choose another --out-dir"));
        assert_eq!(fs::read(&source).unwrap(), before);
        assert!(!dir.path().join("evidence.json").exists());
        assert!(!dir.path().join("validation.json").exists());
        assert!(!dir.path().join("rollback-manifest.json").exists());
    }

    #[test]
    fn mapping_output_collision_is_rejected_without_changing_mapping() {
        let dir = tempdir().unwrap();
        let source = dir.path().join("source.csv");
        let mapping = dir.path().join("evidence.json");
        fs::copy(example("valid-customers.csv"), &source).unwrap();
        fs::copy(example("mapping.json"), &mapping).unwrap();
        let before = fs::read(&mapping).unwrap();

        let error = run_replay(&source, &mapping, dir.path(), 3)
            .unwrap_err()
            .to_string();

        assert!(error.contains("mapping"));
        assert!(error.contains("resolves to output artifact"));
        assert_eq!(fs::read(&mapping).unwrap(), before);
        assert!(!dir.path().join("output.csv").exists());
        assert!(!dir.path().join("validation.json").exists());
        assert!(!dir.path().join("rollback-manifest.json").exists());
    }

    #[test]
    fn malformed_later_row_publishes_no_artifacts() {
        let dir = tempdir().unwrap();
        let source = dir.path().join("source.csv");
        fs::write(
            &source,
            "Customer ID,Email,Start Date,Plan\nC-1001,good@example.com,04/18/2025,Starter\nC-1002,short@example.com\n",
        )
        .unwrap();
        let output = dir.path().join("results");

        let error = run_replay(&source, &example("mapping.json"), &output, 3)
            .unwrap_err()
            .to_string();

        assert!(error.contains("source CSV row 3 is malformed"));
        for name in ARTIFACT_NAMES {
            assert!(!output.join(name).exists(), "{name} must not be published");
        }
    }

    #[test]
    fn malformed_rerun_preserves_previous_complete_replay() {
        let dir = tempdir().unwrap();
        let output = dir.path().join("results");
        run_replay(
            &example("valid-customers.csv"),
            &example("mapping.json"),
            &output,
            3,
        )
        .unwrap();
        let before = ARTIFACT_NAMES.map(|name| (name, fs::read(output.join(name)).unwrap()));
        let malformed = dir.path().join("malformed.csv");
        fs::write(
            &malformed,
            "Customer ID,Email,Start Date,Plan\nC-1001,good@example.com,04/18/2025,Starter\nC-1002,short@example.com\n",
        )
        .unwrap();

        assert!(run_replay(&malformed, &example("mapping.json"), &output, 3).is_err());
        for (name, expected) in before {
            assert_eq!(fs::read(output.join(name)).unwrap(), expected);
        }
    }
}
