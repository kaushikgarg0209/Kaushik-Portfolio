import { z } from "zod";

import { DEFAULT_SECTION_VISIBILITY } from "@/lib/sections";

const nullToEmpty = (val: unknown) =>
  val === null || val === undefined ? "" : val;

const nullToUndefined = (val: unknown) =>
  val === null || val === undefined || val === "" ? undefined : val;

const optionalString = z.preprocess(nullToUndefined, z.string().optional());

const requiredString = (label: string) =>
  z.preprocess(
    nullToEmpty,
    z.string().min(1, `${label} is required`),
  );

const optionalUrl = z.preprocess(
  (val) => (val === null || val === undefined || val === "" ? undefined : val),
  z.string().url("Must be a valid URL").optional(),
);

const stringArray = z.preprocess(
  (val) => (Array.isArray(val) ? val : []),
  z.array(z.string()),
);

export const sectionVisibilitySchema = z.object({
  stats: z.boolean(),
  skills: z.boolean(),
  experience: z.boolean(),
  projects: z.boolean(),
  education: z.boolean(),
  certifications: z.boolean(),
  testimonials: z.boolean(),
  contact: z.boolean(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const profileSchema = z.object({
  fullName: requiredString("Full name"),
  preferredName: optionalString,
  title: requiredString("Title"),
  tagline: requiredString("Tagline"),
  bio: requiredString("Bio"),
  bioShort: requiredString("Short bio"),
  profileImageUrl: optionalString,
  resumeUrl: optionalString,
  email: z.preprocess(nullToEmpty, z.string().email("Invalid email")),
  phone: optionalString,
  location: requiredString("Location"),
  availabilityStatus: z.enum([
    "open_to_work",
    "open_to_freelance",
    "not_looking",
  ]),
  availabilityMessage: optionalString,
  typedRoles: z.preprocess(
    (val) => {
      const arr = Array.isArray(val) ? val : [];
      return arr.filter((item) => typeof item === "string" && item.trim());
    },
    z.array(z.string()).min(1, "At least one typewriter role is required"),
  ),
  yearsOfExperience: z.coerce.number().min(0),
});

export const siteSettingsSchema = z.object({
  siteName: requiredString("Site name"),
  siteUrl: z.preprocess(nullToEmpty, z.string().url("Site URL must be valid")),
  metaTitle: requiredString("Meta title"),
  metaDescription: z.preprocess(nullToEmpty, z.string()),
  ogImageUrl: optionalString,
  maintenanceMode: z.boolean(),
  terminalBootEnabled: z.boolean(),
  sectionVisibility: sectionVisibilitySchema.default(DEFAULT_SECTION_VISIBILITY),
});

export const socialLinkSchema = z.object({
  platform: z.enum([
    "github",
    "linkedin",
    "twitter",
    "leetcode",
    "website",
    "email",
    "other",
  ]),
  label: requiredString("Label"),
  url: z.preprocess(nullToEmpty, z.string().url("URL must be valid")),
  sortOrder: z.coerce.number().default(0),
});

export const skillSchema = z.object({
  name: requiredString("Name"),
  category: requiredString("Category"),
  icon: optionalString,
  yearsUsed: z.coerce.number().optional(),
  sortOrder: z.coerce.number().default(0),
});

export const projectSchema = z.object({
  title: requiredString("Title"),
  slug: requiredString("Slug"),
  shortDescription: z.preprocess(nullToEmpty, z.string().max(200)),
  description: z.preprocess(nullToEmpty, z.string()),
  thumbnailUrl: optionalString,
  images: stringArray,
  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  techStack: stringArray,
  featured: z.boolean().default(false),
  status: z.enum(["completed", "in_progress", "archived"]),
  startDate: optionalString,
  endDate: optionalString,
  sortOrder: z.coerce.number().default(0),
});

export const experienceSchema = z.object({
  company: requiredString("Company"),
  role: requiredString("Role"),
  location: requiredString("Location"),
  employmentType: z.enum([
    "full_time",
    "contract",
    "internship",
    "freelance",
  ]),
  startDate: requiredString("Start date"),
  endDate: optionalString,
  description: z.preprocess(nullToEmpty, z.string()),
  achievements: stringArray,
  techUsed: stringArray,
  companyLogoUrl: optionalString,
  sortOrder: z.coerce.number().default(0),
});

export const educationSchema = z.object({
  institution: requiredString("Institution"),
  degree: requiredString("Degree"),
  field: z.preprocess(nullToEmpty, z.string()),
  startDate: requiredString("Start date"),
  endDate: optionalString,
  grade: optionalString,
  description: optionalString,
  sortOrder: z.coerce.number().default(0),
});

export const certificationSchema = z.object({
  name: requiredString("Name"),
  issuer: requiredString("Issuer"),
  issueDate: requiredString("Issue date"),
  expiryDate: optionalString,
  credentialId: optionalString,
  credentialUrl: optionalUrl,
  badgeImageUrl: optionalString,
  sortOrder: z.coerce.number().default(0),
});

export const testimonialSchema = z.object({
  name: requiredString("Name"),
  role: requiredString("Role"),
  company: requiredString("Company"),
  content: requiredString("Quote"),
  avatarUrl: optionalString,
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().default(0),
});

export const statSchema = z.object({
  label: requiredString("Label"),
  value: z.coerce.number().min(0),
  suffix: optionalString,
  sortOrder: z.coerce.number().default(0),
});

export const CONTACT_FIELD_LIMITS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 2000,
} as const;

export const contactSchema = z.object({
  name: z.preprocess(
    nullToEmpty,
    z
      .string()
      .min(1, "Name is required")
      .max(
        CONTACT_FIELD_LIMITS.name,
        `Name must be at most ${CONTACT_FIELD_LIMITS.name} characters`,
      ),
  ),
  email: z.preprocess(
    nullToEmpty,
    z
      .string()
      .email("Invalid email")
      .max(
        CONTACT_FIELD_LIMITS.email,
        `Email must be at most ${CONTACT_FIELD_LIMITS.email} characters`,
      ),
  ),
  subject: z.preprocess(
    nullToUndefined,
    z
      .string()
      .max(
        CONTACT_FIELD_LIMITS.subject,
        `Subject must be at most ${CONTACT_FIELD_LIMITS.subject} characters`,
      )
      .optional(),
  ),
  message: z.preprocess(
    nullToEmpty,
    z
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(
        CONTACT_FIELD_LIMITS.message,
        `Message must be at most ${CONTACT_FIELD_LIMITS.message} characters`,
      ),
  ),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
