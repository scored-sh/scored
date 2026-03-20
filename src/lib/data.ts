import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

export interface CLIIndex {
  slug: string;
  name: string;
  command: string;
  vendor: string;
  description: string;
  category: string;
  website: string;
  repo: string;
  total: number;
  grade: string;
  grade_label: string;
  tags: string[];
  install: Record<string, string | null>;
}

export interface CLIDetail {
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
    headless: boolean;
    multi_profile: boolean;
  };
  json_output: { type: string; flag?: string | null; field_selection: boolean; jq_builtin: boolean };
  non_interactive: { fully_headless: boolean; skip_prompts_flag?: string | null; auto_detect_tty: boolean };
  errors: { structured: boolean; format?: string | null; has_error_codes: boolean };
  exit_codes: { documented: boolean; typed: boolean; codes?: Record<string, string> };
  schema_discovery: { help_format: string; introspection_command?: string | null; field_docs: boolean };
  pagination: { supported: boolean; limit_flag?: string | null; cursor_flags?: string[] | null; auto_paginate?: string | null };
  safety: { dry_run: boolean; confirm_skip?: string | null; idempotency: boolean };
  agent_ecosystem: { skill_md: boolean; skills_sh: boolean; mcp_server: string; agents_md: boolean; claude_md: boolean; agent_detection: boolean };
  tags?: string[];
  notable_commands?: string[];
  notable_features?: string[];
  alternatives?: string[];
  related?: string[];
  scores: {
    json_output: number;
    non_interactive: number;
    auth_automation: number;
    structured_errors: number;
    exit_codes: number;
    schema_discovery: number;
    pagination: number;
    safety_rails: number;
    agent_ecosystem: number;
  };
  total: number;
  grade: string;
  grade_label: string;
  computed_at: string;
}

const GENERATED_DIR = join(process.cwd(), ".generated");

export function getAllCLIs(): CLIIndex[] {
  const indexPath = join(GENERATED_DIR, "_index.json");
  if (!existsSync(indexPath)) return [];
  return JSON.parse(readFileSync(indexPath, "utf8"));
}

export function getCLI(slug: string): CLIDetail | null {
  const filePath = join(GENERATED_DIR, `${slug}.json`);
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function getAllSlugs(): string[] {
  if (!existsSync(GENERATED_DIR)) return [];
  return readdirSync(GENERATED_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .map((f) => f.replace(".json", ""));
}

export function getCategories(): { slug: string; name: string; count: number }[] {
  const clis = getAllCLIs();
  const catMap = new Map<string, number>();
  for (const cli of clis) {
    catMap.set(cli.category, (catMap.get(cli.category) || 0) + 1);
  }
  return Array.from(catMap.entries())
    .map(([slug, count]) => ({
      slug,
      name: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/* Grade styling — warm palette, not Tailwind defaults */
export const GRADE_STYLES: Record<string, {
  text: string;
  bg: string;
  border: string;
  glow: string;
}> = {
  S: { text: "text-[var(--color-grade-s)]", bg: "bg-[var(--color-grade-s)]", border: "border-[var(--color-grade-s)]", glow: "grade-glow-s" },
  A: { text: "text-[var(--color-grade-a)]", bg: "bg-[var(--color-grade-a)]", border: "border-[var(--color-grade-a)]", glow: "grade-glow-a" },
  B: { text: "text-[var(--color-grade-b)]", bg: "bg-[var(--color-grade-b)]", border: "border-[var(--color-grade-b)]", glow: "grade-glow-b" },
  C: { text: "text-[var(--color-grade-c)]", bg: "bg-[var(--color-grade-c)]", border: "border-[var(--color-grade-c)]", glow: "grade-glow-c" },
  D: { text: "text-[var(--color-grade-d)]", bg: "bg-[var(--color-grade-d)]", border: "border-[var(--color-grade-d)]", glow: "grade-glow-d" },
  F: { text: "text-[var(--color-grade-f)]", bg: "bg-[var(--color-grade-f)]", border: "border-[var(--color-grade-f)]", glow: "grade-glow-f" },
};

/* Backward compat exports */
export const GRADE_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(GRADE_STYLES).map(([k, v]) => [k, `${v.text} ${v.border}`])
);
export const GRADE_TEXT: Record<string, string> = Object.fromEntries(
  Object.entries(GRADE_STYLES).map(([k, v]) => [k, v.text])
);

/**
 * Primary install priority order.
 * The first non-null method in this list becomes the hero install command.
 * Priority: npm > homebrew > pip > cargo > curl > binary > apt > scoop > nix > docker > other
 */
const INSTALL_PRIORITY: string[] = [
  "npm", "homebrew", "pip", "cargo", "curl", "binary", "apt", "scoop", "nix", "docker", "other",
];

const INSTALL_PREFIX: Record<string, string> = {
  npm: "npm install -g",
  homebrew: "brew install",
  pip: "pip install",
  cargo: "cargo install",
  curl: "curl -fsSL",
  binary: "",
  apt: "apt install",
  scoop: "scoop install",
  nix: "nix profile install",
  docker: "docker pull",
  other: "",
};

export interface PrimaryInstall {
  method: string;
  command: string;
}

/**
 * Returns the primary install command for a CLI, computed from priority order.
 * The command is the full shell command (prefix + package name).
 */
export function getPrimaryInstall(install: Record<string, string | null>): PrimaryInstall | null {
  for (const method of INSTALL_PRIORITY) {
    const value = install[method];
    if (value != null) {
      const prefix = INSTALL_PREFIX[method] || "";
      const command = prefix ? `${prefix} ${value}` : value;
      return { method, command };
    }
  }
  return null;
}

/**
 * Returns secondary install methods (everything except the primary).
 */
export function getSecondaryInstalls(install: Record<string, string | null>): { method: string; command: string }[] {
  const primary = getPrimaryInstall(install);
  const results: { method: string; command: string }[] = [];
  for (const [method, value] of Object.entries(install)) {
    if (value == null) continue;
    if (primary && method === primary.method) continue;
    const prefix = INSTALL_PREFIX[method] || "";
    const command = prefix ? `${prefix} ${value}` : value;
    results.push({ method, command });
  }
  return results;
}

export async function fetchReadme(repo: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${repo}/HEAD/README.md`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.split("\n");
    return lines.slice(0, 500).join("\n");
  } catch {
    return null;
  }
}
