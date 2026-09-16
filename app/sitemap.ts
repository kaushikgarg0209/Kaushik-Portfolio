import type { MetadataRoute } from "next";

import { getProjects, getSiteSettings } from "@/lib/db/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, projects] = await Promise.all([
    getSiteSettings(),
    getProjects(),
  ]);

  const baseUrl = settings?.siteUrl ?? "http://localhost:3000";

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectUrls,
  ];
}
