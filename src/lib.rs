use anyhow::{bail, Context, Result};
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, HashMap, HashSet};
use std::fs;
use std::path::{Path, PathBuf};

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

fn write_json(path: &Path, value: &impl Serialize) -> Result<()> {
    let bytes = serde_json::to_vec_pretty(value)?;
    fs::write(path, bytes).with_context(|| format!("could not write {}", path.display()))
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
    let header_index = headers
        .iter()
        .enumerate()
        .map(|(index, name)| (name.as_str(), index))
        .collect::<HashMap<_, _>>();
    for field in &mapping.fields {
        if !header_index.contains_key(field.source.as_str()) {
            bail!(
                "source column {:?} is missing; check the CSV header or mapping",
                field.source
            );
        }
    }

    fs::create_dir_all(out_dir)
        .with_context(|| format!("could not create output directory {}", out_dir.display()))?;
    let output_path = out_dir.join("output.csv");
    let evidence_path = out_dir.join("evidence.json");
    let validation_path = out_dir.join("validation.json");
    let rollback_path = out_dir.join("rollback-manifest.json");
    let mut writer = csv::WriterBuilder::new()
        .from_path(&output_path)
        .with_context(|| format!("could not write output CSV {}", output_path.display()))?;
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
                    Validation::Email => {
                        !after.is_empty()
                            && (after.matches('@').count() != 1
                                || after.starts_with('@')
                                || !after.split('@').nth(1).unwrap_or_default().contains('.'))
                    }
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
    let output_bytes = fs::read(&output_path)?;
    let output_hash = sha256(&output_bytes);
    write_json(
        &evidence_path,
        &Evidence {
            schema: "import-mapping-replay/evidence/v1",
            mapping_version: mapping.version,
            source_sha256: &source_hash,
            mapping_sha256: &mapping_hash,
            output_sha256: &output_hash,
            source_rows: source_rows.len(),
            output_rows: output_values.len(),
            sample_limit,
            fields: evidence,
        },
    )?;
    write_json(
        &validation_path,
        &ValidationFile {
            schema: "import-mapping-replay/validation/v1",
            valid: issues.is_empty(),
            error_count: issues.len(),
            issues: &issues,
        },
    )?;
    write_json(
        &rollback_path,
        &RollbackManifest {
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
        },
    )?;

    Ok(RunReport {
        output_csv: output_path,
        evidence: evidence_path,
        validation: validation_path,
        rollback_manifest: rollback_path,
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
}
