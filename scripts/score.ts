import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, basename } from "path";
import yaml from "js-yaml";

// --- Types ---

interface CLIData {
  slug: string;
  name: string;
  command: string;
  vendor: string;
  description: string;
  repo: string;
  category: string;
  website: string;
  language: string;
  license: string;
  official: boolean;
  install: Record<string, string | null>;
  auth: {
    methods: string[];
    env_var?: string | null;
    config_path?: string | null;
    config_format?: string | null;
    headless: boolean;
    multi_profile: boolean;
  };
  json_output: {
    type: string;
    flag?: string | null;
    field_selection: boolean;
    jq_builtin: boolean;
  };
  non_interactive: {
    fully_headless: boolean;
    skip_prompts_flag?: string | null;
    env_var?: string | null;
    auto_detect_tty: boolean;
  };
  errors: {
    structured: boolean;
    format?: string | null;
    has_error_codes: boolean;
  };
  exit_codes: {
    documented: boolean;
    typed: boolean;
    codes?: Record<string, string>;
  };
  schema_discovery: {
    help_format: string;
    introspection_command?: string | null;
    field_docs: boolean;
    resource_listing?: string | null;
  };
  pagination: {
    supported: boolean;
    limit_flag?: string | null;
    cursor_flags?: string[] | null;
    auto_paginate?: string | null;
  };
  safety: {
    dry_run: boolean;
    confirm_skip?: string | null;
    idempotency: boolean;
  };
  quiet_mode?: {
    flag?: string | null;
    env_var?: string | null;
  };
  agent_ecosystem: {
    skill_md: boolean;
    skills_count?: number | null;
    skills_sh: boolean;
    mcp_server: string;
    agents_md: boolean;
    claude_md: boolean;
    agent_detection: boolean;
  };
  tags?: string[];
  notable_commands?: string[];
  notable_features?: string[];
  alternatives?: string[];
  related?: string[];
  first_release?: string | null;
  added_date: string;
  updated_date: string;
}

interface Scores {
  json_output: number;
  non_interactive: number;
  auth_automation: number;
  structured_errors: number;
  exit_codes: number;
  schema_discovery: number;
  pagination: number;
  field_selection: number;
  safety_rails: number;
  agent_ecosystem: number;
}

interface GeneratedCLI extends CLIData {
  scores: Scores;
  total: number;
  grade: string;
  grade_label: string;
  computed_at: string;
}

// --- Scoring Functions ---

function scoreJsonOutput(cli: CLIData): number {
  const typeScores: Record<string, number> = {
    default_json: 15,
    auto_pipe: 15,
    flag_json: 10,
    flag_format: 10,
    flag_output: 10,
    partial: 5,
    none: 0,
  };
  let score = typeScores[cli.json_output.type] ?? 0;
  if (cli.json_output.field_selection) score += 3;
  if (cli.json_output.jq_builtin) score += 2;
  return Math.min(score, 20);
}

function scoreNonInteractive(cli: CLIData): number {
  if (!cli.non_interactive.fully_headless) return 5;
  let score = 10;
  if (cli.non_interactive.skip_prompts_flag) score += 2;
  if (cli.non_interactive.env_var) score += 1;
  if (cli.non_interactive.auto_detect_tty) score += 2;
  return Math.min(score, 15);
}

function scoreAuth(cli: CLIData): number {
  let score = 0;
  const methods = cli.auth.methods;
  if (cli.auth.headless) score += 5;
  if (methods.includes("api_key_env")) score += 3;
  if (methods.includes("api_key_flag")) score += 2;
  if (methods.includes("config_file") || methods.includes("token_file"))
    score += 2;
  if (methods.includes("service_account")) score += 1;
  if (cli.auth.multi_profile) score += 2;
  return Math.min(score, 15);
}

function scoreErrors(cli: CLIData): number {
  if (!cli.errors.structured) return 0;
  let score = 5;
  if (cli.errors.format === "json") score += 2;
  if (cli.errors.has_error_codes) score += 3;
  return Math.min(score, 10);
}

function scoreExitCodes(cli: CLIData): number {
  if (!cli.exit_codes.documented) return 0;
  if (cli.exit_codes.typed) return 5;
  return 2;
}

function scoreSchemaDiscovery(cli: CLIData): number {
  const helpScores: Record<string, number> = {
    json: 4,
    rich: 3,
    structured: 2,
    standard: 1,
  };
  let score = helpScores[cli.schema_discovery.help_format] ?? 1;
  if (cli.schema_discovery.introspection_command) score += 4;
  if (cli.schema_discovery.field_docs) score += 2;
  if (cli.schema_discovery.resource_listing) score += 1;
  return Math.min(score, 10);
}

function scorePagination(cli: CLIData): number {
  if (!cli.pagination.supported) return 0;
  let score = 1;
  if (cli.pagination.limit_flag) score += 1;
  if (cli.pagination.cursor_flags && cli.pagination.cursor_flags.length > 0)
    score += 2;
  if (cli.pagination.auto_paginate) score += 1;
  return Math.min(score, 5);
}

function scoreFieldSelection(cli: CLIData): number {
  if (!cli.json_output.field_selection) return 0;
  let score = 3;
  if (cli.json_output.jq_builtin) score += 1;
  if (cli.schema_discovery.field_docs) score += 1;
  return Math.min(score, 5);
}

function scoreSafety(cli: CLIData): number {
  let score = 0;
  if (cli.safety.dry_run) score += 3;
  if (cli.safety.confirm_skip) score += 1;
  if (cli.safety.idempotency) score += 1;
  return Math.min(score, 5);
}

function scoreAgentEcosystem(cli: CLIData): number {
  let score = 0;
  const mcpScores: Record<string, number> = {
    built_in: 4,
    separate_repo: 2,
    community: 1,
    none: 0,
  };
  score += mcpScores[cli.agent_ecosystem.mcp_server] ?? 0;
  if (cli.agent_ecosystem.skill_md) score += 2;
  if (cli.agent_ecosystem.skills_sh) score += 1;
  if (
    cli.agent_ecosystem.skills_count &&
    cli.agent_ecosystem.skills_count >= 50
  )
    score += 1;
  if (cli.agent_ecosystem.agents_md) score += 1;
  if (cli.agent_ecosystem.claude_md) score += 1;
  if (cli.agent_ecosystem.agent_detection) score += 1;
  return Math.min(score, 10);
}

function computeGrade(total: number): { grade: string; label: string } {
  if (total >= 90) return { grade: "S", label: "Agent-Native" };
  if (total >= 75) return { grade: "A", label: "Agent-Ready" };
  if (total >= 60) return { grade: "B", label: "Agent-Compatible" };
  if (total >= 45) return { grade: "C", label: "Agent-Usable" };
  if (total >= 30) return { grade: "D", label: "Agent-Difficult" };
  return { grade: "F", label: "Not Agent-Friendly" };
}

function scoreCLI(cli: CLIData): GeneratedCLI {
  const scores: Scores = {
    json_output: scoreJsonOutput(cli),
    non_interactive: scoreNonInteractive(cli),
    auth_automation: scoreAuth(cli),
    structured_errors: scoreErrors(cli),
    exit_codes: scoreExitCodes(cli),
    schema_discovery: scoreSchemaDiscovery(cli),
    pagination: scorePagination(cli),
    field_selection: scoreFieldSelection(cli),
    safety_rails: scoreSafety(cli),
    agent_ecosystem: scoreAgentEcosystem(cli),
  };

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const { grade, label } = computeGrade(total);

  return {
    ...cli,
    scores,
    total,
    grade,
    grade_label: label,
    computed_at: new Date().toISOString(),
  };
}

// --- Main ---

const DATA_DIR = join(process.cwd(), "data");
const OUT_DIR = join(process.cwd(), ".generated");

mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(DATA_DIR).filter(
  (f) => f.endsWith(".yaml") && !f.startsWith("_")
);

const results: GeneratedCLI[] = [];
const rows: string[][] = [];

for (const file of files) {
  const raw = readFileSync(join(DATA_DIR, file), "utf8");
  const cli = yaml.load(raw) as CLIData;
  const slug = basename(file, ".yaml");

  if (cli.slug !== slug) {
    console.warn(`Warning: slug mismatch in ${file} (${cli.slug} vs ${slug})`);
  }

  const result = scoreCLI(cli);
  results.push(result);

  writeFileSync(join(OUT_DIR, `${slug}.json`), JSON.stringify(result, null, 2));

  rows.push([
    result.name.padEnd(25),
    String(result.scores.json_output).padStart(4),
    String(result.scores.non_interactive).padStart(4),
    String(result.scores.auth_automation).padStart(4),
    String(result.scores.structured_errors).padStart(4),
    String(result.scores.exit_codes).padStart(4),
    String(result.scores.schema_discovery).padStart(4),
    String(result.scores.pagination).padStart(4),
    String(result.scores.field_selection).padStart(4),
    String(result.scores.safety_rails).padStart(4),
    String(result.scores.agent_ecosystem).padStart(4),
    String(result.total).padStart(5),
    result.grade.padStart(2),
  ]);
}

// Sort by total descending
results.sort((a, b) => b.total - a.total);

// Write index
const index = results.map((r) => ({
  slug: r.slug,
  name: r.name,
  command: r.command,
  vendor: r.vendor,
  description: r.description,
  category: r.category,
  website: r.website,
  repo: r.repo,
  total: r.total,
  grade: r.grade,
  grade_label: r.grade_label,
  tags: r.tags || [],
  install: r.install,
}));

writeFileSync(join(OUT_DIR, "_index.json"), JSON.stringify(index, null, 2));

// Print summary table
const header = [
  "CLI".padEnd(25),
  "JSON",
  " NI ",
  "Auth",
  " Err",
  "Exit",
  "Disc",
  "Page",
  "Fld ",
  "Safe",
  "Eco ",
  "Total",
  "Gr",
].join(" | ");

console.log("\n" + header);
console.log("-".repeat(header.length));

// Sort rows by total descending
rows.sort((a, b) => Number(b[10]) - Number(a[10]));
for (const row of rows) {
  console.log(row.join(" | "));
}

console.log(`\nScored ${results.length} CLIs → .generated/`);
