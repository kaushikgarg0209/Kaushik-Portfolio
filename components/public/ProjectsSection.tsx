"use client";

import { useState } from "react";

import { ProjectCard } from "@/components/public/ProjectCard";
import { SectionHeader } from "@/components/public/SectionHeader";
import { SectionWrapper } from "@/components/public/SectionWrapper";
import type { Project } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const allTech = [...new Set(projects.flatMap((p) => (p.techStack as string[]) ?? []))];
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter
    ? projects.filter((p) => (p.techStack as string[])?.includes(filter))
    : projects;

  return (
    <SectionWrapper id="projects" variant="projects">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          kicker="Projects"
          title="Featured Projects"
          subtitle="Things I've built — click any project for the full case study"
        />

        {allTech.length > 0 && (
          <div className="mb-8">
            <p className="mb-3 text-sm text-slate-500">Filter by technology</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilter(null)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm transition-colors",
                  !filter
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-white/5 text-slate-400 hover:text-white",
                )}
              >
                All
              </button>
              {allTech.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setFilter(tech)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm transition-colors",
                    filter === tech
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-white/5 text-slate-400 hover:text-white",
                  )}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
