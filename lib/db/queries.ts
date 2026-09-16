import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    if (!process.env.POSTGRES_URL) return fallback;
    return await fn();
  } catch (error) {
    console.error("Database query failed:", error);
    return fallback;
  }
}
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

export async function getSiteSettings() {
  return safeQuery(async () => {
    const [settings] = await db.select().from(siteSettings).limit(1);
    return settings ?? null;
  }, null);
}

export async function getProfile() {
  return safeQuery(async () => {
    const [data] = await db.select().from(profile).limit(1);
    return data ?? null;
  }, null);
}

export async function getSocialLinks() {
  return safeQuery(
    () => db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder)),
    [],
  );
}

export async function getSkills() {
  return safeQuery(
    () => db.select().from(skills).orderBy(asc(skills.sortOrder)),
    [],
  );
}

export async function getProjects() {
  return safeQuery(
    () => db.select().from(projects).orderBy(asc(projects.sortOrder)),
    [],
  );
}

export async function getFeaturedProjects() {
  return safeQuery(
    () =>
      db
        .select()
        .from(projects)
        .where(eq(projects.featured, true))
        .orderBy(asc(projects.sortOrder)),
    [],
  );
}

export async function getProjectBySlug(slug: string) {
  return safeQuery(async () => {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);
    return project ?? null;
  }, null);
}

export async function getExperience() {
  return safeQuery(
    () => db.select().from(experience).orderBy(desc(experience.startDate)),
    [],
  );
}

export async function getEducation() {
  return safeQuery(
    () => db.select().from(education).orderBy(desc(education.startDate)),
    [],
  );
}

export async function getCertifications() {
  return safeQuery(
    () =>
      db
        .select()
        .from(certifications)
        .orderBy(desc(certifications.issueDate)),
    [],
  );
}

export async function getTestimonials() {
  return safeQuery(
    () =>
      db.select().from(testimonials).orderBy(asc(testimonials.sortOrder)),
    [],
  );
}

export async function getStats() {
  return safeQuery(
    () => db.select().from(stats).orderBy(asc(stats.sortOrder)),
    [],
  );
}

export async function getContactMessages() {
  return safeQuery(
    () =>
      db
        .select()
        .from(contactMessages)
        .orderBy(desc(contactMessages.createdAt)),
    [],
  );
}

export async function getUnreadMessageCount() {
  return safeQuery(async () => {
    const messages = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.read, false));
    return messages.length;
  }, 0);
}

export async function getPortfolioData() {
  const [
    settings,
    profileData,
    socialLinksData,
    skillsData,
    projectsData,
    experienceData,
    educationData,
    certificationsData,
    testimonialsData,
    statsData,
  ] = await Promise.all([
    getSiteSettings(),
    getProfile(),
    getSocialLinks(),
    getSkills(),
    getProjects(),
    getExperience(),
    getEducation(),
    getCertifications(),
    getTestimonials(),
    getStats(),
  ]);

  return {
    settings,
    profile: profileData,
    socialLinks: socialLinksData,
    skills: skillsData,
    projects: projectsData,
    experience: experienceData,
    education: educationData,
    certifications: certificationsData,
    testimonials: testimonialsData,
    stats: statsData,
  };
}
