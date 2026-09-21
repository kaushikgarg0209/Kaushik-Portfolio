"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Code2,
  ExternalLink,
  FolderGit2,
} from "lucide-react";

import { getMotionProps, useReducedMotion } from "@/hooks/useReducedMotion";
import type { Project } from "@/lib/db/schema";

type ProjectNav = Pick<Project, "slug" | "title" | "shortDescription" | "thumbnailUrl">;

const SITE_EASE = [0.22, 1, 0.36, 1] as const;

const statusStyles = {
  completed: {
    label: "Completed",
    className: "bg-green-500/15 text-green-400 border-green-500/30",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  archived: {
    label: "Archived",
    className: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  },
} as const;

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function ProjectNavCard({
  project,
  direction,
}: {
  project: ProjectNav;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group glass flex items-center gap-4 rounded-xl p-4 transition-colors hover:border-cyan-500/30"
    >
      {isPrev ? (
        <>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-colors group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500">Previous project</p>
            <p className="truncate font-medium text-white group-hover:text-cyan-400">
              {project.title}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="min-w-0 flex-1 text-right">
            <p className="text-xs text-slate-500">Next project</p>
            <p className="truncate font-medium text-white group-hover:text-cyan-400">
              {project.title}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-colors group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
            <ArrowRight className="h-5 w-5" />
          </div>
        </>
      )}
    </Link>
  );
}

export function ProjectDetailView({
  project,
  prev,
  next,
}: {
  project: Project;
  prev: ProjectNav | null;
  next: ProjectNav | null;
}) {
  const reducedMotion = useReducedMotion();
  const status = statusStyles[project.status];
  const start = formatDate(project.startDate);
  const end = formatDate(project.endDate);
  const timeline =
    start && end ? `${start} – ${end}` : start ? `Started ${start}` : end ? `Ended ${end}` : null;
  const images = (project.images as string[]) ?? [];
  const techStack = (project.techStack as string[]) ?? [];

  return (
    <article className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-64 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />

      {/* Hero */}
      <header className="relative pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            {...getMotionProps(reducedMotion)}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: SITE_EASE }}
          >
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to projects
            </Link>
          </motion.div>

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div
              {...getMotionProps(reducedMotion)}
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: SITE_EASE }}
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-0.5 font-mono text-xs ${status.className}`}
                >
                  {status.label}
                </span>
                {project.featured && (
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 font-mono text-xs text-cyan-400">
                    Featured
                  </span>
                )}
              </div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Project
              </p>
              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                {project.title}
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-slate-400">
                {project.shortDescription}
              </p>

              <div className="flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-medium text-slate-950 transition-colors hover:bg-cyan-400"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-cyan-500/40 hover:text-cyan-400"
                  >
                    <Code2 className="h-4 w-4" />
                    Source Code
                  </a>
                )}
              </div>
            </motion.div>

            <motion.div
              {...getMotionProps(reducedMotion)}
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: SITE_EASE }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-sm" />
              <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 glow-cyan">
                <div className="relative aspect-video bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                  {project.thumbnailUrl ? (
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-mono text-6xl text-cyan-400/20">
                      {"{ }"}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {techStack.length > 0 && (
              <div className="glass rounded-xl p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                  <FolderGit2 className="h-4 w-4 text-cyan-400" />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(timeline || project.liveUrl || project.githubUrl) && (
              <div className="glass rounded-xl p-6">
                <h3 className="mb-4 text-sm font-semibold text-white">Project Info</h3>
                <dl className="space-y-3 text-sm">
                  {timeline && (
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                      <div>
                        <dt className="text-slate-500">Timeline</dt>
                        <dd className="text-white">{timeline}</dd>
                      </div>
                    </div>
                  )}
                  {project.liveUrl && (
                    <div>
                      <dt className="text-slate-500">Live URL</dt>
                      <dd>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-cyan-400 hover:underline"
                        >
                          {project.liveUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </dd>
                    </div>
                  )}
                  {project.githubUrl && (
                    <div>
                      <dt className="text-slate-500">Repository</dt>
                      <dd>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-cyan-400 hover:underline"
                        >
                          {project.githubUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </aside>

          {/* Main content */}
          <div className="space-y-8 lg:col-span-2">
            {project.description && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6 md:p-8"
              >
                <h2 className="mb-6 text-xl font-semibold text-white">Overview</h2>
                <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white prose-a:text-cyan-400 prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-300 prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/40">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {project.description}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}

            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-4 text-xl font-semibold text-white">Screenshots</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/5"
                    >
                      <Image
                        src={img}
                        alt={`${project.title} screenshot ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Prev / Next navigation */}
        {(prev || next) && (
          <div className="mt-16 border-t border-white/10 pt-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              More Projects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {prev ? (
                <ProjectNavCard project={prev} direction="prev" />
              ) : (
                <div />
              )}
              {next ? (
                <ProjectNavCard project={next} direction="next" />
              ) : (
                <div />
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
