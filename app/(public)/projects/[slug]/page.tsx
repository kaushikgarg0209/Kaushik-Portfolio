import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Code2, ExternalLink } from "lucide-react";

import { getProjectBySlug, getProjects } from "@/lib/db/queries";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const allProjects = await getProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const next =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <article className="min-h-screen pt-24">
      <div className="mx-auto max-w-4xl px-6 pb-24">
        <Link
          href="/#projects"
          className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-slate-400 hover:text-cyan-400"
        >
          <ArrowLeft className="h-4 w-4" />
          cd ../projects
        </Link>

        {project.thumbnailUrl && (
          <div className="relative mb-8 h-64 overflow-hidden rounded-xl md:h-80">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <h1 className="mb-4 text-4xl font-bold text-white">{project.title}</h1>
        <p className="mb-6 text-lg text-slate-400">{project.shortDescription}</p>

        <div className="mb-6 flex flex-wrap gap-2">
          {(project.techStack as string[]).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-400"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mb-8 flex gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
            >
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:border-cyan-500/40"
            >
              <Code2 className="h-4 w-4" /> Source Code
            </a>
          )}
        </div>

        <div className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-cyan-400 prose-code:text-cyan-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.description}
          </ReactMarkdown>
        </div>

        {(project.images as string[])?.length > 0 && (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {(project.images as string[]).map((img, i) => (
              <div key={i} className="relative h-48 overflow-hidden rounded-lg">
                <Image src={img} alt={`${project.title} screenshot ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-between border-t border-white/10 pt-8">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="font-mono text-sm text-slate-400 hover:text-cyan-400"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="font-mono text-sm text-slate-400 hover:text-cyan-400"
            >
              {next.title} →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
