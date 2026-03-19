"use client";

import { useState, useCallback } from "react";

export function CopyBlock({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`group flex items-center gap-3 w-auto cursor-pointer text-left bg-[var(--color-surface-1)] border border-[var(--color-border-default)] px-4 py-2.5 hover:border-[var(--color-text-faint)] transition-[border-color] duration-150 ${className || ""}`}
    >
      <span className="text-[var(--color-text-faint)] select-none font-mono text-sm">$</span>
      <code className="text-sm text-[var(--color-text-primary)] font-mono">{text}</code>
      <span className="ml-auto shrink-0 text-[var(--color-text-faint)] group-hover:text-[var(--color-text-tertiary)] transition-colors duration-150">
        {copied ? (
          <svg key="check" className="w-3.5 h-3.5 text-[var(--color-accent-sage)] copy-icon-enter" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg key="copy" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </span>
    </button>
  );
}

export function CopyInline({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-baseline gap-2 text-xs cursor-pointer hover:text-[var(--color-text-primary)] transition-colors duration-150 group"
    >
      {label && <span className="text-[var(--color-text-faint)]">{label}</span>}
      <code className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)] font-mono transition-colors duration-150">
        {text}
      </code>
      {copied && (
        <span className="text-[var(--color-accent-sage)] text-[10px] copy-icon-enter">
          copied
        </span>
      )}
    </button>
  );
}
