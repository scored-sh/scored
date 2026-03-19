import {
  getCLI,
  getAllSlugs,
  GRADE_STYLES,
  fetchReadme,
  getPrimaryInstall,
  getSecondaryInstalls,
} from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { CopyBlock, CopyInline } from "@/components/copy-block";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cli = getCLI(slug);
  if (!cli) return {};
  return {
    title: `${cli.name} — Grade ${cli.grade} | scored.sh`,
    description: `${cli.description} Agent readiness: ${cli.total}/100 (${cli.grade}).`,
  };
}

const SCORE_LABELS: Record<string, string> = {
  json_output: "JSON Output",
  non_interactive: "Non-Interactive",
  auth_automation: "Auth Automation",
  structured_errors: "Structured Errors",
  exit_codes: "Exit Codes",
  schema_discovery: "Schema Discovery",
  pagination: "Pagination",
  field_selection: "Field Selection",
  safety_rails: "Safety Rails",
  agent_ecosystem: "Agent Ecosystem",
};

const SCORE_MAX: Record<string, number> = {
  json_output: 20,
  non_interactive: 15,
  auth_automation: 15,
  structured_errors: 10,
  exit_codes: 5,
  schema_discovery: 10,
  pagination: 5,
  field_selection: 5,
  safety_rails: 5,
  agent_ecosystem: 10,
};

const CATEGORY_LABELS: Record<string, string> = {
  "cloud-infrastructure": "Cloud & Infrastructure",
  "databases": "Databases",
  "payments-finance": "Payments & Finance",
  "blockchain-crypto": "Blockchain & Crypto",
  "data-web": "Data & Web",
  "communication-email": "Communication & Email",
  "developer-tools": "Developer Tools",
  "auth-identity": "Auth & Identity",
  "cms-content": "CMS & Content",
  "monitoring-observability": "Monitoring & Observability",
  "ai-ml": "AI & ML",
  "ci-cd": "CI/CD",
  "search": "Search",
  "infrastructure-as-code": "Infrastructure as Code",
  "productivity-workspace": "Productivity & Workspace",
  "other": "Other",
};

export default async function CLIPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cli = getCLI(slug);
  if (!cli) notFound();

  const readme = await fetchReadme(cli.repo);
  const style = GRADE_STYLES[cli.grade] || GRADE_STYLES.F;

  const primaryInstall = getPrimaryInstall(cli.install);
  const secondaryInstalls = getSecondaryInstalls(cli.install);

  const agentFeatures = [
    { label: "JSON output", active: cli.json_output.type !== "none" },
    { label: "Headless auth", active: cli.auth.headless },
    { label: "Non-interactive", active: cli.non_interactive.fully_headless },
    { label: "Structured errors", active: cli.errors.structured },
    { label: "Pagination", active: cli.pagination.supported },
    { label: "Dry run", active: cli.safety.dry_run },
    { label: "MCP server", active: cli.agent_ecosystem.mcp_server !== "none" },
    { label: "SKILL.md", active: cli.agent_ecosystem.skill_md },
    { label: "Field selection", active: cli.json_output.field_selection },
    { label: "Idempotent", active: cli.safety.idempotency },
  ];

  return (
    <div>
      {/* Breadcrumb — mono, matches terminal aesthetic */}
      <nav className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)] mb-8 font-mono">
        <Link href="/" className="hover:text-[var(--color-accent-coral)] transition-colors duration-200">
          scored
        </Link>
        <span className="text-[var(--color-text-faint)]">/</span>
        <span className="text-[var(--color-text-secondary)]">{cli.command}</span>
      </nav>

      {/* Title + description */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] leading-tight">
          {cli.name}
        </h1>
        <p className="mt-3 text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-[560px]">
          {cli.description}
        </p>
      </div>

      {/* Primary install — compact, whole block clickable to copy */}
      {primaryInstall && (
        <div className="mb-4">
          <CopyBlock text={primaryInstall.command} />
        </div>
      )}

      {/* Secondary install methods — each clickable to copy */}
      {secondaryInstalls.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-1.5">
          {secondaryInstalls.map(({ method, command }) => (
            <CopyInline key={method} text={command} label={method} />
          ))}
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
        {/* Left column: README + commands */}
        <div className="min-w-0">
          {readme ? (
            <section className="mb-16">
              <SectionLabel>Readme</SectionLabel>
              <div className="border border-[var(--color-border-default)] p-6 bg-[var(--color-surface-1)]">
                <article className="prose prose-invert prose-sm max-w-none prose-headings:font-bold prose-headings:text-[var(--color-text-primary)] prose-p:text-[var(--color-text-secondary)] prose-a:text-[var(--color-accent-coral)] prose-a:underline prose-a:underline-offset-2 prose-strong:text-[var(--color-text-primary)] prose-code:text-[var(--color-text-secondary)] prose-pre:bg-[var(--color-surface-2)] prose-li:text-[var(--color-text-secondary)] prose-hr:border-[var(--color-border-default)] prose-img:rounded prose-img:max-w-full">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {readme}
                  </ReactMarkdown>
                </article>
              </div>
            </section>
          ) : (
            <>
              {cli.notable_features && cli.notable_features.length > 0 && (
                <section className="mb-16">
                  <SectionLabel>Features</SectionLabel>
                  <ul className="space-y-2.5 text-sm text-[var(--color-text-secondary)]">
                    {cli.notable_features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-[var(--color-text-faint)] mt-0.5 shrink-0">&middot;</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}

          {/* Commands */}
          {cli.notable_commands && cli.notable_commands.length > 0 && (
            <section className="mb-16">
              <SectionLabel>Commands</SectionLabel>
              <div className="space-y-0 border-l border-[var(--color-border-default)] pl-4">
                {cli.notable_commands.map((cmd, i) => (
                  <div key={i} className="py-2 text-sm font-mono">
                    <code className="text-[var(--color-text-secondary)]">{cmd}</code>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right sidebar — stacked LABEL + VALUE blocks */}
        <aside className="space-y-6">
          {/* Agent Score — hero metric */}
          <SidebarBlock label="Agent Score">
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold leading-none ${style.text} ${style.glow}`}>
                {cli.grade}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold tabular-nums text-[var(--color-text-primary)] font-mono">
                  {cli.total}
                </span>
                <span className="text-xs text-[var(--color-text-faint)] font-mono">/ 100</span>
              </div>
            </div>
            <div className="mt-1 text-xs text-[var(--color-text-tertiary)] font-mono">
              {cli.grade_label}
            </div>
            <div className="mt-3 h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
              <div
                className={`h-full ${style.bg} score-bar-fill rounded-full`}
                style={{ width: `${cli.total}%` }}
              />
            </div>
          </SidebarBlock>

          {/* Repository */}
          <SidebarBlock label="Repository">
            <a
              href={`https://github.com/${cli.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--color-text-primary)] hover:text-[var(--color-accent-coral)] transition-colors duration-200 flex items-center gap-1.5 font-mono"
            >
              {cli.repo}
              <ExternalIcon />
            </a>
          </SidebarBlock>

          {/* Category */}
          <SidebarBlock label="Category">
            <span className="text-sm text-[var(--color-text-primary)] font-mono">
              {CATEGORY_LABELS[cli.category] || cli.category}
            </span>
          </SidebarBlock>

          {/* Language */}
          <SidebarBlock label="Language">
            <span className="text-sm text-[var(--color-text-primary)] capitalize font-mono">
              {cli.language}
            </span>
          </SidebarBlock>

          {/* License */}
          <SidebarBlock label="License">
            <span className="text-sm text-[var(--color-text-primary)] font-mono">
              {cli.license}
            </span>
          </SidebarBlock>

          {/* Status */}
          {cli.official && (
            <SidebarBlock label="Status">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-sage)]" />
                <span className="text-sm text-[var(--color-accent-sage)] font-mono">Official</span>
              </div>
            </SidebarBlock>
          )}

          {/* Website */}
          <SidebarBlock label="Website">
            <a
              href={cli.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--color-text-primary)] hover:text-[var(--color-accent-coral)] transition-colors duration-200 flex items-center gap-1.5 font-mono"
            >
              {new URL(cli.website).hostname}
              <ExternalIcon />
            </a>
          </SidebarBlock>

          {/* Score breakdown */}
          <div className="pt-6 border-t border-[var(--color-border-default)]">
            <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-4 font-mono">
              Score Breakdown
            </div>
            <div className="space-y-3">
              {Object.entries(SCORE_LABELS).map(([key, label], idx) => {
                const score = cli.scores[key as keyof typeof cli.scores];
                const max = SCORE_MAX[key];
                const pct = max > 0 ? (score / max) * 100 : 0;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs mb-1 font-mono">
                      <span className="text-[var(--color-text-secondary)]">{label}</span>
                      <span className={`tabular-nums font-bold ${score === max ? style.text : score > 0 ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-faint)]"}`}>
                        {score}/{max}
                      </span>
                    </div>
                    <div className="h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full breakdown-bar-fill ${score === max ? style.bg : score > 0 ? "bg-[var(--color-text-tertiary)]" : ""}`}
                        style={{ width: `${pct}%`, animationDelay: `${idx * 40}ms` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agent capabilities */}
          <div className="pt-6 border-t border-[var(--color-border-default)]">
            <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-4 font-mono">
              Agent Capabilities
            </div>
            <div className="space-y-2">
              {agentFeatures.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5 text-xs font-mono">
                  {f.active ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-sage)]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-surface-3)]" />
                  )}
                  <span className={f.active ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-faint)] line-through"}>
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* Sidebar block: LABEL on top (mono, micro), value below */
function SidebarBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-1.5 font-mono">
        {label}
      </div>
      {children}
    </div>
  );
}

/* Section label — consistent with all other labels on the site */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-4 font-mono">
      {children}
    </div>
  );
}

/* Reusable external link icon */
function ExternalIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-[var(--color-text-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
