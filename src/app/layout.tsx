import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "scored.sh — SaaS CLIs scored for AI agents",
  description:
    "Discover SaaS product CLIs and see how agent-ready they are. Every CLI scored on JSON output, headless auth, structured errors, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <nav className="max-w-[1080px] mx-auto px-8 py-5 flex items-center justify-between">
          <a href="/" className="flex items-baseline gap-1 font-mono">
            <span className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
              scored
            </span>
            <span className="text-[var(--color-text-tertiary)] text-xs">.sh</span>
          </a>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/scored-sh/scored"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-coral)] transition-colors duration-150"
            >
              GitHub
            </a>
          </div>
        </nav>
        <main className="max-w-[1080px] mx-auto px-8 py-6">{children}</main>
      </body>
    </html>
  );
}
