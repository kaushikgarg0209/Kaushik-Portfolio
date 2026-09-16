"use client";

import { useState } from "react";

import { Sidebar } from "@/components/admin/Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex min-h-screen flex-col md:ml-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-[#0a0a0f]/95 px-4 backdrop-blur-xl md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white"
            aria-label="Open menu"
          >
            Menu
          </button>
          <span className="font-mono text-sm text-cyan-400">portfolio/admin</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu overlay"
        />
      )}
    </div>
  );
}
