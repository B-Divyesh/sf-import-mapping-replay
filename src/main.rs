use anyhow::{bail, Context, Result};
use clap::{error::ErrorKind, Parser, Subcommand};
use import_mapping_replay::{run_replay, RunReport};
use serde::Serialize;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::{self, ExitCode};
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

static DEMO_DIRECTORY_SEQUENCE: AtomicU64 = AtomicU64::new(0);

#[derive(Parser)]
#[command(name = "import-mapping-replay", version, about = "Replay CSV mappings with reviewable evidence", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Run a mapping against a local CSV file
    Run {
        /// Source CSV file
        #[arg(long)]
        source: PathBuf,
        /// Versioned JSON mapping file
        #[arg(long)]
        mapping: PathBuf,
        /// Directory for output and review files
        #[arg(long, default_value = "replay-output")]
        out_dir: PathBuf,
        /// Number of source rows included in field evidence
        #[arg(long, default_value_t = 5)]
        sample: usize,
        /// Print a machine-readable command result
        #[arg(long)]
        json: bool,
    },
    /// Run the bundled customer import in a new temporary directory
    Demo {
        /// Print a machine-readable command result
        #[arg(long)]
        json: bool,
    },
}

#[derive(Serialize)]
struct CommandResult<'a> {
    status: &'a str,
    rows: usize,
    validation_errors: usize,
    output_csv: String,
    evidence: String,
    validation: String,
    rollback_manifest: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    demo_directory: Option<String>,
}

#[derive(Serialize)]
struct CommandError {
    status: &'static str,
    error: String,
}

fn json_requested() -> bool {
    std::env::args_os()
        .skip(1)
        .any(|argument| argument.to_str() == Some("--json"))
}

fn display_json_error(error: impl std::fmt::Display) {
    let result = CommandError {
        status: "error",
        error: error.to_string(),
    };
    println!(
        "{}",
        serde_json::to_string(&result).expect("serializing the JSON error response cannot fail")
    );
}

fn display(report: &RunReport, json: bool, demo_directory: Option<&Path>) -> Result<()> {
    let result = CommandResult {
        status: if report.validation_errors == 0 {
            "valid"
        } else {
            "review_required"
        },
        rows: report.rows,
        validation_errors: report.validation_errors,
        output_csv: report.output_csv.display().to_string(),
        evidence: report.evidence.display().to_string(),
        validation: report.validation.display().to_string(),
        rollback_manifest: report.rollback_manifest.display().to_string(),
        demo_directory: demo_directory.map(|path| path.display().to_string()),
    };
    if json {
        println!("{}", serde_json::to_string_pretty(&result)?);
    } else {
        println!("Replay complete: {} source rows", result.rows);
        println!(
            "Validation: {} error(s) — {}",
            result.validation_errors, result.status
        );
        println!("Output CSV: {}", result.output_csv);
        println!("Evidence: {}", result.evidence);
        println!("Validation report: {}", result.validation);
        println!("Rollback manifest: {}", result.rollback_manifest);
        if let Some(path) = result.demo_directory {
            println!("Demo directory: {path}");
            println!("Demo data stays in this temporary directory.");
        }
    }
    Ok(())
}

/// Create a persistent, exclusive directory for one bundled demo run.
///
/// `create_dir` is atomic. The process id, nanosecond clock value, and local
/// sequence make a collision vanishingly unlikely; an existing directory is
/// still retried rather than shared. The directory intentionally persists so
/// users can inspect the four output files printed by `demo`.
fn create_demo_directory() -> Result<PathBuf> {
    let temporary_root = std::env::temp_dir();
    for _ in 0..128 {
        let timestamp = SystemTime::now().duration_since(UNIX_EPOCH)?.as_nanos();
        let sequence = DEMO_DIRECTORY_SEQUENCE.fetch_add(1, Ordering::Relaxed);
        let directory = temporary_root.join(format!(
            "import-mapping-replay-demo-{}-{timestamp}-{sequence}",
            process::id()
        ));
        match fs::create_dir(&directory) {
            Ok(()) => return Ok(directory),
            Err(error) if error.kind() == std::io::ErrorKind::AlreadyExists => continue,
            Err(error) => {
                return Err(error).with_context(|| {
                    format!("could not create demo directory {}", directory.display())
                });
            }
        }
    }
    bail!(
        "could not create a unique demo directory in {}",
        temporary_root.display()
    )
}

fn main() -> ExitCode {
    let json = json_requested();
    let cli = match Cli::try_parse() {
        Ok(cli) => cli,
        Err(error)
            if !json
                || matches!(
                    error.kind(),
                    ErrorKind::DisplayHelp | ErrorKind::DisplayVersion
                ) =>
        {
            error.exit()
        }
        Err(error) => {
            display_json_error(error);
            return ExitCode::from(2);
        }
    };
    match execute(cli) {
        Ok(code) => code,
        Err(error) => {
            if json {
                display_json_error(error);
            } else {
                eprintln!("Error: {error:#}");
            }
            ExitCode::from(1)
        }
    }
}

fn execute(cli: Cli) -> Result<ExitCode> {
    match cli.command {
        Command::Run {
            source,
            mapping,
            out_dir,
            sample,
            json,
        } => {
            let report = run_replay(&source, &mapping, &out_dir, sample)?;
            display(&report, json, None)?;
            Ok(if report.validation_errors == 0 {
                ExitCode::SUCCESS
            } else {
                ExitCode::from(2)
            })
        }
        Command::Demo { json } => {
            let root = create_demo_directory()?;
            let source = root.join("customers.csv");
            let mapping = root.join("mapping.json");
            fs::write(&source, include_bytes!("../examples/customers.csv"))?;
            fs::write(&mapping, include_bytes!("../examples/mapping.json"))?;
            let report = run_replay(&source, &mapping, &root.join("replay-output"), 5)?;
            display(&report, json, Some(&root))?;
            Ok(ExitCode::SUCCESS)
        }
    }
}
