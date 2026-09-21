"use client";

import Link from "next/link";
import { ArrowUp, Download, Terminal } from "lucide-react";

interface FooterProps {
  siteName: string;
  resumeUrl?: string | null;
}

export function Footer({ siteName, resumeUrl }: FooterProps) {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span>{siteName}</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-400"
          >
            <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            Back to top
          </button>
          {resumeUrl && (
            <Link
              href={resumeUrl}
              target="_blank"
              className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-400"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </Link>
          )}
        </div>

        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} · Built with Next.js
        </p>
      </div>
    </footer>
  );
}
