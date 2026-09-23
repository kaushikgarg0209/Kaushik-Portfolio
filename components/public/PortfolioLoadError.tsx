import Link from "next/link";
import { RefreshCw } from "lucide-react";

interface PortfolioLoadErrorProps {
  failures?: string[];
}

export function PortfolioLoadError({ failures }: PortfolioLoadErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm text-cyan-400">$ portfolio.load()</p>
        <h1 className="mt-4 text-2xl font-bold text-white">
          Content couldn&apos;t load
        </h1>
        <p className="mt-3 text-slate-400">
          The portfolio is temporarily unavailable. Please refresh the page — your
          information is safe and should appear on retry.
        </p>
        {failures && failures.length > 0 && (
          <p className="mt-2 font-mono text-xs text-slate-500">
            Failed: {failures.join(", ")}
          </p>
        )}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/20 px-5 py-2.5 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/30"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh page
          </Link>
        </div>
      </div>
    </div>
  );
}
