"use client";

import { useState } from "react";

import { ProjectCard } from "@/components/public/ProjectCard";
import { SectionHeader } from "@/components/public/SectionHeader";
import { SectionWrapper } from "@/components/public/SectionWrapper";
import type { Project } from "@/lib/db/schema";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const allTech = [...new Set(projects.flatMap((p) => (p.techStack as string[]) ?? []))];
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter
    ? projects.filter((p) => (p.techStack as string[])?.includes(filter))
    : projects;

  return (
    <SectionWrapper id="projects">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          command="$ ls projects/"
          title="Featured Projects"
          subtitle="Things I've built"
        />

        {allTech.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`rounded-full px-3 py-1 font-mono text-xs transition-colors ${
                !filter
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              All
            </button>
            {allTech.map((tech) => (
              <button
                key={tech}
                onClick={() => setFilter(tech)}
                className={`rounded-full px-3 py-1 font-mono text-xs transition-colors ${
                  filter === tech
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
