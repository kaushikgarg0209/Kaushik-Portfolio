"use client";

import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function TerminalWindow({ title, children, className }: TerminalWindowProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-white/10 bg-black/40", className)}>
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 truncate font-mono text-xs text-slate-500">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
