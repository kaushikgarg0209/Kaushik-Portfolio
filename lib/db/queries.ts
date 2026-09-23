import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { DbQueryError, queryWithRetry } from "@/lib/db/query-utils";
import {
  certifications,
  contactMessages,
  education,
  experience,
  profile,
  projects,
  siteSettings,
  skills,
  socialLinks,
  stats,
  testimonials,
} from "@/lib/db/schema";

async function runQuery<T>(label: string, fn: () => Promise<T>): Promise<T> {
  return queryWithRetry(fn, { label });
}

export async function getSiteSettings() {
  const [settings] = await runQuery("siteSettings", () =>
    db.select().from(siteSettings).limit(1),
  );
  return settings ?? null;
}

export async function getProfile() {
  const [data] = await runQuery("profile", () =>
    db.select().from(profile).limit(1),
  );
  return data ?? null;
}

export async function getSocialLinks() {
  return runQuery("socialLinks", () =>
    db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder)),
  );
}

export async function getSkills() {
  return runQuery("skills", () =>
    db.select().from(skills).orderBy(asc(skills.sortOrder)),
  );
}

export async function getProjects() {
  return runQuery("projects", () =>
    db.select().from(projects).orderBy(asc(projects.sortOrder)),
  );
}

export async function getFeaturedProjects() {
  return runQuery("featuredProjects", () =>
    db
      .select()
      .from(projects)
      .where(eq(projects.featured, true))
      .orderBy(asc(projects.sortOrder)),
  );
}

export async function getProjectBySlug(slug: string) {
  const [project] = await runQuery("projectBySlug", () =>
    db.select().from(projects).where(eq(projects.slug, slug)).limit(1),
  );
  return project ?? null;
}

export async function getExperience() {
  return runQuery("experience", () =>
    db.select().from(experience).orderBy(desc(experience.startDate)),
  );
}

export async function getEducation() {
  return runQuery("education", () =>
    db.select().from(education).orderBy(desc(education.startDate)),
  );
}

export async function getCertifications() {
  return runQuery("certifications", () =>
    db
      .select()
      .from(certifications)
      .orderBy(desc(certifications.issueDate)),
  );
}

export async function getTestimonials() {
  return runQuery("testimonials", () =>
    db.select().from(testimonials).orderBy(asc(testimonials.sortOrder)),
  );
}

export async function getStats() {
  return runQuery("stats", () =>
    db.select().from(stats).orderBy(asc(stats.sortOrder)),
  );
}

export async function getContactMessages() {
  return runQuery("contactMessages", () =>
    db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt)),
  );
}

export async function getUnreadMessageCount() {
  const messages = await runQuery("unreadMessages", () =>
    db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.read, false)),
  );
  return messages.length;
}

export class PortfolioDataLoadError extends Error {
  readonly failures: string[];

  constructor(failures: string[]) {
    super(`Portfolio data failed to load: ${failures.join(", ")}`);
    this.name = "PortfolioDataLoadError";
    this.failures = failures;
  }
}

export async function getPortfolioData() {
  const results = await Promise.allSettled([
    getSiteSettings().then((data) => ({ key: "settings", data })),
    getProfile().then((data) => ({ key: "profile", data })),
    getSocialLinks().then((data) => ({ key: "socialLinks", data })),
    getSkills().then((data) => ({ key: "skills", data })),
    getProjects().then((data) => ({ key: "projects", data })),
    getExperience().then((data) => ({ key: "experience", data })),
    getEducation().then((data) => ({ key: "education", data })),
    getCertifications().then((data) => ({ key: "certifications", data })),
    getTestimonials().then((data) => ({ key: "testimonials", data })),
    getStats().then((data) => ({ key: "stats", data })),
  ]);

  const failures: string[] = [];
  const data: Record<string, unknown> = {};

  for (const result of results) {
    if (result.status === "rejected") {
      const label =
        result.reason instanceof DbQueryError
          ? result.reason.label
          : "unknown";
      failures.push(label);
      continue;
    }
    data[result.value.key] = result.value.data;
  }

  if (failures.length > 0) {
    throw new PortfolioDataLoadError(failures);
  }

  return {
    settings: data.settings as Awaited<ReturnType<typeof getSiteSettings>>,
    profile: data.profile as Awaited<ReturnType<typeof getProfile>>,
    socialLinks: data.socialLinks as Awaited<ReturnType<typeof getSocialLinks>>,
    skills: data.skills as Awaited<ReturnType<typeof getSkills>>,
    projects: data.projects as Awaited<ReturnType<typeof getProjects>>,
    experience: data.experience as Awaited<ReturnType<typeof getExperience>>,
    education: data.education as Awaited<ReturnType<typeof getEducation>>,
    certifications: data.certifications as Awaited<
      ReturnType<typeof getCertifications>
    >,
    testimonials: data.testimonials as Awaited<
      ReturnType<typeof getTestimonials>
    >,
    stats: data.stats as Awaited<ReturnType<typeof getStats>>,
  };
}
