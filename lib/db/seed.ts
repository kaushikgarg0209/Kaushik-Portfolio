import { config } from "dotenv";
import { hash } from "bcryptjs";
import { sql } from "drizzle-orm";

config({ path: ".env.local" });
config({ path: ".env" });

import { db } from "@/lib/db";
import {
  adminUsers,
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

const forceReseed = process.argv.includes("--force");

async function clearDatabase() {
  await db.execute(sql`
    TRUNCATE TABLE
      contact_messages,
      admin_users,
      social_links,
      skills,
      projects,
      experience,
      education,
      certifications,
      testimonials,
      stats,
      profile,
      site_settings
    RESTART IDENTITY CASCADE
  `);
}

async function seed() {
  if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
    throw new Error("POSTGRES_URL (or DATABASE_URL) is required to run seed");
  }

  const [existingAdmin] = await db.select().from(adminUsers).limit(1);

  if (existingAdmin && !forceReseed) {
    console.log("Database already seeded — skipping.");
    console.log("To wipe and re-seed: npm run db:seed:force");
    return;
  }

  if (forceReseed) {
    console.log("Force re-seed: clearing existing data...");
    await clearDatabase();
  }

  console.log("Seeding database...");

  await db.insert(siteSettings).values({
    siteName: "Kaushik Portfolio",
    siteUrl: process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000",
    metaTitle: "Kaushik | Full-Stack Developer",
    metaDescription:
      "Professional portfolio showcasing projects, experience, and skills in modern web development.",
    terminalBootEnabled: true,
    maintenanceMode: false,
    sectionVisibility: {
      stats: true,
      skills: true,
      experience: true,
      projects: true,
      education: true,
      certifications: true,
      testimonials: true,
      contact: true,
    },
  });

  await db.insert(profile).values({
    fullName: "Kaushik",
    preferredName: "Kaushik",
    title: "Full-Stack Developer",
    tagline: "I build scalable, performant web applications",
    bio: "I'm a passionate full-stack developer with expertise in modern web technologies. I love turning complex problems into elegant, user-friendly solutions.\n\nWith experience across the entire development stack, I focus on writing clean, maintainable code and delivering products that make a real impact.",
    bioShort:
      "Full-stack developer specializing in React, Next.js, and cloud-native applications.",
    email: "hello@example.com",
    location: "India",
    availabilityStatus: "open_to_work",
    availabilityMessage: "Open to full-time and freelance opportunities",
    typedRoles: ["Full-Stack Developer", "Problem Solver", "Tech Enthusiast"],
    yearsOfExperience: 3,
  });

  await db.insert(socialLinks).values([
    {
      platform: "github",
      label: "GitHub",
      url: "https://github.com",
      sortOrder: 0,
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com",
      sortOrder: 1,
    },
  ]);

  await db.insert(skills).values([
    { name: "TypeScript", category: "Languages", sortOrder: 0 },
    { name: "React", category: "Frontend", sortOrder: 1 },
    { name: "Next.js", category: "Frontend", sortOrder: 2 },
    { name: "Node.js", category: "Backend", sortOrder: 3 },
    { name: "PostgreSQL", category: "Database", sortOrder: 4 },
  ]);

  await db.insert(projects).values([
    {
      title: "Portfolio Platform",
      slug: "portfolio-platform",
      shortDescription:
        "A dynamic portfolio with admin panel for real-time content management.",
      description:
        "## Overview\n\nBuilt a full-stack portfolio platform with a password-protected admin panel.\n\n## Features\n\n- Dynamic content management\n- 3D hero section\n- Terminal-style UI\n- ISR caching",
      techStack: ["Next.js", "PostgreSQL", "Tailwind CSS", "Framer Motion"],
      featured: true,
      status: "completed",
      sortOrder: 0,
    },
    {
      title: "E-Commerce API",
      slug: "ecommerce-api",
      shortDescription:
        "RESTful API for an e-commerce platform with auth and payments.",
      description:
        "## Overview\n\nScalable e-commerce backend with JWT auth and Stripe integration.",
      techStack: ["Node.js", "PostgreSQL", "Redis", "Stripe"],
      featured: true,
      status: "completed",
      sortOrder: 1,
    },
  ]);

  await db.insert(experience).values([
    {
      company: "Tech Company",
      role: "Full-Stack Developer",
      location: "Remote",
      employmentType: "full_time",
      startDate: "2023-01-01",
      description: "Building and maintaining web applications.",
      achievements: [
        "Reduced page load time by 40%",
        "Led migration to Next.js App Router",
        "Implemented CI/CD pipeline",
      ],
      techUsed: ["Next.js", "TypeScript", "PostgreSQL"],
      sortOrder: 0,
    },
  ]);

  await db.insert(education).values([
    {
      institution: "University",
      degree: "B.Tech Computer Science",
      field: "Computer Science",
      startDate: "2019-08-01",
      endDate: "2023-05-01",
      grade: "8.5 CGPA",
      sortOrder: 0,
    },
  ]);

  await db.insert(certifications).values([
    {
      name: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      issueDate: "2024-01-15",
      sortOrder: 0,
    },
  ]);

  await db.insert(testimonials).values([
    {
      name: "Jane Doe",
      role: "Engineering Manager",
      company: "Tech Corp",
      content:
        "Kaushik is an exceptional developer who consistently delivers high-quality work ahead of schedule.",
      featured: true,
      sortOrder: 0,
    },
  ]);

  await db.insert(stats).values([
    { label: "Projects Completed", value: 12, suffix: "+", sortOrder: 0 },
    { label: "Years Experience", value: 3, sortOrder: 1 },
    { label: "Certifications", value: 2, sortOrder: 2 },
    { label: "Technologies", value: 15, suffix: "+", sortOrder: 3 },
  ]);

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123456";
  const passwordHash = await hash(adminPassword, 12);

  await db.insert(adminUsers).values({
    email: adminEmail,
    passwordHash,
    name: "Admin",
  });

  console.log("Seed completed!");
  console.log(`Admin login: ${adminEmail}`);
  console.log("Password: value of ADMIN_PASSWORD in .env.local");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
