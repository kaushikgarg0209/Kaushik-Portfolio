"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Terminal, X } from "lucide-react";

import { PORTFOLIO_SECTIONS, isSectionVisible, type SectionVisibility } from "@/lib/sections";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#about", label: "About", section: null as string | null },
  ...PORTFOLIO_SECTIONS.map((s) => ({
    href: s.navHref,
    label: s.label.replace(" & Tech", "").replace(" Bar", ""),
    section: s.key,
  })),
];

interface NavbarProps {
  siteName: string;
  sectionVisibility?: SectionVisibility;
}

export function Navbar({ siteName, sectionVisibility }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleLinks = navLinks.filter((link) => {
    if (!link.section) return true;
    return isSectionVisible(sectionVisibility, link.section as keyof SectionVisibility);
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm text-white">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="max-w-[140px] truncate sm:max-w-none">{siteName}</span>
        </Link>

        <div className="hidden items-center gap-4 md:flex lg:gap-6">
          {visibleLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-cyan-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-b border-white/10 bg-[#0a0a0f]/95 px-4 py-4 md:hidden">
          {visibleLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-slate-400 hover:text-cyan-400"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
