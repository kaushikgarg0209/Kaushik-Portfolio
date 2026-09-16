"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, ExternalLink } from "lucide-react";

import type { Project } from "@/lib/db/schema";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
      className="group glass overflow-hidden rounded-xl transition-shadow hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <Link href={`/projects/${project.slug}`}>
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-4xl text-cyan-400/30">
              {"{ }"}
            </div>
          )}
          {project.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-400">
              Featured
            </span>
          )}
        </div>
        <div className="p-6">
          <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-cyan-400">
            {project.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-slate-400">
            {project.shortDescription}
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {(project.techStack as string[]).slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-xs text-slate-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <div className="flex gap-3 px-6 pb-6">
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
    </motion.div>
  );
}
