"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Terminal, X } from "lucide-react";

import { useActiveSection } from "@/hooks/useActiveSection";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import {
  PORTFOLIO_SECTIONS,
  isSectionVisible,
  type SectionVisibility,
} from "@/lib/sections";
import { cn } from "@/lib/utils";

function sectionLabel(label: string) {
  return label.replace(" & Tech", "").replace(" Bar", "");
}

const navLinks = [
  { href: "#about", label: "About", sectionId: "about", section: null as string | null },
  ...PORTFOLIO_SECTIONS.map((s) => ({
    href: s.navHref,
    label: sectionLabel(s.label),
    sectionId: s.key,
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
  const scrollProgress = useScrollProgress();
  const reducedMotion = useReducedMotion();

  const visibleLinks = navLinks.filter((link) => {
    if (!link.section) return true;
    return isSectionVisible(sectionVisibility, link.section as keyof SectionVisibility);
  });

  const sectionIds = useMemo(() => visibleLinks.map((l) => l.sectionId), [visibleLinks]);
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div
        className="h-0.5 origin-left bg-gradient-to-r from-cyan-500 to-purple-500"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="max-w-[140px] truncate sm:max-w-none">{siteName}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex lg:gap-3">
          {visibleLinks.map((link) => {
            const isActive = activeSection === link.sectionId;
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 underline decoration-cyan-500/50 underline-offset-4"
                    : "text-slate-400 hover:text-cyan-400",
                )}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reducedMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden border-b border-white/10 bg-[#0a0a0f]/95 md:hidden"
          >
            <div className="px-4 py-4">
              {visibleLinks.map((link) => {
                const isActive = activeSection === link.sectionId;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block py-2 text-sm",
                      isActive ? "text-cyan-400" : "text-slate-400 hover:text-cyan-400",
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
