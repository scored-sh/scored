import { getAllCLIs, getCategories, GRADE_STYLES } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

const SCORING_DIMENSIONS = [
  "JSON Output",
  "Non-Interactive",
  "Auth Automation",
  "Structured Errors",
  "Exit Codes",
  "Schema Discovery",
  "Pagination",
  "Field Selection",
  "Safety Rails",
  "Agent Ecosystem",
];

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = CATEGORY_LABELS[slug] || slug;
  return {
    title: `${label} CLIs — scored.sh`,
    description: `SaaS product CLIs in ${label}, scored for AI agent readiness.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allCLIs = getAllCLIs();
  const categories = getCategories();
  const clis = allCLIs.filter((cli) => cli.category === slug);
  const label = CATEGORY_LABELS[slug] || slug;

  if (clis.length === 0) notFound();

  return (
    <div>
      {/* ── Hero ── */}
      <header className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-4 mb-16">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="SCORED" className="w-full max-w-[480px] select-none" draggable={false} />
          <p className="mt-4 text-sm tracking-[0.2em] uppercase text-[var(--color-text-tertiary)] font-mono font-medium">
            SaaS CLIs scored for AI agents
          </p>
        </div>
        <div className="flex items-end">
          <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
            Every SaaS product CLI rated on 10 dimensions of agent readiness.
            One score. One grade.
          </p>
        </div>
      </header>

      {/* ── Submit + Scored On ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--color-text-tertiary)] mb-4 font-mono font-medium">
            Submit a CLI
          </p>
          <a
            href="https://github.com/scored-sh/scored/issues/new?template=submit-cli.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="bg-[var(--color-surface-1)] border border-[var(--color-border-default)] px-4 py-3 flex items-center gap-2.5 group hover:border-[var(--color-text-tertiary)] transition-colors duration-200 font-mono">
              <span className="text-[var(--color-text-faint)] text-sm">$</span>
              <span className="text-sm text-[var(--color-text-primary)]">
                Submit via GitHub
              </span>
              <span className="ml-2 text-[var(--color-text-faint)] text-xs group-hover:text-[var(--color-text-tertiary)] transition-colors duration-200">
                &rarr;
              </span>
            </div>
          </a>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--color-text-tertiary)] mb-4 font-mono font-medium">
            Scored on
          </p>
          <div className="flex flex-wrap gap-2">
            {SCORING_DIMENSIONS.map((dim) => (
              <span
                key={dim}
                className="text-[11px] text-[var(--color-text-tertiary)] border border-[var(--color-border-default)] px-2.5 py-1 font-mono"
              >
                {dim}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Leaderboard ── */}
      <section>
        <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--color-text-tertiary)] mb-6 font-mono font-medium">
          CLI Leaderboard
        </p>

        {/* Category tabs */}
        <div className="flex gap-4 mb-4 font-mono text-sm overflow-x-auto scrollbar-none">
          <Link
            href="/"
            className="pb-1 border-b-2 transition-colors duration-200 border-transparent text-[var(--color-text-faint)] hover:text-[var(--color-text-primary)] whitespace-nowrap shrink-0"
          >
            All ({allCLIs.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`pb-1 border-b-2 transition-colors duration-200 whitespace-nowrap shrink-0 ${
                cat.slug === slug
                  ? "border-[var(--color-text-primary)] text-[var(--color-text-primary)]"
                  : "border-transparent text-[var(--color-text-faint)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {cat.name} ({cat.count})
            </Link>
          ))}
        </div>

        {/* Table header */}
        <div className="hidden lg:grid grid-cols-16 gap-4 border-b border-[var(--color-border-default)] py-3 text-sm font-medium uppercase text-[var(--color-text-faint)] font-mono">
          <div className="col-span-1">#</div>
          <div className="col-span-13">CLI</div>
          <div className="col-span-2 text-right">Grade</div>
        </div>

        {/* Rows */}
        <div>
          {clis.map((cli, i) => {
            const style = GRADE_STYLES[cli.grade] || GRADE_STYLES.F;
            return (
              <Link
                key={cli.slug}
                href={`/cli/${cli.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] lg:grid-cols-16 items-start lg:items-center gap-3 lg:gap-4 py-3 hover:bg-[var(--color-surface-1)]/30 border-b border-[var(--color-border-subtle)] transition-colors duration-200"
              >
                <div className="lg:col-span-1 text-left">
                  <span className="text-sm lg:text-base text-[var(--color-text-faint)] font-mono">{i + 1}</span>
                </div>
                <div className="lg:col-span-13 min-w-0 flex flex-col lg:flex-row lg:items-baseline lg:gap-2">
                  <h3 className="font-semibold text-[var(--color-text-primary)] truncate whitespace-nowrap group-hover:text-[var(--color-accent-coral)] transition-colors duration-200">
                    {cli.name}
                  </h3>
                  <p className="text-xs lg:text-sm text-[var(--color-text-faint)] font-mono mt-0.5 lg:mt-0 truncate">
                    {cli.vendor}
                  </p>
                </div>
                <div className="lg:col-span-2 text-right">
                  <span className={`font-mono text-sm font-bold ${style.text}`}>
                    {cli.grade}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between mt-16 mb-4 text-xs text-[var(--color-text-faint)] font-mono">
        <span>{clis.length} CLIs in {label}</span>
        <a
          href="https://github.com/scored-sh/scored"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-text-faint)] hover:text-[var(--color-text-tertiary)] transition-colors duration-200"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
