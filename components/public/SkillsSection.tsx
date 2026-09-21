"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { SectionHeader } from "@/components/public/SectionHeader";
import { SectionWrapper } from "@/components/public/SectionWrapper";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Skill } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = [...new Set(skills.map((s) => s.category))];
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const displayed = activeCategory
    ? skills.filter((s) => s.category === activeCategory)
    : skills;

  const grouped = activeCategory
    ? [{ category: activeCategory, items: displayed }]
    : categories.map((category) => ({
        category,
        items: skills.filter((s) => s.category === category),
      }));

  const filterKey = activeCategory ?? "all";

  return (
    <SectionWrapper id="skills" variant="skills">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          kicker="Skills"
          title="Skills & Technologies"
          subtitle="Tools and technologies I work with"
        />

        {categories.length > 1 && (
          <div className="mb-8">
            <p className="mb-3 text-sm text-slate-500">Filter by category</p>
            <div className="relative flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm transition-colors",
                  !activeCategory
                    ? "text-cyan-400"
                    : "bg-white/5 text-slate-400 hover:text-white",
                )}
              >
                {!activeCategory && (
                  <motion.span
                    layoutId="skill-tab"
                    className="absolute inset-0 rounded-full bg-cyan-500/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">All</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm transition-colors",
                    activeCategory === category
                      ? "text-cyan-400"
                      : "bg-white/5 text-slate-400 hover:text-white",
                  )}
                >
                  {activeCategory === category && (
                    <motion.span
                      layoutId="skill-tab"
                      className="absolute inset-0 rounded-full bg-cyan-500/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={filterKey}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-8"
          >
            {grouped.map(({ category, items }) => (
              <div key={category}>
                {!activeCategory && (
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-purple-400">
                    {category}
                  </h3>
                )}
                <div className="flex flex-wrap gap-3">
                  {items.map((skill) => (
                    <motion.span
                      key={skill.id}
                      whileHover={reducedMotion ? undefined : { scale: 1.05 }}
                      className="glass cursor-default rounded-full px-4 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
