"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";

import { TiltCard } from "@/components/public/TiltCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Project } from "@/lib/db/schema";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { y: -4 }}
      className="group h-full"
    >
      <TiltCard className="glass flex h-full flex-col overflow-hidden rounded-xl transition-shadow hover:shadow-[0_0_30px_rgba(0,212,255,0.12)]">
        <Link href={`/projects/${project.slug}`} className="flex h-full flex-col">
          <div className="relative h-48 shrink-0 overflow-hidden bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
            {project.thumbnailUrl ? (
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl text-cyan-400/30">
                {"{ }"}
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
                View case study
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            {project.featured && (
              <span className="absolute left-3 top-3 rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-400">
                Featured
              </span>
            )}
          </div>

          <div className="flex min-h-[7.5rem] flex-1 flex-col p-6">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400">
                {project.title}
              </h3>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-600 transition-colors group-hover:text-cyan-400" />
            </div>
            <p className="mb-4 line-clamp-2 flex-1 text-sm text-slate-400">
              {project.shortDescription}
            </p>
            <div className="mb-4 flex min-h-[1.75rem] flex-wrap gap-2">
              {(project.techStack as string[]).slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400"
                >
                  {tech}
                </span>
              ))}
            </div>
            <span className="text-xs text-cyan-400/80 group-hover:text-cyan-400">
              Read full details →
            </span>
          </div>
        </Link>

        <div className="mt-auto flex min-h-[52px] gap-3 border-t border-white/5 px-6 py-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-cyan-400 hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              <Code2 className="h-3 w-3" /> Code
            </a>
          )}
        </div>
      </TiltCard>
    </motion.div>
  );
}
