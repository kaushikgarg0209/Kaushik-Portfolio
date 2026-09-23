import { notFound } from "next/navigation";

import { ProjectDetailView } from "@/components/public/ProjectDetailView";
import { getProjectBySlug, getProjects } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

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

  return <ProjectDetailView project={project} prev={prev} next={next} />;
}
