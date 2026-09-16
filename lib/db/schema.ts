import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const availabilityStatusEnum = pgEnum("availability_status", [
  "open_to_work",
  "open_to_freelance",
  "not_looking",
]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "full_time",
  "contract",
  "internship",
  "freelance",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "completed",
  "in_progress",
  "archived",
]);

export const socialPlatformEnum = pgEnum("social_platform", [
  "github",
  "linkedin",
  "twitter",
  "leetcode",
  "website",
  "email",
  "other",
]);

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteName: text("site_name").notNull().default("Portfolio"),
  siteUrl: text("site_url").notNull().default("http://localhost:3000"),
  metaTitle: text("meta_title").notNull().default("Portfolio"),
  metaDescription: text("meta_description").notNull().default(""),
  ogImageUrl: text("og_image_url"),
  maintenanceMode: boolean("maintenance_mode").notNull().default(false),
  terminalBootEnabled: boolean("terminal_boot_enabled").notNull().default(true),
  sectionVisibility: jsonb("section_visibility")
    .$type<Record<string, boolean>>()
    .notNull()
    .default({
      stats: true,
      skills: true,
      experience: true,
      projects: true,
      education: true,
      certifications: true,
      testimonials: true,
      contact: true,
    }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const profile = pgTable("profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull().default("Your Name"),
  preferredName: text("preferred_name"),
  title: text("title").notNull().default("Full-Stack Developer"),
  tagline: text("tagline").notNull().default("Building digital experiences"),
  bio: text("bio").notNull().default(""),
  bioShort: text("bio_short").notNull().default(""),
  profileImageUrl: text("profile_image_url"),
  resumeUrl: text("resume_url"),
  email: text("email").notNull().default("hello@example.com"),
  phone: text("phone"),
  location: text("location").notNull().default("Earth"),
  availabilityStatus: availabilityStatusEnum("availability_status")
    .notNull()
    .default("open_to_work"),
  availabilityMessage: text("availability_message"),
  typedRoles: jsonb("typed_roles").$type<string[]>().notNull().default([]),
  yearsOfExperience: integer("years_of_experience").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const socialLinks = pgTable("social_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  platform: socialPlatformEnum("platform").notNull().default("other"),
  label: text("label").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull().default("General"),
  proficiency: integer("proficiency").notNull().default(3),
  icon: text("icon"),
  yearsUsed: integer("years_used"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull().default(""),
  description: text("description").notNull().default(""),
  thumbnailUrl: text("thumbnail_url"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  techStack: jsonb("tech_stack").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  status: projectStatusEnum("status").notNull().default("completed"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const experience = pgTable("experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  location: text("location").notNull().default("Remote"),
  employmentType: employmentTypeEnum("employment_type")
    .notNull()
    .default("full_time"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  description: text("description").notNull().default(""),
  achievements: jsonb("achievements").$type<string[]>().notNull().default([]),
  techUsed: jsonb("tech_used").$type<string[]>().notNull().default([]),
  companyLogoUrl: text("company_logo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const education = pgTable("education", {
  id: uuid("id").primaryKey().defaultRandom(),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field").notNull().default(""),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  grade: text("grade"),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const certifications = pgTable("certifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: date("issue_date").notNull(),
  expiryDate: date("expiry_date"),
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  badgeImageUrl: text("badge_image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  content: text("content").notNull(),
  avatarUrl: text("avatar_url"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const stats = pgTable("stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  value: integer("value").notNull().default(0),
  suffix: text("suffix"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default("Admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type Profile = typeof profile.$inferSelect;
export type SocialLink = typeof socialLinks.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Experience = typeof experience.$inferSelect;
export type Education = typeof education.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Stat = typeof stats.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
